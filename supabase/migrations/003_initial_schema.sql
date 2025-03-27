-- Drop existing tables and types
DROP TABLE IF EXISTS public.documents CASCADE;
DROP TABLE IF EXISTS public.chat_messages CASCADE;
DROP TABLE IF EXISTS public.chat_rooms CASCADE;
DROP TABLE IF EXISTS public.forum_comments CASCADE;
DROP TABLE IF EXISTS public.forum_posts CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.block_spaces CASCADE;

DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS post_status CASCADE;
DROP TYPE IF EXISTS document_status CASCADE;
DROP TYPE IF EXISTS chat_message_type CASCADE;
DROP TYPE IF EXISTS chat_room_type CASCADE;

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('admin', 'owner', 'tenant');
CREATE TYPE post_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE document_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE chat_message_type AS ENUM ('text', 'image', 'file');
CREATE TYPE chat_room_type AS ENUM ('direct', 'group');

-- Create block_spaces table
CREATE TABLE IF NOT EXISTS public.block_spaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    owner_id UUID NOT NULL,
    settings JSONB DEFAULT '{}'::jsonb,
    UNIQUE(name)
);

ALTER TABLE public.block_spaces ENABLE ROW LEVEL SECURITY;

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role user_role DEFAULT 'tenant',
    block_space_id UUID REFERENCES public.block_spaces(id),
    metadata JSONB DEFAULT '{}'::jsonb
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create forum_posts table
CREATE TABLE IF NOT EXISTS public.forum_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id UUID REFERENCES public.users(id) NOT NULL,
    block_space_id UUID REFERENCES public.block_spaces(id) NOT NULL,
    category TEXT,
    status post_status DEFAULT 'published',
    metadata JSONB DEFAULT '{}'::jsonb
);

ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;

-- Create forum_comments table
CREATE TABLE IF NOT EXISTS public.forum_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    content TEXT NOT NULL,
    author_id UUID REFERENCES public.users(id) NOT NULL,
    post_id UUID REFERENCES public.forum_posts(id) NOT NULL,
    parent_id UUID REFERENCES public.forum_comments(id),
    metadata JSONB DEFAULT '{}'::jsonb
);

ALTER TABLE public.forum_comments ENABLE ROW LEVEL SECURITY;

-- Create chat_rooms table
CREATE TABLE IF NOT EXISTS public.chat_rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT,
    type chat_room_type DEFAULT 'group',
    block_space_id UUID REFERENCES public.block_spaces(id) NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb
);

ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    content TEXT NOT NULL,
    sender_id UUID REFERENCES public.users(id) NOT NULL,
    room_id UUID REFERENCES public.chat_rooms(id) NOT NULL,
    type chat_message_type DEFAULT 'text',
    metadata JSONB DEFAULT '{}'::jsonb
);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Create documents table
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    uploaded_by UUID REFERENCES public.users(id) NOT NULL,
    block_space_id UUID REFERENCES public.block_spaces(id) NOT NULL,
    category TEXT,
    status document_status DEFAULT 'published',
    metadata JSONB DEFAULT '{}'::jsonb
);

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Block Spaces Policies
CREATE POLICY "Block spaces are viewable by authenticated users"
    ON public.block_spaces
    FOR SELECT
    TO authenticated
    USING (
        auth.uid() IN (
            SELECT id FROM public.users 
            WHERE role = 'admin' 
            OR block_space_id = block_spaces.id 
            OR id = block_spaces.owner_id
        )
    );

CREATE POLICY "Block spaces are insertable by admin users"
    ON public.block_spaces
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'owner')
        )
    );

CREATE POLICY "Block spaces are updatable by owners and admins"
    ON public.block_spaces
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND (role = 'admin' OR id = block_spaces.owner_id)
        )
    );

-- Users Policies
CREATE POLICY "Users are viewable by authenticated users"
    ON public.users
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can update their own profile"
    ON public.users
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);

-- Forum Posts Policies
CREATE POLICY "Forum posts are viewable by block space members"
    ON public.forum_posts
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND (role = 'admin' OR block_space_id = forum_posts.block_space_id)
        )
    );

CREATE POLICY "Forum posts are insertable by block space members"
    ON public.forum_posts
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND block_space_id = forum_posts.block_space_id
        )
    );

-- Forum Comments Policies
CREATE POLICY "Forum comments are viewable by block space members"
    ON public.forum_comments
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users u
            JOIN public.forum_posts p ON p.block_space_id = u.block_space_id
            WHERE u.id = auth.uid() 
            AND p.id = forum_comments.post_id
        )
    );

-- Chat Rooms Policies
CREATE POLICY "Chat rooms are viewable by block space members"
    ON public.chat_rooms
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND (role = 'admin' OR block_space_id = chat_rooms.block_space_id)
        )
    );

-- Chat Messages Policies
CREATE POLICY "Chat messages are viewable by room members"
    ON public.chat_messages
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users u
            JOIN public.chat_rooms r ON r.block_space_id = u.block_space_id
            WHERE u.id = auth.uid() 
            AND r.id = chat_messages.room_id
        )
    );

-- Documents Policies
CREATE POLICY "Documents are viewable by block space members"
    ON public.documents
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND (role = 'admin' OR block_space_id = documents.block_space_id)
        )
    );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_block_space ON public.users(block_space_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_block_space ON public.forum_posts(block_space_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_author ON public.forum_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_forum_comments_post ON public.forum_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_forum_comments_author ON public.forum_comments(author_id);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_block_space ON public.chat_rooms(block_space_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_room ON public.chat_messages(room_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_sender ON public.chat_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_documents_block_space ON public.documents(block_space_id);
CREATE INDEX IF NOT EXISTS idx_documents_uploaded_by ON public.documents(uploaded_by); 
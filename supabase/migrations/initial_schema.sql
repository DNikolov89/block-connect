-- Enable RLS
alter table public.users enable row level security;
alter table public.block_spaces enable row level security;
alter table public.forum_posts enable row level security;
alter table public.forum_comments enable row level security;
alter table public.chat_rooms enable row level security;
alter table public.chat_messages enable row level security;
alter table public.documents enable row level security;

-- Create tables
create table public.block_spaces (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  description text,
  address text not null,
  owner_id uuid references auth.users(id) not null,
  settings jsonb
);

create table public.users (
  id uuid references auth.users(id) primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  email text not null unique,
  full_name text not null,
  avatar_url text,
  role text not null check (role in ('admin', 'owner', 'tenant')),
  block_space_id uuid references public.block_spaces(id)
);

create table public.forum_posts (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  content text not null,
  author_id uuid references auth.users(id) not null,
  block_space_id uuid references public.block_spaces(id) not null,
  category text not null,
  status text not null check (status in ('open', 'closed', 'resolved')) default 'open'
);

create table public.forum_comments (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  content text not null,
  author_id uuid references auth.users(id) not null,
  post_id uuid references public.forum_posts(id) not null
);

create table public.chat_rooms (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  type text not null check (type in ('direct', 'group')),
  block_space_id uuid references public.block_spaces(id) not null
);

create table public.chat_messages (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  content text not null,
  sender_id uuid references auth.users(id) not null,
  room_id uuid references public.chat_rooms(id) not null,
  type text not null check (type in ('text', 'image', 'file')) default 'text'
);

create table public.documents (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  description text,
  file_url text not null,
  uploaded_by uuid references auth.users(id) not null,
  block_space_id uuid references public.block_spaces(id) not null,
  category text not null,
  status text not null check (status in ('pending', 'approved', 'rejected')) default 'pending'
);

-- Create RLS policies
create policy "Users can view their own data and data from their block space"
  on public.users for select
  using (
    auth.uid() = id
    or block_space_id in (
      select id from public.block_spaces
      where owner_id = auth.uid()
      or id = (select block_space_id from public.users where id = auth.uid())
    )
  );

create policy "Block space owners can manage their block space"
  on public.block_spaces for all
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy "Users can view their block space"
  on public.block_spaces for select
  using (
    id in (
      select block_space_id from public.users
      where id = auth.uid()
    )
  );

create policy "Users can manage posts in their block space"
  on public.forum_posts for all
  using (
    block_space_id in (
      select block_space_id from public.users
      where id = auth.uid()
    )
  )
  with check (
    block_space_id in (
      select block_space_id from public.users
      where id = auth.uid()
    )
  );

create policy "Users can manage comments on posts they can see"
  on public.forum_comments for all
  using (
    post_id in (
      select id from public.forum_posts
      where block_space_id in (
        select block_space_id from public.users
        where id = auth.uid()
      )
    )
  )
  with check (
    post_id in (
      select id from public.forum_posts
      where block_space_id in (
        select block_space_id from public.users
        where id = auth.uid()
      )
    )
  );

create policy "Users can manage chat rooms in their block space"
  on public.chat_rooms for all
  using (
    block_space_id in (
      select block_space_id from public.users
      where id = auth.uid()
    )
  )
  with check (
    block_space_id in (
      select block_space_id from public.users
      where id = auth.uid()
    )
  );

create policy "Users can manage messages in their chat rooms"
  on public.chat_messages for all
  using (
    room_id in (
      select id from public.chat_rooms
      where block_space_id in (
        select block_space_id from public.users
        where id = auth.uid()
      )
    )
  )
  with check (
    room_id in (
      select id from public.chat_rooms
      where block_space_id in (
        select block_space_id from public.users
        where id = auth.uid()
      )
    )
  );

create policy "Users can manage documents in their block space"
  on public.documents for all
  using (
    block_space_id in (
      select block_space_id from public.users
      where id = auth.uid()
    )
  )
  with check (
    block_space_id in (
      select block_space_id from public.users
      where id = auth.uid()
    )
  );

-- Create indexes for better performance
create index block_spaces_owner_id_idx on public.block_spaces(owner_id);
create index users_block_space_id_idx on public.users(block_space_id);
create index forum_posts_block_space_id_idx on public.forum_posts(block_space_id);
create index forum_posts_author_id_idx on public.forum_posts(author_id);
create index forum_comments_post_id_idx on public.forum_comments(post_id);
create index forum_comments_author_id_idx on public.forum_comments(author_id);
create index chat_rooms_block_space_id_idx on public.chat_rooms(block_space_id);
create index chat_messages_room_id_idx on public.chat_messages(room_id);
create index chat_messages_sender_id_idx on public.chat_messages(sender_id);
create index documents_block_space_id_idx on public.documents(block_space_id);
create index documents_uploaded_by_idx on public.documents(uploaded_by); 
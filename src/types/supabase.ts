export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      block_spaces: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string | null
          address: string
          owner_id: string
          settings: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description?: string | null
          address: string
          owner_id: string
          settings?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string | null
          address?: string
          owner_id?: string
          settings?: Json | null
        }
      }
      users: {
        Row: {
          id: string
          created_at: string
          email: string
          full_name: string
          avatar_url: string | null
          role: 'admin' | 'owner' | 'tenant'
          block_space_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          email: string
          full_name: string
          avatar_url?: string | null
          role?: 'admin' | 'owner' | 'tenant'
          block_space_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          full_name?: string
          avatar_url?: string | null
          role?: 'admin' | 'owner' | 'tenant'
          block_space_id?: string | null
        }
      }
      forum_posts: {
        Row: {
          id: string
          created_at: string
          title: string
          content: string
          author_id: string
          block_space_id: string
          category: string
          status: 'open' | 'closed' | 'resolved'
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          content: string
          author_id: string
          block_space_id: string
          category: string
          status?: 'open' | 'closed' | 'resolved'
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          content?: string
          author_id?: string
          block_space_id?: string
          category?: string
          status?: 'open' | 'closed' | 'resolved'
        }
      }
      forum_comments: {
        Row: {
          id: string
          created_at: string
          content: string
          author_id: string
          post_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          content: string
          author_id: string
          post_id: string
        }
        Update: {
          id?: string
          created_at?: string
          content?: string
          author_id?: string
          post_id?: string
        }
      }
      chat_rooms: {
        Row: {
          id: string
          created_at: string
          name: string
          type: 'direct' | 'group'
          block_space_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          type: 'direct' | 'group'
          block_space_id: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          type?: 'direct' | 'group'
          block_space_id?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          created_at: string
          content: string
          sender_id: string
          room_id: string
          type: 'text' | 'image' | 'file'
        }
        Insert: {
          id?: string
          created_at?: string
          content: string
          sender_id: string
          room_id: string
          type?: 'text' | 'image' | 'file'
        }
        Update: {
          id?: string
          created_at?: string
          content?: string
          sender_id?: string
          room_id?: string
          type?: 'text' | 'image' | 'file'
        }
      }
      documents: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string | null
          file_url: string
          uploaded_by: string
          block_space_id: string
          category: string
          status: 'pending' | 'approved' | 'rejected'
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description?: string | null
          file_url: string
          uploaded_by: string
          block_space_id: string
          category: string
          status?: 'pending' | 'approved' | 'rejected'
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string | null
          file_url?: string
          uploaded_by?: string
          block_space_id?: string
          category?: string
          status?: 'pending' | 'approved' | 'rejected'
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 
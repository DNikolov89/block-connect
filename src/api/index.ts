import { supabase } from '@/integrations/supabase/client';
import type { User, Announcement, Document, ForumThread, ApiResponse, PaginatedResponse } from '@/types';

// Auth API
export const authApi = {
  login: async (email: string, password: string): Promise<ApiResponse<User>> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { data: data.user as User, status: 200 };
    } catch (error) {
      return { 
        data: null as any, 
        error: error.message, 
        status: 400 
      };
    }
  },

  register: async (userData: Omit<User, 'id'>, password: string): Promise<ApiResponse<User>> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password,
        options: {
          data: userData,
        },
      });

      if (error) throw error;
      return { data: data.user as User, status: 200 };
    } catch (error) {
      return { 
        data: null as any, 
        error: error.message, 
        status: 400 
      };
    }
  },

  logout: async (): Promise<ApiResponse<void>> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { data: undefined, status: 200 };
    } catch (error) {
      return { 
        data: undefined, 
        error: error.message, 
        status: 400 
      };
    }
  },
};

// Announcements API
export const announcementsApi = {
  getAll: async (): Promise<PaginatedResponse<Announcement[]>> => {
    try {
      const { data, error, count } = await supabase
        .from('announcements')
        .select('*', { count: 'exact' });

      if (error) throw error;
      return { 
        data: data as Announcement[], 
        total: count || 0,
        page: 1,
        pageSize: 10,
        status: 200 
      };
    } catch (error) {
      return { 
        data: [], 
        error: error.message, 
        total: 0,
        page: 1,
        pageSize: 10,
        status: 400 
      };
    }
  },

  create: async (announcement: Omit<Announcement, 'id'>): Promise<ApiResponse<Announcement>> => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .insert([announcement])
        .select()
        .single();

      if (error) throw error;
      return { data, status: 201 };
    } catch (error) {
      return { 
        data: null as any, 
        error: error.message, 
        status: 400 
      };
    }
  },

  update: async (id: string, updates: Partial<Announcement>): Promise<ApiResponse<Announcement>> => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data, status: 200 };
    } catch (error) {
      return { 
        data: null as any, 
        error: error.message, 
        status: 400 
      };
    }
  },
};

// Documents API
export const documentsApi = {
  getAll: async (): Promise<PaginatedResponse<Document[]>> => {
    try {
      const { data, error, count } = await supabase
        .from('documents')
        .select('*', { count: 'exact' });

      if (error) throw error;
      return { 
        data: data as Document[], 
        total: count || 0,
        page: 1,
        pageSize: 10,
        status: 200 
      };
    } catch (error) {
      return { 
        data: [], 
        error: error.message, 
        total: 0,
        page: 1,
        pageSize: 10,
        status: 400 
      };
    }
  },

  upload: async (file: File, metadata: Omit<Document, 'id'>): Promise<ApiResponse<Document>> => {
    try {
      // Upload file to storage
      const fileName = `${Date.now()}-${file.name}`;
      const { data: fileData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Create document record
      const { data, error } = await supabase
        .from('documents')
        .insert([{ ...metadata, name: fileName }])
        .select()
        .single();

      if (error) throw error;
      return { data, status: 201 };
    } catch (error) {
      return { 
        data: null as any, 
        error: error.message, 
        status: 400 
      };
    }
  },
};

// Forum API
export const forumApi = {
  getThreads: async (category?: string): Promise<PaginatedResponse<ForumThread[]>> => {
    try {
      let query = supabase.from('forum_threads').select('*', { count: 'exact' });
      
      if (category) {
        query = query.eq('category', category);
      }

      const { data, error, count } = await query;

      if (error) throw error;
      return { 
        data: data as ForumThread[], 
        total: count || 0,
        page: 1,
        pageSize: 10,
        status: 200 
      };
    } catch (error) {
      return { 
        data: [], 
        error: error.message, 
        total: 0,
        page: 1,
        pageSize: 10,
        status: 400 
      };
    }
  },

  createThread: async (thread: Omit<ForumThread, 'id'>): Promise<ApiResponse<ForumThread>> => {
    try {
      const { data, error } = await supabase
        .from('forum_threads')
        .insert([thread])
        .select()
        .single();

      if (error) throw error;
      return { data, status: 201 };
    } catch (error) {
      return { 
        data: null as any, 
        error: error.message, 
        status: 400 
      };
    }
  },
}; 
import { supabase } from '@/integrations/supabase/client';
import type { User, ApiResponse, PaginatedResponse } from '@/types';

export const usersApi = {
  getAll: async (): Promise<PaginatedResponse<User[]>> => {
    try {
      const { data, error, count } = await supabase
        .from('users')
        .select('*', { count: 'exact' });

      if (error) throw error;
      return { 
        data: data as User[], 
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

  updateRole: async (userId: string, role: string): Promise<ApiResponse<User>> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ role })
        .eq('id', userId)
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

  delete: async (userId: string): Promise<ApiResponse<void>> => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

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
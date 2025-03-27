import { supabase } from '@/integrations/supabase/client';
import type { BlockSpace, BlockSpaceApplication, CreateBlockSpaceInput, UpdateBlockSpaceInput, ApiResponse, PaginatedResponse } from '@/types';

export const blockSpacesApi = {
  getAll: async (): Promise<PaginatedResponse<BlockSpace[]>> => {
    try {
      const { data, error, count } = await supabase
        .from('block_spaces')
        .select('*', { count: 'exact' });

      if (error) throw error;
      return { 
        data: data as BlockSpace[], 
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

  getById: async (id: string): Promise<ApiResponse<BlockSpace>> => {
    try {
      const { data, error } = await supabase
        .from('block_spaces')
        .select('*')
        .eq('id', id)
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

  create: async (input: CreateBlockSpaceInput, userId: string): Promise<ApiResponse<BlockSpace>> => {
    try {
      const { data, error } = await supabase
        .from('block_spaces')
        .insert([{
          ...input,
          admin_ids: [userId],
          status: 'pending'
        }])
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

  update: async (id: string, input: UpdateBlockSpaceInput): Promise<ApiResponse<BlockSpace>> => {
    try {
      const { data, error } = await supabase
        .from('block_spaces')
        .update(input)
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

  delete: async (id: string): Promise<ApiResponse<void>> => {
    try {
      const { error } = await supabase
        .from('block_spaces')
        .delete()
        .eq('id', id);

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

  // Block Space Applications
  createApplication: async (userId: string, blockSpaceId: string): Promise<ApiResponse<BlockSpaceApplication>> => {
    try {
      const { data, error } = await supabase
        .from('block_space_applications')
        .insert([{
          user_id: userId,
          block_space_id: blockSpaceId,
          status: 'pending'
        }])
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

  updateApplicationStatus: async (
    applicationId: string, 
    status: BlockSpaceApplication['status'],
    notes?: string
  ): Promise<ApiResponse<BlockSpaceApplication>> => {
    try {
      const { data, error } = await supabase
        .from('block_space_applications')
        .update({ status, notes })
        .eq('id', applicationId)
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

  getApplications: async (blockSpaceId: string): Promise<PaginatedResponse<BlockSpaceApplication[]>> => {
    try {
      const { data, error, count } = await supabase
        .from('block_space_applications')
        .select('*', { count: 'exact' })
        .eq('block_space_id', blockSpaceId);

      if (error) throw error;
      return { 
        data: data as BlockSpaceApplication[], 
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
  }
}; 
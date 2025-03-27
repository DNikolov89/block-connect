import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import { useAuth } from '@/contexts/AuthContext';

type BlockSpace = Database['public']['Tables']['block_spaces']['Row'];

export function useBlockSpaces() {
  const [blockSpaces, setBlockSpaces] = useState<BlockSpace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    
    const fetchBlockSpaces = async () => {
      try {
        setLoading(true);
        setError(null);

        let query = supabase
          .from('block_spaces')
          .select('*');

        // If not admin, only fetch relevant block spaces
        if (user.role !== 'admin') {
          query = query.or(`owner_id.eq.${user.id},id.eq.${user.block_space_id}`);
        }

        const { data, error } = await query;

        if (error) throw error;
        setBlockSpaces(data || []);
      } catch (err) {
        console.error('Error fetching block spaces:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBlockSpaces();

    // Subscribe to changes
    const subscription = supabase
      .channel('block_spaces_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'block_spaces' }, 
        (payload) => {
          // Update local state based on the change
          if (payload.eventType === 'INSERT') {
            setBlockSpaces(prev => [...prev, payload.new as BlockSpace]);
          } else if (payload.eventType === 'DELETE') {
            setBlockSpaces(prev => prev.filter(bs => bs.id !== payload.old.id));
          } else if (payload.eventType === 'UPDATE') {
            setBlockSpaces(prev => prev.map(bs => 
              bs.id === payload.new.id ? payload.new as BlockSpace : bs
            ));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const createBlockSpace = async (data: {
    name: string;
    description?: string;
    address: string;
  }) => {
    try {
      setError(null);
      const { data: newBlockSpace, error } = await supabase
        .from('block_spaces')
        .insert([
          {
            ...data,
            owner_id: user?.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return newBlockSpace;
    } catch (err) {
      console.error('Error creating block space:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const updateBlockSpace = async (
    id: string,
    data: Partial<Omit<BlockSpace, 'id' | 'created_at' | 'owner_id'>>
  ) => {
    try {
      setError(null);
      const { data: updatedBlockSpace, error } = await supabase
        .from('block_spaces')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return updatedBlockSpace;
    } catch (err) {
      console.error('Error updating block space:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const deleteBlockSpace = async (id: string) => {
    try {
      setError(null);
      const { error } = await supabase
        .from('block_spaces')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      console.error('Error deleting block space:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  return {
    blockSpaces,
    loading,
    error,
    createBlockSpace,
    updateBlockSpace,
    deleteBlockSpace,
  };
} 
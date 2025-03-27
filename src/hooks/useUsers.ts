import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import { useAuth } from '@/contexts/AuthContext';

type User = Database['public']['Tables']['users']['Row'];

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setUsers(data || []);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();

    // Subscribe to changes
    const subscription = supabase
      .channel('users_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, 
        (payload) => {
          // Update local state based on the change
          if (payload.eventType === 'INSERT') {
            setUsers(prev => [payload.new as User, ...prev]);
          } else if (payload.eventType === 'DELETE') {
            setUsers(prev => prev.filter(u => u.id !== payload.old.id));
          } else if (payload.eventType === 'UPDATE') {
            setUsers(prev => prev.map(u => 
              u.id === payload.new.id ? payload.new as User : u
            ));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const updateUserRole = async (userId: string, role: 'admin' | 'owner' | 'tenant') => {
    try {
      setError(null);
      const { error } = await supabase
        .from('users')
        .update({ role })
        .eq('id', userId);

      if (error) throw error;
    } catch (err) {
      console.error('Error updating user role:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const updateUserBlockSpace = async (userId: string, blockSpaceId: string | null) => {
    try {
      setError(null);
      const { error } = await supabase
        .from('users')
        .update({ block_space_id: blockSpaceId })
        .eq('id', userId);

      if (error) throw error;
    } catch (err) {
      console.error('Error updating user block space:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      setError(null);
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) throw error;
    } catch (err) {
      console.error('Error deleting user:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  return {
    users,
    loading,
    error,
    updateUserRole,
    updateUserBlockSpace,
    deleteUser,
  };
} 
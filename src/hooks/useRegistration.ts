import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

interface RegistrationData {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  blockSpaceId?: string;
  role?: 'admin' | 'owner' | 'tenant';
}

interface BlockSpaceRegistrationData {
  name: string;
  description?: string;
  address: string;
}

export function useRegistration() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const register = async (data: RegistrationData) => {
    try {
      setLoading(true);
      setError(null);

      // 1. Sign up with Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
          },
        },
      });

      if (signUpError) throw signUpError;

      // 2. Create user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user!.id,
            first_name: data.fullName.split(' ')[0],
            last_name: data.fullName.split(' ').slice(1).join(' '),
            phone: data.phone,
          },
        ]);

      if (profileError) throw profileError;

      // 3. Update user record with additional info
      const { error: userError } = await supabase
        .from('users')
        .update({
          full_name: data.fullName,
          role: data.role || 'tenant',
          block_space_id: data.blockSpaceId,
        })
        .eq('id', authData.user!.id);

      if (userError) throw userError;

      // 4. Navigate to success page or dashboard
      navigate('/login?registered=true');

    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during registration');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const registerWithBlockSpace = async (
    userData: RegistrationData,
    blockSpaceData: BlockSpaceRegistrationData
  ) => {
    try {
      setLoading(true);
      setError(null);

      // 1. Sign up with Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.fullName,
          },
        },
      });

      if (signUpError) throw signUpError;

      // 2. Create block space
      const { data: blockSpace, error: blockSpaceError } = await supabase
        .from('block_spaces')
        .insert([
          {
            name: blockSpaceData.name,
            description: blockSpaceData.description,
            address: blockSpaceData.address,
            owner_id: authData.user!.id,
          },
        ])
        .select()
        .single();

      if (blockSpaceError) throw blockSpaceError;

      // 3. Create user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user!.id,
            first_name: userData.fullName.split(' ')[0],
            last_name: userData.fullName.split(' ').slice(1).join(' '),
            phone: userData.phone,
          },
        ]);

      if (profileError) throw profileError;

      // 4. Update user record with additional info
      const { error: userError } = await supabase
        .from('users')
        .update({
          full_name: userData.fullName,
          role: 'owner',
          block_space_id: blockSpace.id,
        })
        .eq('id', authData.user!.id);

      if (userError) throw userError;

      // 5. Navigate to success page or dashboard
      navigate('/login?registered=true');

    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during registration');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    registerWithBlockSpace,
    loading,
    error,
  };
} 
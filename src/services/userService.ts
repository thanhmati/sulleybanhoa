import { supabase } from '@/lib/supabase';
import { ICreateUser, IUpdateUser, IUpdateUserRoles, IUser, IUserListItem } from '@/types/user';

function mapProfileFromDb(dbProfile: any): IUser {
  return {
    id: dbProfile.id,
    fullName: dbProfile.full_name,
    email: dbProfile.email,
    roles: dbProfile.roles || [],
    avatar: dbProfile.avatar_url || '',
    createdAt: new Date(dbProfile.created_at),
    updatedAt: new Date(dbProfile.updated_at),
  };
}

function mapProfileListItemFromDb(dbProfile: any): IUserListItem {
  const roles = dbProfile.roles || [];
  return {
    id: dbProfile.id,
    fullName: dbProfile.full_name,
    email: dbProfile.email,
    avatar: dbProfile.avatar_url || '',
    roles,
    roleNames: roles,
    isAdmin: roles.includes('administrator'),
    createdAt: new Date(dbProfile.created_at),
    updatedAt: new Date(dbProfile.updated_at),
  };
}

function generateRandomPassword(length = 12): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+~';

  let password = '';
  // Pick at least one from each category
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  const allChars = uppercase + lowercase + numbers + symbols;
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle
  return password
    .split('')
    .sort(() => 0.5 - Math.random())
    .join('');
}

export const userService = {
  getMe: async (): Promise<IUser> => {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) throw authError || new Error('No user session');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    if (profileError) throw profileError;
    return mapProfileFromDb(profile);
  },

  updateMe: async (data: IUpdateUser): Promise<IUser> => {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) throw authError || new Error('No user session');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .update({
        full_name: data.fullName,
        avatar_url: data.avatar,
      })
      .eq('id', user.id)
      .select()
      .single();
    if (profileError) throw profileError;
    return mapProfileFromDb(profile);
  },

  getAll: async (): Promise<IUserListItem[]> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(mapProfileListItemFromDb);
  },

  getById: async (id: string): Promise<IUser> => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
    if (error) throw error;
    return mapProfileFromDb(data);
  },

  updateUserRoles: async (id: string, data: IUpdateUserRoles): Promise<string> => {
    const { error } = await supabase
      .from('profiles')
      .update({
        roles: data.roles,
      })
      .eq('id', id);
    if (error) throw error;
    return 'User roles updated successfully';
  },

  create: async (data: ICreateUser): Promise<{ message: string; password?: string }> => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

    // 1. Generate a strong random password
    const password = generateRandomPassword(12);

    // 2. Instantiate a secondary Supabase client with persistSession: false
    const { createClient } = await import('@supabase/supabase-js');
    const secondaryClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    // 3. Call signUp to create the new account
    const { data: signUpData, error: signUpError } = await secondaryClient.auth.signUp({
      email: data.email,
      password: password,
      options: {
        data: {
          full_name: data.fullName,
        },
      },
    });

    if (signUpError) {
      throw signUpError;
    }

    const newUser = signUpData.user;
    if (!newUser) {
      throw new Error('Đăng ký tài khoản thất bại: Không nhận được thông tin user mới');
    }

    // 4. Update profiles roles using the primary admin client
    const { error: roleUpdateError } = await supabase
      .from('profiles')
      .update({
        roles: data.roles,
      })
      .eq('id', newUser.id);

    if (roleUpdateError) {
      throw roleUpdateError;
    }

    return {
      message: 'Tạo tài khoản thành công',
      password: password,
    };
  },

  delete: async (id: string): Promise<string> => {
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (error) throw error;
    return 'User deleted successfully';
  },
};

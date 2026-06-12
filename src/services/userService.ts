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

  create: async (data: ICreateUser): Promise<string> => {
    const { data: resData, error } = await supabase.functions.invoke('create-user', {
      body: data,
    });
    if (error) throw error;
    return resData?.message || 'User created successfully';
  },

  delete: async (id: string): Promise<string> => {
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (error) throw error;
    return 'User deleted successfully';
  },
};

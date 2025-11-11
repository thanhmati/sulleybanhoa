import { userService } from '@/services/userService';
import { IUpdateUserRoles, IUser, IUserListItem } from '@/types/user';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const CURRENT_USER_QUERY_KEY = ['current_user'];
const USERS_QUERY_KEY = ['users'];
const USER_QUERY_KEY = ['user'];

export function useCurrentUserQuery() {
  return useQuery<IUser>({
    queryKey: CURRENT_USER_QUERY_KEY,
    queryFn: userService.getMe,
  });
}

export function useUpdateCurrentUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userService.updateMe,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CURRENT_USER_QUERY_KEY }),
  });
}

export function useUsersQuery() {
  return useQuery<IUserListItem[]>({
    queryKey: [USERS_QUERY_KEY],
    queryFn: userService.getAll,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userService.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY }),
  });
}

export function useUpdateUserRoles() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IUpdateUserRoles }) =>
      userService.updateUserRoles(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY }),
  });
}

export function useUserQuery() {
  return useQuery<IUser>({
    queryKey: [USER_QUERY_KEY],
    queryFn: ({ queryKey }) => {
      const [, userId] = queryKey as [string, string];
      return userService.getById(userId);
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userService.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY }),
  });
}

import { userService } from '@/services/userService';
import { IUser, IUserListItem } from '@/types/user';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const CURRENT_USER_QUERY_KEY = ['current_user'];
const USERS_QUERY_KEY = ['users'];

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

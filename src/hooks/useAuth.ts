import { authService } from '@/services/authService';
import { useMutation } from '@tanstack/react-query';

export function useLogin() {
  return useMutation({
    mutationFn: authService.login,
    onSuccess: () => {},
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: authService.changePassword,
    onSuccess: () => {},
  });
}

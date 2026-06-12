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

export function useRegister() {
  return useMutation({
    mutationFn: ({
      email,
      password,
      fullName,
    }: {
      email: string;
      password: string;
      fullName: string;
    }) => authService.register(email, password, fullName),
    onSuccess: () => {},
  });
}

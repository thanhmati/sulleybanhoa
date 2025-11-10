import { mediaService } from '@/services/mediaService';
import { useMutation } from '@tanstack/react-query';

export function useUpdateMultipleFile() {
  return useMutation({
    mutationFn: mediaService.uploadMultiple,
  });
}

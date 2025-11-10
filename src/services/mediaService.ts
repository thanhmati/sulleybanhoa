import api from '@/lib/axios';

export const mediaService = {
  uploadMultiple: async (files: File[]): Promise<string[]> => {
    const formData = new FormData();

    for (const file of files) {
      formData.append('files', file);
    }

    const res = await api.post('/media', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return res.data;
  },
};

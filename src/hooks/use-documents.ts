import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentsApi } from '@/api';
import type { Document } from '@/types';

export const useDocuments = () => {
  return useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const response = await documentsApi.getAll();
      if (response.error) throw new Error(response.error);
      return response.data;
    },
  });
};

export const useUploadDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ file, metadata }: { file: File; metadata: Omit<Document, 'id'> }) => {
      const response = await documentsApi.upload(file, metadata);
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}; 
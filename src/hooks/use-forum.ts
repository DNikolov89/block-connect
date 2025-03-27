import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { forumApi } from '@/api';
import type { ForumThread } from '@/types';

export const useForumThreads = (category?: string) => {
  return useQuery({
    queryKey: ['forum-threads', category],
    queryFn: async () => {
      const response = await forumApi.getThreads(category);
      if (response.error) throw new Error(response.error);
      return response.data;
    },
  });
};

export const useCreateThread = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (thread: Omit<ForumThread, 'id'>) => {
      const response = await forumApi.createThread(thread);
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum-threads'] });
    },
  });
}; 
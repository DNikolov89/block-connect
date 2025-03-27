import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { announcementsApi } from '@/api';
import type { Announcement } from '@/types';

export const useAnnouncements = () => {
  return useQuery({
    queryKey: ['announcements'],
    queryFn: async () => {
      const response = await announcementsApi.getAll();
      if (response.error) throw new Error(response.error);
      return response.data;
    },
  });
};

export const useCreateAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (announcement: Omit<Announcement, 'id'>) => {
      const response = await announcementsApi.create(announcement);
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });
};

export const useUpdateAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Announcement> }) => {
      const response = await announcementsApi.update(id, updates);
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });
}; 
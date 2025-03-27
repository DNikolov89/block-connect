import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { blockSpacesApi } from '@/api/blockSpaces';
import { toast } from 'sonner';
import type { CreateBlockSpaceInput, UpdateBlockSpaceInput } from '@/types';

export const useBlockSpaces = () => {
  const queryClient = useQueryClient();

  const { data: blockSpaces, isLoading, error } = useQuery({
    queryKey: ['blockSpaces'],
    queryFn: blockSpacesApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: ({ input, userId }: { input: CreateBlockSpaceInput; userId: string }) =>
      blockSpacesApi.create(input, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blockSpaces'] });
      toast.success('Block space created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create block space: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateBlockSpaceInput }) =>
      blockSpacesApi.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blockSpaces'] });
      toast.success('Block space updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update block space: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: blockSpacesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blockSpaces'] });
      toast.success('Block space deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete block space: ${error.message}`);
    },
  });

  const createApplicationMutation = useMutation({
    mutationFn: ({ userId, blockSpaceId }: { userId: string; blockSpaceId: string }) =>
      blockSpacesApi.createApplication(userId, blockSpaceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blockSpaces'] });
      toast.success('Application submitted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to submit application: ${error.message}`);
    },
  });

  const updateApplicationStatusMutation = useMutation({
    mutationFn: ({ 
      applicationId, 
      status, 
      notes 
    }: { 
      applicationId: string; 
      status: 'pending' | 'approved' | 'rejected';
      notes?: string;
    }) => blockSpacesApi.updateApplicationStatus(applicationId, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blockSpaces'] });
      toast.success('Application status updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update application status: ${error.message}`);
    },
  });

  return {
    blockSpaces: blockSpaces?.data || [],
    isLoading,
    error,
    createBlockSpace: createMutation.mutate,
    updateBlockSpace: updateMutation.mutate,
    deleteBlockSpace: deleteMutation.mutate,
    createApplication: createApplicationMutation.mutate,
    updateApplicationStatus: updateApplicationStatusMutation.mutate,
  };
}; 
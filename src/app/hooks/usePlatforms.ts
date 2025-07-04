import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { connectionService, Platform } from '../lib/services/connectionService';

export const usePlatforms = () =>
  useQuery<Platform[]>({
    queryKey: ['platforms'],
    queryFn: connectionService.getPlatforms,
    staleTime: Infinity,
  });

export const useSavePlatformOrder = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: connectionService.savePlatformOrder,
    onSuccess: (data) => {
      client.setQueryData(['platforms'], data);
    },
  });
};


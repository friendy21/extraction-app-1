import { useQuery, useQueryClient } from '@tanstack/react-query';
import { onboardingService } from '../lib/services/onboardingService';

const queryKey = ['onboardingStatus'];

export const useOnboardingStatus = () => {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey,
    queryFn: onboardingService.getStatus,
    staleTime: Infinity,
  });

  const markCompleted = async () => {
    await onboardingService.complete();
    queryClient.setQueryData(queryKey, true);
  };

  const reset = async () => {
    await onboardingService.reset();
    queryClient.setQueryData(queryKey, false);
  };

  return { ...query, markCompleted, reset };
};

export const getOnboardingStatus = () => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('onboardingCompleted') === 'true';
};

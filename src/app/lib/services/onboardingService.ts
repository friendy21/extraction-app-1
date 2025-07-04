export const onboardingService = {
  async getStatus(): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('onboardingCompleted') === 'true';
  },
  async complete(): Promise<void> {
    if (typeof window !== 'undefined') localStorage.setItem('onboardingCompleted', 'true');
  },
  async reset(): Promise<void> {
    if (typeof window !== 'undefined') localStorage.removeItem('onboardingCompleted');
  },
};

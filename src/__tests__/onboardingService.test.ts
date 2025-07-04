import { onboardingService } from '../app/lib/services/onboardingService';

describe('onboardingService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns false when onboarding not completed', async () => {
    const status = await onboardingService.getStatus();
    expect(status).toBe(false);
  });

  it('marks onboarding as completed', async () => {
    await onboardingService.complete();
    const status = await onboardingService.getStatus();
    expect(status).toBe(true);
  });

  it('resets onboarding status', async () => {
    await onboardingService.complete();
    await onboardingService.reset();
    const status = await onboardingService.getStatus();
    expect(status).toBe(false);
  });
});

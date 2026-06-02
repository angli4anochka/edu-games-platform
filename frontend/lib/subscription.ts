// Subscription utility functions

const FREE_LIMIT = 5;
const STORAGE_KEY = 'activities_created_count';
const SUBSCRIPTION_KEY = 'user_subscription';

export type SubscriptionTier = 'free' | 'premium' | 'school';

export interface SubscriptionStatus {
  tier: SubscriptionTier;
  activitiesCreated: number;
  hasReachedLimit: boolean;
  remainingActivities: number;
}

// Get current count of created activities
export function getActivitiesCount(): number {
  if (typeof window === 'undefined') return 0;
  const count = localStorage.getItem(STORAGE_KEY);
  return count ? parseInt(count, 10) : 0;
}

// Increment activities count
export function incrementActivitiesCount(): number {
  const currentCount = getActivitiesCount();
  const newCount = currentCount + 1;
  localStorage.setItem(STORAGE_KEY, newCount.toString());
  return newCount;
}

// Get subscription tier
export function getSubscriptionTier(): SubscriptionTier {
  if (typeof window === 'undefined') return 'free';
  const tier = localStorage.getItem(SUBSCRIPTION_KEY);
  return (tier as SubscriptionTier) || 'free';
}

// Set subscription tier (for demo purposes)
export function setSubscriptionTier(tier: SubscriptionTier): void {
  localStorage.setItem(SUBSCRIPTION_KEY, tier);
}

// Check if user can create more activities
export function canCreateActivity(): boolean {
  const tier = getSubscriptionTier();

  // Premium and school tiers have unlimited activities
  if (tier === 'premium' || tier === 'school') {
    return true;
  }

  // Free tier is limited to FREE_LIMIT activities
  const count = getActivitiesCount();
  return count < FREE_LIMIT;
}

// Get full subscription status
export function getSubscriptionStatus(): SubscriptionStatus {
  const tier = getSubscriptionTier();
  const activitiesCreated = getActivitiesCount();

  let hasReachedLimit = false;
  let remainingActivities = Infinity;

  if (tier === 'free') {
    hasReachedLimit = activitiesCreated >= FREE_LIMIT;
    remainingActivities = Math.max(0, FREE_LIMIT - activitiesCreated);
  }

  return {
    tier,
    activitiesCreated,
    hasReachedLimit,
    remainingActivities,
  };
}

// Reset count (for testing)
export function resetActivitiesCount(): void {
  localStorage.removeItem(STORAGE_KEY);
}

import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';

export function useAnalytics() {
  const [location] = useLocation();

  useEffect(() => {
    const trackVisit = async () => {
      try {
        await apiRequest('POST', '/api/track-visit', {
          pagePath: location,
          referrer: document.referrer,
        });
      } catch (error) {
        // Silent error for analytics
        console.error('Failed to track visit:', error);
      }
    };

    trackVisit();
  }, [location]);
}

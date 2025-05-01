import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import trackingService, { TrackingEvent } from './trackingService';

// Define the context shape
interface TrackingContextType {
  trackEvent: (eventType: string, data?: Partial<TrackingEvent>) => TrackingEvent;
  events: TrackingEvent[];
  sessionId: string;
}

const TrackingContext = createContext<TrackingContextType | null>(null);

// Provider props interface
interface TrackingProviderProps {
  children: ReactNode;
}

// Provider component
export function TrackingProvider({ children }: TrackingProviderProps): JSX.Element {
  const [events, setEvents] = useState<TrackingEvent[]>([]);

  // Override the track method to update our local state
  useEffect(() => {
    const originalTrack = trackingService.track.bind(trackingService);
    trackingService.track = (eventType: string, data?: Partial<TrackingEvent>) => {
      // Call the original method
      const event = originalTrack(eventType, data);

      // Update our local state with latest events
      setEvents(prev => [event, ...prev].slice(0, 50));

      return event;
    };

    // Track initial page view
    if (typeof window !== 'undefined') {
      trackingService.track('pageview', {
        title: document.title,
        referrer: document.referrer
      });
    }

    // Clean up
    return () => {
      trackingService.track = originalTrack;
    };
  }, []);

  function debounce(func: Function, wait: number) {
    let timeout: ReturnType<typeof setTimeout>;
    return function(...args: any[]) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  const trackEvent = useCallback(
    debounce((eventType: string, data?: Partial<TrackingEvent>) => {
    return trackingService.track(eventType, data);
  }, 300), []);

  // Context value
  const value: TrackingContextType = {
    trackEvent: trackEvent, // trackingService.track.bind(trackingService),
    events,
    sessionId: trackingService.sessionId
  };

  return (
    <TrackingContext.Provider value={value}>
      {children}
    </TrackingContext.Provider>
  );
}

// Custom hook for using tracking context
export function useTracking(): TrackingContextType {
  const context = useContext(TrackingContext);

  if (!context) {
    throw new Error('useTracking must be used within a TrackingProvider');
  }

  return context;
}

// Track page views when route changes
export function usePageViewTracking(path?: string): void {
  const { trackEvent } = useTracking();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    trackEvent('pageview', {
      title: document.title,
      url: path || window.location.href,
      metadata: {
        path: window.location.pathname,
        search: window.location.search
      }
    });
  }, [path, trackEvent]);
}

// Track clicks on a specific element
export function useClickTracking(
  ref: React.RefObject<HTMLElement>,
  category?: string,
  label?: string
): void {
  const { trackEvent } = useTracking();

  useEffect(() => {
    if (!ref.current || typeof window === 'undefined') return;

    const element = ref.current;

    const handleClick = (e: MouseEvent) => {
      trackEvent('click', {
        target: {
          tagName: element.tagName.toLowerCase(),
          id: element.id || '',
          category,
          label
        },
        position: {
          x: e.clientX,
          y: e.clientY,
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight
        }
      });
    };

    element.addEventListener('click', handleClick);
    return () => element.removeEventListener('click', handleClick);
  }, [ref, category, label, trackEvent]);
}

// Track form submissions
export function useFormTracking(
  formRef: React.RefObject<HTMLFormElement>,
  formName: string
): void {
  const { trackEvent } = useTracking();

  useEffect(() => {
    if (!formRef.current || typeof window === 'undefined') return;

    const form = formRef.current;

    const handleSubmit = (e: Event) => {
      const fields = Array.from(form.elements)
        .filter((el): el is HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement => 
          'name' in el && el.name !== '')
        .map(el => ({
          name: el.name,
          type: 'type' in el ? el.type : 'unknown',
          hasValue: !!el.value
        }));

      trackEvent('form_submit', {
        target: {
          tagName: 'form',
          id: form.id || '',
          class: form.className || '',
          formId: form.id || '',
          formAction: form.action || '',
          formMethod: form.method || 'get'
        },
        metadata: {
          formName,
          fields
        }
      });
    };

    form.addEventListener('submit', handleSubmit);
    return () => form.removeEventListener('submit', handleSubmit);
  }, [formRef, formName, trackEvent]);
}

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode, useRef } from 'react';
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

  const originalTrack = useRef(trackingService.track.bind(trackingService));

  const trackEvent = useCallback((eventType: string, data?: Partial<TrackingEvent>) => {
    const event = originalTrack.current(eventType, data);
    setEvents(prev => [...prev, event]);
    return event;
  }, []);

  // Override the track method to update our local state
  useEffect(() => {
 
    // Track initial page view
    if (typeof window !== 'undefined') {
      trackEvent('pageview', {
        title: document.title,
        referrer: document.referrer
      });
    }

  }, [trackEvent]);

  // Context value
  const value: TrackingContextType = {
    trackEvent, 
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

// Enhanced hook to track clicks with more detailed position data
export function useEnhancedClickTracking(
  ref: React.RefObject<HTMLElement>,
  category?: string,
  label?: string,
  pageIdentifier?: string // Add page identifier for heat mapping
): void {
  const { trackEvent } = useTracking();

  useEffect(() => {
    if (!ref.current || typeof window === 'undefined') return;

    const element = ref.current;
    const handleClick = (e: MouseEvent) => {
      // Get element dimensions and position
      const rect = element.getBoundingClientRect();
      
      // Calculate relative position within the element (percentage)
      const relativeX = ((e.clientX - rect.left) / rect.width) * 100;
      const relativeY = ((e.clientY - rect.top) / rect.height) * 100;
      
      // Calculate position relative to the page
      const pageX = e.pageX;
      const pageY = e.pageY;
      
      // Calculate position relative to the viewport
      const viewportX = e.clientX;
      const viewportY = e.clientY;
      
      trackEvent('click', {
        target: {
          tagName: element.tagName.toLowerCase(),
          id: element.id || '',
          category,
          label,
          width: rect.width,
          height: rect.height,
          pageIdentifier: pageIdentifier || window.location.pathname
        },
        position: {
          x: e.clientX,
          y: e.clientY,
          pageX,
          pageY,
          viewportX,
          viewportY, 
          relativeX,
          relativeY,
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
          scrollX: window.scrollX,
          scrollY: window.scrollY
        }
      });
    };

    element.addEventListener('click', handleClick);
    return () => element.removeEventListener('click', handleClick);
  }, [ref, category, label, pageIdentifier, trackEvent]);
}

// global click tracking for heat maps
export function usePageHeatMapTracking(pageIdentifier?: string): void {
  const { trackEvent } = useTracking();
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleClick = (e: MouseEvent) => {
      // Only track clicks on the page body, not on interactive elements
      if (
        e.target instanceof HTMLButtonElement ||
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLAnchorElement ||
        e.target instanceof HTMLSelectElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return; // Skip interactive elements as they'll be tracked separately
      }
      
      const targetElement = e.target as HTMLElement;
      
      trackEvent('heatmap_click', {
        target: {
          tagName: targetElement?.tagName?.toLowerCase() || 'unknown',
          id: targetElement?.id || '',
          className: targetElement?.className || '',
          pageIdentifier: pageIdentifier || window.location.pathname
        },
        position: {
          x: e.clientX,
          y: e.clientY,
          pageX: e.pageX,
          pageY: e.pageY,
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
          scrollX: window.scrollX,
          scrollY: window.scrollY
        }
      });
    };

    document.body.addEventListener('click', handleClick);
    return () => document.body.removeEventListener('click', handleClick);
  }, [pageIdentifier, trackEvent]);
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

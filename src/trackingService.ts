export interface TrackingConfig {
  apiEndpoint: string;
  flushInterval: number;
  batchSize: number;
}

export interface PositionData {
  x: number;
  y: number;
  pageX?: number;           // page-relative coordinates
  pageY?: number;           // page-relative coordinates
  viewportX?: number;       // viewport-relative coordinates
  viewportY?: number;       // viewport-relative coordinates
  relativeX?: number;       // element-relative coordinates
  relativeY?: number;       // element-relative coordinates
  viewportWidth?: number;
  viewportHeight?: number;
  scrollX?: number;
  scrollY?: number;
}

export interface TargetData {
  tagName?: string;
  id?: string;
  class?: string;
  className?: string; //  DOM element compatibility
  // Form-specific properties
  formName?: string;
  formId?: string;
  formAction?: string;
  formMethod?: string;
  // Categorization properties
  category?: string;
  label?: string;
  value?: number;
  // Heat map specific properties
  pageIdentifier?: string; //  heat map tracking
  width?: number;          //  element dimensions
  height?: number;         //  element dimensions
  // Form fields
  fields?: Array<{name: string; type: string; hasValue: boolean}>;
  // Needed for nested targets
  target?: TrackingEvent;  // nested event references
}

export interface DeviceData {
  type: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
  osVersion?: string;
  screenSize: string;
}

export interface TrackingEvent {
  eventId: string;
  userId: string;
  sessionId: string;
  timestamp: number;
  eventType: string;
  url: string;
  referrer?: string;
  title?: string;
  target?: TargetData;
  position?: PositionData;
  device?: DeviceData;
  metadata?: Record<string, any>;
}

class TrackingClient {
  private config: TrackingConfig;
  private queue: TrackingEvent[];
  private isSending: boolean;
  private flushIntervalId: number | null;

  public readonly sessionId: string;
  public readonly userId: string;

  constructor(options: Partial<TrackingConfig> = {}) {
    this.config = {
      apiEndpoint: '/api/track',
      flushInterval: 5000,
      batchSize: 20,
      ...options
    };
    
    // Initialize event queue
    this.queue = [];

    // Create session and user IDs
    this.sessionId = this.generateId('session');
    this.userId = this.getUserId();

    this.isSending = false;
    this.flushIntervalId = null;
    
    // Only setup flush interval and event listeners in browser environment
    if (typeof window !== 'undefined') {
      this.flushIntervalId = window.setInterval(() => this.flush(), this.config.flushInterval);
      window.addEventListener('beforeunload', () => this.flush(true));
    }
  }

  private generateId(prefix: string): string {
    return `${prefix}_${Math.random().toString(36).substring(2,15)}`;
  }

  private getUserId(): string {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return this.generateId('user');
    }
    
    let userId = localStorage.getItem('tracking_user_id');
    if (!userId) {
      userId = this.generateId('user');
      try {
        localStorage.setItem('tracking_user_id', userId);
      } catch (e) {
        console.warn('Failed to store user ID in localStorage', e);
      }
    }

    return userId;
  }

  public getDeviceInfo(): DeviceData {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return {
        type: 'desktop',
        browser: 'unknown',
        os: 'unknown',
        screenSize: '0x0'
      };
    }
    
    const userAgent = navigator.userAgent;
    let deviceType: 'desktop' | 'mobile' | 'tablet' = 'desktop';

    if (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
      deviceType = 'mobile';
    } else if (/iPad|Tablet|PlayBook/i.test(userAgent)) {
      deviceType = 'tablet';
    }

    let browser = 'unknown';
    let os = 'unknown';

    if (userAgent.indexOf('Chrome') > -1) {
      browser = 'Chrome';
    } else if (userAgent.indexOf('Firefox') > -1) {
      browser = 'Firefox';
    } else if (userAgent.indexOf('Safari') > -1) {
      browser = 'Safari';
    } else if (userAgent.indexOf('MSIE') > -1 || userAgent.indexOf('Trident') > -1) {
      browser = 'Internet Explorer';
    } else if (userAgent.indexOf('Edge') > -1) {
      browser = 'Edge';
    }

    if (/Windows/i.test(userAgent)) os = 'Windows';
    if (/Macintosh|Mac OS X/i.test(userAgent)) os = 'MacOS';
    if (/Linux/i.test(userAgent)) os = 'Linux';
    if (/Android/i.test(userAgent)) os = 'Android';
    if (/iOS|iPhone|iPad|iPod/i.test(userAgent)) os = 'iOS';

    return {
      type: deviceType,
      browser,
      os,
      screenSize: (typeof window !== 'undefined') ?  `${window.screen.width}x${window.screen.height}` : '0x0'
    };
  }

  public track(eventType: string, data: Partial<TrackingEvent> = {}): TrackingEvent {
    const event: TrackingEvent = {
      eventId: this.generateId('evt'),
      userId: this.userId,
      sessionId: this.sessionId,
      timestamp: Date.now(),
      eventType,
      url: (typeof window !== 'undefined') ? window.location.href : '',
      referrer: (typeof document !== 'undefined') ? document.referrer : '',
      title: (typeof document !== 'undefined') ? document.title : '',
      device: this.getDeviceInfo(),
      ...data
    };

    this.queue.push(event);

    // If queue is large enough, send
    if (this.queue.length >= this.config.batchSize) {
      this.flush();
    }

    return event;
  }

  // Send events to server
  public async flush(immediate = false): Promise<void> {
    // Skip if queue is empty or already sending (unless immediate)
    if (this.queue.length === 0 || (this.isSending && !immediate)) {
      return;
    }

    this.isSending = true;

    const events = [...this.queue];
    this.queue = [];

    try {
      // Beacon API for beforeunload events
      if (immediate && typeof navigator !== 'undefined' && navigator.sendBeacon) {
        const blob = new Blob(
          [JSON.stringify(events)],
          { type: 'application/json' }
        );

        const success = navigator.sendBeacon(this.config.apiEndpoint, blob);

        if (!success) {
          throw new Error('Beacon API failed');
        }

        this.isSending = false;
        return;
      }

      // Regular fetch API
      if (typeof fetch !== 'undefined') {
        const response = await fetch(this.config.apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(events),
          keepalive: true
        });

        if (!response.ok) {
          this.queue = [...events, ...this.queue];
          console.error('Failed to send tracking events:', response.statusText);
        }
      }
    } catch (error) {
      // Put events back in queue
      this.queue = [...events, ...this.queue];
      console.error('Error sending tracking events:', error);
    } finally {
      this.isSending = false;
    }
  }

  public destroy(): void {
    if (this.flushIntervalId !== null && typeof window !== 'undefined') {
      window.clearInterval(this.flushIntervalId);
      window.removeEventListener('beforeunload', () => this.flush(true));
    }
    
    this.flush(true);
  }
}

// Create singleton instance
const trackingService = new TrackingClient({
  apiEndpoint: (typeof process !== 'undefined' && process.env.REACT_APP_TRACKING_API) || '/api/track'
});

export default trackingService;

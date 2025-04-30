// Export context provider and hooks
export { 
  TrackingProvider, 
  useTracking,
  usePageViewTracking,
  useClickTracking,
  useFormTracking
} from './TrackingContext';

// Export tracking toast component
export { default as TrackingToast } from './TrackingToast';

// Export tracking service and types
export { default as trackingService } from './trackingService';
export type { 
  TrackingEvent, 
  TrackingConfig,
  PositionData,
  TargetData,
  DeviceData
} from './trackingService';

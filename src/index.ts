// Export context provider and hooks
export { 
  TrackingProvider, 
  useTracking,
  usePageViewTracking,
  useClickTracking,
  useEnhancedClickTracking,
  usePageHeatMapTracking,
  useFormTracking
} from './TrackingContext';

// Export tracking toast component
export { default as TrackingSidebar } from './TrackingSidebar';

export { default as HeatMapVisualization } from './HeatMapVisualization';
export { default as HeatMapOverlay } from './HeatMapOverlay';

// Export tracking service and types
export { default as trackingService } from './trackingService';

export type { 
  TrackingEvent, 
  TrackingConfig,
  PositionData,
  TargetData,
  DeviceData
} from './trackingService';


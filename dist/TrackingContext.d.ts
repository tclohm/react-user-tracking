import React, { ReactNode } from 'react';
import { TrackingEvent } from './trackingService';
interface TrackingContextType {
    trackEvent: (eventType: string, data?: Partial<TrackingEvent>) => TrackingEvent;
    events: TrackingEvent[];
    sessionId: string;
}
interface TrackingProviderProps {
    children: ReactNode;
}
export declare function TrackingProvider({ children }: TrackingProviderProps): JSX.Element;
export declare function useTracking(): TrackingContextType;
export declare function usePageViewTracking(path?: string): void;
export declare function useClickTracking(ref: React.RefObject<HTMLElement>, category?: string, label?: string): void;
export declare function useFormTracking(formRef: React.RefObject<HTMLFormElement>, formName: string): void;
export {};

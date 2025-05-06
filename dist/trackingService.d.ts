export interface TrackingConfig {
    apiEndpoint: string;
    flushInterval: number;
    batchSize: number;
}
export interface PositionData {
    x: number;
    y: number;
    viewportWidth?: number;
    viewportHeight?: number;
    scrollX?: number;
    scrollY?: number;
}
export interface TargetData {
    tagName?: string;
    id?: string;
    class?: string;
    formName?: string;
    formId?: string;
    formAction?: string;
    formMethod?: string;
    category?: string;
    label?: string;
    value?: number;
    fields?: Array<{
        name: string;
        type: string;
        hasValue: boolean;
    }>;
    target?: TrackingEvent;
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
declare class TrackingClient {
    private config;
    private queue;
    private isSending;
    private flushIntervalId;
    readonly sessionId: string;
    readonly userId: string;
    constructor(options?: Partial<TrackingConfig>);
    private generateId;
    private getUserId;
    getDeviceInfo(): DeviceData;
    track(eventType: string, data?: Partial<TrackingEvent>): TrackingEvent;
    flush(immediate?: boolean): Promise<void>;
    destroy(): void;
}
declare const trackingService: TrackingClient;
export default trackingService;

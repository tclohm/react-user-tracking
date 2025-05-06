/// <reference types="react" />
interface HeatMapProps {
    pageIdentifier?: string;
    width?: number;
    height?: number;
    pointRadius?: number;
    maxOpacity?: number;
    colors?: {
        low: string;
        medium: string;
        high: string;
    };
    threshold?: number;
    showLabels?: boolean;
    filter?: {
        startTime?: number;
        endTime?: number;
        categories?: string[];
    };
}
export default function HeatMapVisualization({ pageIdentifier, width, height, pointRadius, maxOpacity, colors, threshold, showLabels, filter }: HeatMapProps): JSX.Element;
export {};

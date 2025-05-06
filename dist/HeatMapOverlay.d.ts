/// <reference types="react" />
interface HeatMapOverlayProps {
    pageIdentifier?: string;
    enabled?: boolean;
    controls?: boolean;
}
export default function HeatMapOverlay({ pageIdentifier, enabled, controls }: HeatMapOverlayProps): JSX.Element | null;
export {};

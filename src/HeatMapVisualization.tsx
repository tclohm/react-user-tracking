import React, { useState, useEffect, useRef } from 'react';
import { useTracking } from './TrackingContext';

interface HeatMapProps {
  pageIdentifier?: string; // Specific page to show heat map for
  width?: number; // Width of the heat map container
  height?: number; // Height of the heat map container
  pointRadius?: number; // Radius of heat points
  maxOpacity?: number; // Maximum opacity of heat points
  colors?: {
    low: string;
    medium: string;
    high: string;
  };
  threshold?: number; // Number of clicks to reach maximum intensity
  showLabels?: boolean; // Whether to show click count labels
  filter?: {
    startTime?: number;
    endTime?: number;
    categories?: string[];
  };
}

interface ClickPoint {
  x: number;
  y: number;
  count: number;
}

export default function HeatMapVisualization({
  pageIdentifier = window.location.pathname,
  width = window.innerWidth,
  height = window.innerHeight,
  pointRadius = 20,
  maxOpacity = 0.8,
  colors = {
    low: 'rgba(0, 0, 255, 0.6)', // Blue
    medium: 'rgba(255, 165, 0, 0.7)', // Orange
    high: 'rgba(255, 0, 0, 0.8)' // Red
  },
  threshold = 10,
  showLabels = false,
  filter
}: HeatMapProps): JSX.Element {
  const { events } = useTracking();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [clickPoints, setClickPoints] = useState<Map<string, ClickPoint>>(new Map());
  const [maxCount, setMaxCount] = useState(1);

  // Process events to extract click points
  useEffect(() => {
    const newClickPoints = new Map<string, ClickPoint>();
    let newMaxCount = 1;

    // Filter for click events related to this page
    const relevantEvents = events.filter(event => {
      // Only include click and heatmap_click events
      if (event.eventType !== 'click' && event.eventType !== 'heatmap_click') {
        return false;
      }

      // Filter by page identifier
      if (event.target?.pageIdentifier && 
          event.target.pageIdentifier !== pageIdentifier) {
        return false;
      }

      // Apply time range filter if provided
      if (filter?.startTime && event.timestamp < filter.startTime) {
        return false;
      }
      if (filter?.endTime && event.timestamp > filter.endTime) {
        return false;
      }

      // Apply category filter if provided
      if (filter?.categories && 
          filter.categories.length > 0 && 
          event.target?.category &&
          !filter.categories.includes(event.target.category)) {
        return false;
      }

      return true;
    });

    // Process clicks into points
    relevantEvents.forEach(event => {
      if (!event.position) return;
      
      // Get normalized coordinates (adjust for scroll position)
      const x = event.position.pageX || event.position.x;
      const y = event.position.pageY || event.position.y;
      
      if (typeof x !== 'number' || typeof y !== 'number') return;
      
      // Round coordinates to integers to group nearby clicks
      const roundedX = Math.round(x / 5) * 5;
      const roundedY = Math.round(y / 5) * 5;
      const key = `${roundedX},${roundedY}`;
      
      // Increment counter for this position
      if (newClickPoints.has(key)) {
        const point = newClickPoints.get(key)!;
        point.count += 1;
        if (point.count > newMaxCount) {
          newMaxCount = point.count;
        }
      } else {
        newClickPoints.set(key, { x: roundedX, y: roundedY, count: 1 });
      }
    });

    setClickPoints(newClickPoints);
    setMaxCount(Math.max(newMaxCount, threshold));
  }, [events, pageIdentifier, filter, threshold]);

  // Draw the heat map on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw heat points
    clickPoints.forEach((point) => {
      // Calculate intensity based on click count
      const intensity = Math.min(point.count / maxCount, 1);
      
      // Select color based on intensity
      let color;
      if (intensity < 0.33) {
        color = colors.low;
      } else if (intensity < 0.66) {
        color = colors.medium;
      } else {
        color = colors.high;
      }
      
      // Create radial gradient for point
      const gradient = ctx.createRadialGradient(
        point.x, point.y, 0,
        point.x, point.y, pointRadius
      );
      
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      // Draw point
      ctx.beginPath();
      ctx.fillStyle = gradient;
      ctx.globalAlpha = intensity * maxOpacity;
      ctx.arc(point.x, point.y, pointRadius, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw label if enabled
      if (showLabels) {
        ctx.font = '12px Arial';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.globalAlpha = 1;
        ctx.fillText(point.count.toString(), point.x, point.y);
      }
    });
  }, [clickPoints, width, height, pointRadius, maxOpacity, colors, maxCount, showLabels]);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1000
      }}
    >
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
      />
    </div>
  );
}

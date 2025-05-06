import React, { useState, useEffect } from 'react';
import HeatMapVisualization from './HeatMapVisualization';
import { usePageHeatMapTracking } from './TrackingContext';

interface HeatMapOverlayProps {
  pageIdentifier?: string;
  enabled?: boolean;
  controls?: boolean;
}

export default function HeatMapOverlay({
  pageIdentifier = window.location.pathname,
  enabled = false,
  controls = true
}: HeatMapOverlayProps): JSX.Element | null {
  const [isVisible, setIsVisible] = useState(enabled);
  const [settings, setSettings] = useState({
    pointRadius: 20,
    maxOpacity: 0.8,
    threshold: 10,
    showLabels: false,
    timeRange: 'all', // 'all', 'today', 'week', 'month'
    colorScheme: 'default' // 'default', 'plasma', 'viridis', 'grayscale'
  });
  
  // Start tracking clicks for heat map
  usePageHeatMapTracking(pageIdentifier);
  
  // Handle keyboard shortcut to toggle heat map
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle heat map with Alt+H
      if (e.altKey && e.key === 'h') {
        setIsVisible(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // Get color scheme based on setting
  const getColorScheme = () => {
    switch (settings.colorScheme) {
      case 'plasma':
        return {
          low: 'rgba(13, 8, 135, 0.6)',
          medium: 'rgba(156, 24, 109, 0.7)',
          high: 'rgba(249, 168, 37, 0.8)'
        };
      case 'viridis':
        return {
          low: 'rgba(68, 1, 84, 0.6)',
          medium: 'rgba(33, 145, 140, 0.7)',
          high: 'rgba(253, 231, 37, 0.8)'
        };
      case 'grayscale':
        return {
          low: 'rgba(50, 50, 50, 0.6)',
          medium: 'rgba(120, 120, 120, 0.7)',
          high: 'rgba(200, 200, 200, 0.8)'
        };
      default:
        return {
          low: 'rgba(0, 0, 255, 0.6)', // Blue
          medium: 'rgba(255, 165, 0, 0.7)', // Orange
          high: 'rgba(255, 0, 0, 0.8)' // Red
        };
    }
  };
  
  // Get time range filter based on setting
  const getTimeFilter = () => {
    const now = Date.now();
    
    switch (settings.timeRange) {
      case 'today':
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return { startTime: today.getTime() };
      
      case 'week':
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return { startTime: weekAgo.getTime() };
      
      case 'month':
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return { startTime: monthAgo.getTime() };
      
      default:
        return undefined;
    }
  };
  
  if (!isVisible) {
    // Only render toggle button if controls are enabled
    return controls ? (
      <div 
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          zIndex: 1001,
          padding: '8px',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          borderRadius: '4px',
          fontSize: '12px',
          cursor: 'pointer'
        }}
        onClick={() => setIsVisible(true)}
      >
        Show Heat Map (Alt+H)
      </div>
    ) : null;
  }
  
  return (
    <>
      {/* Heat Map Visualization */}
      <HeatMapVisualization 
        pageIdentifier={pageIdentifier}
        pointRadius={settings.pointRadius}
        maxOpacity={settings.maxOpacity}
        colors={getColorScheme()}
        threshold={settings.threshold}
        showLabels={settings.showLabels}
        filter={getTimeFilter()}
      />
      
      {/* Controls Panel */}
      {controls && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 1002,
            padding: '15px',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            borderRadius: '8px',
            width: '250px',
            fontFamily: 'Arial, sans-serif',
            fontSize: '14px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <h3 style={{ margin: 0 }}>Heat Map Controls</h3>
            <button 
              onClick={() => setIsVisible(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              ×
            </button>
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              Point Size:
            </label>
            <input 
              type="range" 
              min="5" 
              max="50" 
              value={settings.pointRadius} 
              onChange={e => setSettings({...settings, pointRadius: parseInt(e.target.value)})}
              style={{ width: '100%' }}
            />
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              Opacity:
            </label>
            <input 
              type="range" 
              min="0.1" 
              max="1" 
              step="0.1"
              value={settings.maxOpacity} 
              onChange={e => setSettings({...settings, maxOpacity: parseFloat(e.target.value)})}
              style={{ width: '100%' }}
            />
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              Color Scheme:
            </label>
            <select
              value={settings.colorScheme}
              onChange={e => setSettings({...settings, colorScheme: e.target.value})}
              style={{ width: '100%', padding: '5px' }}
            >
              <option value="default">Classic (Blue-Red)</option>
              <option value="plasma">Plasma</option>
              <option value="viridis">Viridis</option>
              <option value="grayscale">Grayscale</option>
            </select>
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              Time Range:
            </label>
            <select
              value={settings.timeRange}
              onChange={e => setSettings({...settings, timeRange: e.target.value})}
              style={{ width: '100%', padding: '5px' }}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Past Week</option>
              <option value="month">Past Month</option>
            </select>
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'flex', alignItems: 'center' }}>
              <input 
                type="checkbox" 
                checked={settings.showLabels}
                onChange={e => setSettings({...settings, showLabels: e.target.checked})}
                style={{ marginRight: '8px' }}
              />
              Show Click Counts
            </label>
          </div>
          
          <div style={{ fontSize: '12px', opacity: '0.7', marginTop: '10px' }}>
            Press Alt+H to toggle heat map
          </div>
        </div>
      )}
    </>
  );
}

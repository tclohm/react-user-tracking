import React, { useState, useEffect, useRef } from 'react';
import { useTracking } from './TrackingContext';

// Simple SVG icons
const EyeIcon = (): JSX.Element => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const ClockIcon = (): JSX.Element => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const ClickIcon = (): JSX.Element => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M2 12h2M7 12h2M12 12h2M17 12h2M22 12h2M12 2v2M12 7v2M12 17v2M12 22v2"></path>
  </svg>
);

const DeviceIcon = (): JSX.Element => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="6" width="20" height="12" rx="2"></rect>
    <path d="M12 16a2 2 0 0 0 0-4 2 2 0 0 0 0 4z"></path>
  </svg>
);

// Main component props
interface TrackingToastProps {
  privacyUrl?: string;
}

export default function TrackingToast({ privacyUrl = '/privacy' }: TrackingToastProps): JSX.Element | null {
  const { events, sessionId } = useTracking();
  const [visible, setVisible] = useState<boolean>(true);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [timeSpent, setTimeSpent] = useState<number>(0);

  // Time counter for "time on page"
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const timer = window.setInterval(() => {
      setTimeSpent(prev => prev + 1)
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' + mins : mins}:${secs < 10 ? '0' + secs : secs}`;
  };

  if (!visible) return null;

  // Count clicks
  const clickCount = events.filter(e => e.eventType === 'click').length;
  
  // Get device type
  const deviceType = events[0]?.device?.type || 'desktop';

  // Base styles
  const styles = {
    container: {
      position: 'fixed' as const,
      bottom: '20px',
      right: '20px',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '12px',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
      zIndex: 9999,
      maxWidth: '300px',
      fontSize: '14px'
    },
    header: {
      display: 'flex' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
      marginBottom: '8px'
    },
    title: {
      display: 'flex' as const,
      alignItems: 'center' as const,
      fontWeight: 'bold'
    },
    icon: {
      marginRight: '8px',
      color: '#ff6b6b'
    },
    button: {
      background: 'none',
      border: 'none',
      color: '#aaa',
      cursor: 'pointer',
      padding: '0'
    },
    timeInfo: {
      fontSize: '12px',
      color: '#ddd',
      display: 'flex' as const,
      alignItems: 'center' as const,
      gap: '6px',
      marginBottom: '6px'
    },
    section: {
      marginTop: '8px',
      marginBottom: '8px',
      backgroundColor: 'rgba(50, 50, 50, 0.5)',
      padding: '8px',
      borderRadius: '4px',
      fontSize: '12px'
    },
    actionList: {
      display: 'flex' as const,
      flexDirection: 'column' as const,
      gap: '4px'
    },
    actionItem: {
      display: 'flex' as const,
      borderBottom: '1px solid #444',
      paddingBottom: '4px'
    },
    stats: {
      marginTop: '12px',
      paddingTop: '8px',
      borderTop: '1px solid #444',
      display: 'grid' as const,
      gridTemplateColumns: '1fr 1fr',
      gap: '8px',
      fontSize: '12px'
    },
    footer: {
      gridColumn: '1 / span 2',
      marginTop: '6px',
      fontSize: '11px',
      color: '#888'
    }
  };

  return (
    <div className="tracking-toast-container" style={styles.container}>
      <div style={styles.header}>
        <div style={styles.title}>
          <span style={styles.icon}>
            <EyeIcon />
          </span>
          We are tracking you
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => setExpanded(!expanded)}
            style={styles.button}
          >
            {expanded ? 'Less' : 'More'}
          </button>
          
          <button 
            onClick={() => setVisible(false)}
            style={{...styles.button, fontSize: '18px'}}
          >
            &times;
          </button>
        </div>
      </div>
      
      {/* Time on page */}
      <div style={styles.timeInfo}>
        <ClockIcon />
        <span>Time on page: {formatTime(timeSpent)}</span>
      </div>
      
      {/* Action stream */}
      {expanded && (
        <div style={styles.section}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '4px', 
            marginBottom: '6px',
            color: '#aaa'
          }}>
            <span>Recent Activity</span>
          </div>
          
          {events.length === 0 ? (
            <div style={{ fontStyle: 'italic', color: '#777' }}>
              No actions recorded yet
            </div>
          ) : (
            <div style={styles.actionList}>
              {events.slice(0, 5).map((event, index) => (
                <div key={event.eventId || index} style={styles.actionItem}>
                  <span style={{ 
                    minWidth: '60px',
                    color: event.eventType === 'click' ? '#4dabf7' : '#12b886'
                  }}>
                    {event.eventType}:
                  </span>
                  <span style={{ flex: 1, color: '#ddd' }}>
                    {event.target?.tagName || ''}
                    {event.target?.id ? `#${event.target.id}` : ''}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Stats */}
      {expanded && (
        <div style={styles.stats}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ClickIcon />
            <span>Clicks: {clickCount}</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <DeviceIcon />
            <span>Device: {deviceType}</span>
          </div>
          
          <div style={styles.footer}>
            Data collected to improve your experience.
            <a href={privacyUrl} style={{ color: '#4dabf7', marginLeft: '4px' }}>
              Privacy Policy
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

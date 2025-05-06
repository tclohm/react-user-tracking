import React, { useState, useEffect } from 'react';
import { useTracking } from './TrackingContext';
import './TrackingToast.css';


interface TrackingToastProps {
  privacyUrl?: string;
}

export default function TrackingToast({ privacyUrl = '/privacy' }: TrackingToastProps): JSX.Element | null {
  const { events, sessionId } = useTracking();
  const [visible, setVisible] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Update current time for relative timestamps
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 10000); // Update every 10 seconds
    return () => clearInterval(timer);
  }, []);

  // Time counter for "time on page"
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' + mins : mins}:${secs < 10 ? '0' + secs : secs}`;
  };
  
  // Format absolute timestamp
  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };
  
  // Format relative timestamp
  const getRelativeTime = (timestamp: number): string => {
    const seconds = Math.floor((currentTime - timestamp) / 1000);
    
    if (seconds < 5) return 'just now';
    if (seconds < 60) return `${seconds} seconds ago`;
    
    const minutes = Math.floor(seconds / 60);
    if (minutes === 1) return '1 minute ago';
    if (minutes < 60) return `${minutes} minutes ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours === 1) return '1 hour ago';
    if (hours < 24) return `${hours} hours ago`;
    
    return formatTimestamp(timestamp);
  };
  
  // Get event icon based on type
  const getEventIcon = (eventType: string): string => {
    switch (eventType) {
      case 'pageview': return '🔍';
      case 'click': return '👆';
      case 'form_submit': return '📝';
      default: return '🔔';
    }
  };
  
  // Get event type class
  const getEventTypeClass = (eventType: string): string => {
    switch (eventType) {
      case 'pageview': return 'tracking-toast-event-pageview';
      case 'click': return 'tracking-toast-event-click';
      case 'form_submit': return 'tracking-toast-event-form_submit';
      default: return 'tracking-toast-event-custom';
    }
  };

  if (!visible) return null;

  // Count events
  const clickCount = events.filter(e => e.eventType === 'click').length;
  const pageViewCount = events.filter(e => e.eventType === 'pageview').length;
  
  // Get most recent events first (reversed)
  const recentEvents = [...events].reverse();
  
  return (
    <div className="tracking-toast-container">
      <div className="tracking-toast-header">
        <div className="tracking-toast-title">
          <span className="tracking-toast-title-icon">👁️</span>
          We are tracking you
        </div>
        <div>
          <button 
            onClick={() => setExpanded(!expanded)}
            className="tracking-toast-button"
          >
            {expanded ? 'Less' : 'More'}
          </button>
          <button 
            onClick={() => setVisible(false)}
            className="tracking-toast-button tracking-toast-close-button"
          >
            ×
          </button>
        </div>
      </div>
      
      <div className="tracking-toast-time">
        <div className="tracking-toast-time-container">
          <span className="tracking-toast-time-icon">⏱️</span>
          <span>Time on page: {formatTime(timeSpent)}</span>
        </div>
      </div>
      
      {expanded && (
        <>
          <div className="tracking-toast-section">
            <div className="tracking-toast-section-header">
              <span>ACTIVITY LOG</span>
              <span className="tracking-toast-event-count">
                {events.length} events
              </span>
            </div>
            
            <div className="tracking-toast-scroll-container">
              {recentEvents.length === 0 ? (
                <div className="tracking-toast-no-events">
                  NO EVENTS RECORDED
                </div>
              ) : (
                <>
                  {recentEvents.map((event, index) => (
                    <div 
                      key={event.eventId || index} 
                      className={`tracking-toast-event ${getEventTypeClass(event.eventType)}`}
                    >
                      <div className="tracking-toast-event-header">
                        <span className="tracking-toast-event-type">
                          <span>{getEventIcon(event.eventType)}</span>
                          {event.eventType}
                        </span>
                        <span className="tracking-toast-event-time">
                          {getRelativeTime(event.timestamp)}
                        </span>
                      </div>
                      
                      <div className="tracking-toast-event-details">
                        {event.eventType === 'pageview' ? (
                          <div>
                            <div className="tracking-toast-event-property">
                              <span className="tracking-toast-event-label">path: </span>
                              <span className="tracking-toast-event-value">{event.metadata?.path || event.url || '/'}</span>
                            </div>
                            {event.title && (
                              <div className="tracking-toast-event-property">
                                <span className="tracking-toast-event-label">title: </span>
                                <span className="tracking-toast-event-value">{event.title}</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div>
                            <div className="tracking-toast-event-property">
                              <span className="tracking-toast-event-label">element: </span>
                              <span className="tracking-toast-event-value">
                                {event.target?.tagName || 'element'}
                                {event.target?.category ? ` [${event.target.category}]` : ''}
                              </span>
                            </div>
                            {event.target?.label && (
                              <div className="tracking-toast-event-property">
                                <span className="tracking-toast-event-label">label: </span>
                                <span className="tracking-toast-event-value">{event.target.label}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
          
          <div className="tracking-toast-stats">
            <div className="tracking-toast-stat">
              <span className="tracking-toast-stat-icon" style={{ color: '#4dabf7' }}>👆</span>
              Clicks: {clickCount}
            </div>
            <div className="tracking-toast-stat">
              <span className="tracking-toast-stat-icon" style={{ color: '#12b886' }}>🔍</span>
              Pages: {pageViewCount}
            </div>
            <div className="tracking-toast-stat">
              <span className="tracking-toast-stat-icon" style={{ color: '#aaa' }}>💻</span>
              Device: desktop
            </div>
            <div className="tracking-toast-stat">
              <span className="tracking-toast-stat-icon" style={{ color: '#aaa' }}>🆔</span>
              Session: {sessionId.substring(0, 8)}
            </div>
            <div className="tracking-toast-privacy-link">
              <a href={privacyUrl}>
                PRIVACY POLICY
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

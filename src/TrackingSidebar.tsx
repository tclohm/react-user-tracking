import React, { useState, useEffect } from 'react';
import { useTracking } from './TrackingContext';

interface TrackingSidebarProps {
  privacyUrl?: string;
  initiallyExpanded?: boolean;
}

export default function TrackingSidebar({ 
  privacyUrl = '/privacy',
  initiallyExpanded = false
}: TrackingSidebarProps): JSX.Element {
  const { events, sessionId } = useTracking();
  const [expanded, setExpanded] = useState(initiallyExpanded);
  const [timeSpent, setTimeSpent] = useState(0);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [activeTab, setActiveTab] = useState('activity'); // 'activity' or 'stats'

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
    
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Get event icon based on type
  const getEventIcon = (eventType: string): string => {
    switch (eventType) {
      case 'pageview': return '🔍';
      case 'click': return '👆';
      case 'form_submit': return '📝';
      case 'heatmap_click': return '🔥';
      default: return '🔔';
    }
  };
  
  // Get event color based on type
  const getEventColor = (eventType: string): string => {
    switch (eventType) {
      case 'pageview': return '#12b886';
      case 'click': return '#4dabf7';
      case 'form_submit': return '#845ef7';
      case 'heatmap_click': return '#ff922b';
      default: return '#aaa';
    }
  };

  // Count different event types
  const clickCount = events.filter(e => e.eventType === 'click').length;
  const pageViewCount = events.filter(e => e.eventType === 'pageview').length;
  const formSubmitCount = events.filter(e => e.eventType === 'form_submit').length;
  const heatmapClickCount = events.filter(e => e.eventType === 'heatmap_click').length;
  
  // Get most recent events first (reversed)
  const recentEvents = [...events].reverse();
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: expanded ? 0 : '-340px',
      height: '100vh',
      width: '340px',
      backgroundColor: '#1a1a1a',
      color: 'white',
      transition: 'right 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 9999,
      boxShadow: expanded ? '-4px 0 10px rgba(0, 0, 0, 0.2)' : 'none',
      fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    }}>
      {/* Toggle Button */}
      <div style={{
        position: 'absolute',
        left: '-40px',
        top: '50%',
        transform: 'translateY(-50%)',
        backgroundColor: '#1a1a1a',
        borderRadius: '4px 0 0 4px',
        padding: '10px 8px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '-2px 0 5px rgba(0, 0, 0, 0.2)',
      }} onClick={() => setExpanded(!expanded)}>
        <span style={{ 
          transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s ease',
          fontSize: '20px'
        }}>
          {expanded ? '❯' : '❮'}
        </span>
      </div>
      
      {/* Header */}
      <div style={{
        padding: '15px 20px',
        borderBottom: '1px solid #333',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#111',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          fontWeight: 'bold',
          fontSize: '16px',
        }}>
          <span style={{ marginRight: '8px', color: '#ff6b6b' }}>👁️</span>
          User Tracking
        </div>
        <div style={{
          padding: '4px 8px',
          backgroundColor: '#222',
          borderRadius: '4px',
          fontSize: '12px',
        }}>
          <span style={{ marginRight: '4px' }}>⏱️</span>
          {formatTime(timeSpent)}
        </div>
      </div>
      
      {/* Tabs */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid #333',
      }}>
        <div 
          style={{
            flex: 1,
            padding: '10px',
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: activeTab === 'activity' ? '#222' : 'transparent',
            borderBottom: activeTab === 'activity' ? '2px solid #4dabf7' : 'none',
          }}
          onClick={() => setActiveTab('activity')}
        >
          Activity
        </div>
        <div 
          style={{
            flex: 1,
            padding: '10px',
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: activeTab === 'stats' ? '#222' : 'transparent',
            borderBottom: activeTab === 'stats' ? '2px solid #4dabf7' : 'none',
          }}
          onClick={() => setActiveTab('stats')}
        >
          Stats
        </div>
      </div>
      
      {/* Activity Feed */}
      {activeTab === 'activity' && (
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '10px',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
            padding: '5px 10px',
          }}>
            <span style={{ fontWeight: 'bold', fontSize: '14px' }}>Recent Events</span>
            <span style={{ 
              backgroundColor: '#333', 
              color: '#aaa', 
              padding: '2px 6px', 
              borderRadius: '10px',
              fontSize: '12px' 
            }}>
              {events.length}
            </span>
          </div>
          
          {recentEvents.length === 0 ? (
            <div style={{
              padding: '20px',
              textAlign: 'center',
              color: '#666',
            }}>
              No events recorded yet
            </div>
          ) : (
            <div>
              {recentEvents.map((event, index) => (
                <div key={event.eventId || index} style={{
                  backgroundColor: '#222',
                  borderRadius: '6px',
                  marginBottom: '8px',
                  overflow: 'hidden',
                  border: '1px solid #333',
                }}>
                  <div style={{
                    padding: '10px 12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid #333',
                    backgroundColor: '#282828',
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                    }}>
                      <span style={{ 
                        marginRight: '8px',
                        color: getEventColor(event.eventType),
                        fontSize: '16px',
                      }}>
                        {getEventIcon(event.eventType)}
                      </span>
                      <span style={{ 
                        color: getEventColor(event.eventType),
                        fontWeight: 'bold',
                      }}>
                        {event.eventType}
                      </span>
                    </div>
                    <div style={{
                      fontSize: '11px',
                      color: '#aaa',
                      backgroundColor: 'rgba(0, 0, 0, 0.2)',
                      padding: '3px 6px',
                      borderRadius: '3px',
                    }}>
                      {getRelativeTime(event.timestamp)}
                    </div>
                  </div>
                  
                  <div style={{ padding: '8px 12px' }}>
                    {event.eventType === 'pageview' ? (
                      <div>
                        <div style={{ marginBottom: '4px', fontSize: '13px' }}>
                          <span style={{ color: '#777' }}>path: </span>
                          <span>{event.metadata?.path || event.url || '/'}</span>
                        </div>
                        {event.title && (
                          <div style={{ fontSize: '13px' }}>
                            <span style={{ color: '#777' }}>title: </span>
                            <span>{event.title}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        <div style={{ marginBottom: '4px', fontSize: '13px' }}>
                          <span style={{ color: '#777' }}>element: </span>
                          <span>
                            {event.target?.tagName || 'element'}
                            {event.target?.category ? ` [${event.target.category}]` : ''}
                          </span>
                        </div>
                        {event.target?.label && (
                          <div style={{ fontSize: '13px' }}>
                            <span style={{ color: '#777' }}>label: </span>
                            <span>{event.target.label}</span>
                          </div>
                        )}
                        {event.position && (
                          <div style={{ 
                            fontSize: '12px', 
                            color: '#666', 
                            marginTop: '4px',
                            display: 'flex',
                            gap: '10px'
                          }}>
                            <span>x: {Math.round(event.position.x)}</span>
                            <span>y: {Math.round(event.position.y)}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Stats View */}
      {activeTab === 'stats' && (
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '15px',
        }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', margin: '0 0 15px 0' }}>Event Summary</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
            }}>
              <div style={{
                backgroundColor: '#222',
                padding: '12px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
              }}>
                <span style={{ 
                  fontSize: '22px', 
                  marginRight: '10px',
                  color: '#4dabf7',
                }}>👆</span>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{clickCount}</div>
                  <div style={{ fontSize: '12px', color: '#aaa' }}>Clicks</div>
                </div>
              </div>
              
              <div style={{
                backgroundColor: '#222',
                padding: '12px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
              }}>
                <span style={{ 
                  fontSize: '22px', 
                  marginRight: '10px',
                  color: '#12b886',
                }}>🔍</span>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{pageViewCount}</div>
                  <div style={{ fontSize: '12px', color: '#aaa' }}>Page Views</div>
                </div>
              </div>
              
              <div style={{
                backgroundColor: '#222',
                padding: '12px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
              }}>
                <span style={{ 
                  fontSize: '22px', 
                  marginRight: '10px',
                  color: '#845ef7',
                }}>📝</span>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{formSubmitCount}</div>
                  <div style={{ fontSize: '12px', color: '#aaa' }}>Form Submits</div>
                </div>
              </div>
              
              <div style={{
                backgroundColor: '#222',
                padding: '12px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
              }}>
                <span style={{ 
                  fontSize: '22px', 
                  marginRight: '10px',
                  color: '#ff922b',
                }}>🔥</span>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{heatmapClickCount}</div>
                  <div style={{ fontSize: '12px', color: '#aaa' }}>Heat Map Clicks</div>
                </div>
              </div>
            </div>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', margin: '0 0 15px 0' }}>Session Info</h3>
            <div style={{
              backgroundColor: '#222',
              padding: '15px',
              borderRadius: '6px',
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '10px',
                fontSize: '14px',
              }}>
                <span style={{ color: '#aaa' }}>Session ID:</span>
                <span style={{ fontFamily: 'monospace' }}>{sessionId.substring(0, 12)}...</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '10px',
                fontSize: '14px',
              }}>
                <span style={{ color: '#aaa' }}>Device:</span>
                <span>Desktop</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                fontSize: '14px',
              }}>
                <span style={{ color: '#aaa' }}>Duration:</span>
                <span>{formatTime(timeSpent)}</span>
              </div>
            </div>
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <a 
              href={privacyUrl}
              style={{
                display: 'inline-block',
                color: '#4dabf7',
                textDecoration: 'none',
                padding: '8px 12px',
                borderRadius: '4px',
                backgroundColor: 'rgba(77, 171, 247, 0.1)',
                fontSize: '13px',
              }}
            >
              Privacy Policy
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

# React User Tracking

A lightweight, flexible tracking library for React applications with heat map visualization.

![npm](https://img.shields.io/npm/v/react-user-tracking)
![Bundle Size](https://img.shields.io/bundlephobia/minzip/react-user-tracking)
![MIT License](https://img.shields.io/npm/l/react-user-tracking)

## Features

- 📊 Automatic page view tracking
- 🖱️ Element click tracking
- 📝 Form submission tracking
- 🗺️ Click heat maps with customizable visualization
- 📱 Device and browser detection
- 🔄 Batched event sending
- 🚪 Handles page unload events
- 📋 Debug toast component

## Installation

```bash
npm install react-user-tracking
# or
yarn add react-user-tracking
```

## Quick Start

Wrap your application with the `TrackingProvider`:

```jsx
import { TrackingProvider, TrackingToast } from 'react-user-tracking';

function App() {
  return (
    <TrackingProvider>
      <YourApp />
      <TrackingToast /> {/* Optional debug component */}
    </TrackingProvider>
  );
}
```

## Basic Usage

### Track Page Views

Automatically track when a component mounts, useful for SPA navigation:

```jsx
import { usePageViewTracking } from 'react-user-tracking';

function HomePage() {
  // Automatically tracks when this component mounts
  usePageViewTracking();
  
  return <div>Home Page Content</div>;
}
```

You can also specify a custom path:

```jsx
// For custom path tracking
usePageViewTracking('/custom-path-name');
```

### Track Element Clicks

Track clicks on specific elements:

```jsx
import { useRef } from 'react';
import { useClickTracking } from 'react-user-tracking';

function SignupButton() {
  const buttonRef = useRef(null);
  
  // Track clicks on this button with category and label
  useClickTracking(buttonRef, 'cta', 'signup');
  
  return (
    <button ref={buttonRef}>
      Sign Up
    </button>
  );
}
```

### Enhanced Click Tracking

For more detailed position data and improved heat map tracking:

```jsx
import { useRef } from 'react';
import { useEnhancedClickTracking } from 'react-user-tracking';

function ProductCard({ product, pageIdentifier }) {
  const cardRef = useRef(null);
  
  // Enhanced tracking with category, label, and page identifier
  useEnhancedClickTracking(
    cardRef, 
    'product', 
    `view-${product.id}`,
    pageIdentifier
  );
  
  return (
    <div ref={cardRef} className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>${product.price}</p>
    </div>
  );
}
```

### Track Form Submissions

Track form submissions with field metadata:

```jsx
import { useRef } from 'react';
import { useFormTracking } from 'react-user-tracking';

function ContactForm() {
  const formRef = useRef(null);
  
  // Track form submissions
  useFormTracking(formRef, 'contact');
  
  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <input name="email" type="email" placeholder="Your email" required />
      <textarea name="message" placeholder="Your message" required />
      <button type="submit">Send</button>
    </form>
  );
}
```

### Manual Event Tracking

Track custom events programmatically:

```jsx
import { useTracking } from 'react-user-tracking';

function FeatureComponent() {
  const { trackEvent } = useTracking();
  
  const handleFeatureUse = (feature, action) => {
    // Track a custom event
    trackEvent('feature_used', {
      metadata: {
        featureId: feature,
        action: action
      }
    });
    
    // Feature logic...
  };
  
  return (
    <div>
      <button onClick={() => handleFeatureUse('image-editor', 'crop')}>
        Crop Image
      </button>
      <button onClick={() => handleFeatureUse('image-editor', 'rotate')}>
        Rotate Image
      </button>
    </div>
  );
}
```

## Heat Map Visualization

### Basic Heat Map

The simplest way to add a heat map to your app:

```jsx
import { HeatMapOverlay } from 'react-user-tracking';

function App() {
  return (
    <div>
      <YourAppContent />
      <HeatMapOverlay enabled={false} /> {/* Hidden by default, toggle with Alt+H */}
    </div>
  );
}
```

### Custom Heat Map Configuration

For more control over your heat map visualization:

```jsx
import { HeatMapOverlay } from 'react-user-tracking';

function AnalyticsPage() {
  return (
    <div>
      <h1>User Interaction Analytics</h1>
      
      <HeatMapOverlay 
        enabled={true} // Start visible
        pageIdentifier="/product-page" // Show data for specific page 
        controls={true} // Show the control panel
      />
    </div>
  );
}
```

### Advanced Heat Map Customization

For complete control, use the underlying visualization component:

```jsx
import { useState } from 'react';
import { HeatMapVisualization, usePageHeatMapTracking } from 'react-user-tracking';

function CustomHeatMap() {
  // Start tracking clicks on this page
  usePageHeatMapTracking();
  
  // Custom colors
  const customColors = {
    low: 'rgba(0, 128, 255, 0.6)', // Blue
    medium: 'rgba(255, 100, 0, 0.7)', // Orange
    high: 'rgba(200, 0, 0, 0.8)', // Red
  };
  
  // Time filter (show only last 24 hours)
  const dayAgo = new Date();
  dayAgo.setDate(dayAgo.getDate() - 1);
  
  const timeFilter = {
    startTime: dayAgo.getTime(),
    // Optional: categories: ['button', 'link'] - filter by event categories
  };
  
  return (
    <div style={{ position: 'relative', width: '100%', height: '800px' }}>
      <HeatMapVisualization 
        pointRadius={25}
        maxOpacity={0.7}
        colors={customColors}
        threshold={15} // Clicks needed for maximum intensity
        showLabels={true} // Show click counts
        filter={timeFilter}
      />
    </div>
  );
}
```

## Debug Toast Component

Add the debug toast to see events in real-time:

```jsx
import { TrackingToast } from 'react-user-tracking';

function App() {
  return (
    <div>
      <YourApp />
      <TrackingToast privacyUrl="/your-privacy-page" />
    </div>
  );
}
```

## Advanced Configuration

### Configure the Tracking Service

Customize the tracking endpoint and behavior:

```jsx
import { trackingService } from 'react-user-tracking';

// Configure before initializing your app
trackingService.configure({
  apiEndpoint: 'https://analytics.yoursite.com/track',
  flushInterval: 10000, // 10 seconds
  batchSize: 30 // Send every 30 events
});
```

### Tracking Context Integration

Access all tracking functionality through the context:

```jsx
import { useTracking } from 'react-user-tracking';

function AnalyticsComponent() {
  const { trackEvent, events, sessionId } = useTracking();
  
  return (
    <div>
      <h2>Session Analytics</h2>
      <p>Session ID: {sessionId}</p>
      <p>Total Events: {events.length}</p>
      <p>Page Views: {events.filter(e => e.eventType === 'pageview').length}</p>
      <p>Clicks: {events.filter(e => e.eventType === 'click').length}</p>
      
      <button onClick={() => trackEvent('custom_event', { 
        metadata: { triggered: 'manually' } 
      })}>
        Track Custom Event
      </button>
    </div>
  );
}
```

## Server-Side Integration

Send events to your own analytics backend:

```javascript
// Server endpoint (Express example)
app.post('/api/track', (req, res) => {
  const events = req.body;
  
  // Process events
  events.forEach(event => {
    // Store in database
    db.collection('events').insertOne(event);
    
    // Forward to external analytics service if needed
    // externalAnalytics.send(event);
  });
  
  res.status(200).send({ status: 'success' });
});
```

## Use with Popular React Frameworks

### Next.js

```jsx
// pages/_app.js
import { TrackingProvider, TrackingToast } from 'react-user-tracking';

function MyApp({ Component, pageProps }) {
  return (
    <TrackingProvider>
      <Component {...pageProps} />
      <TrackingToast />
    </TrackingProvider>
  );
}

export default MyApp;
```

### React Router

```jsx
// In your route components
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { usePageViewTracking } from 'react-user-tracking';

function RouteTracker() {
  const location = useLocation();
  
  // Track page views on route changes
  usePageViewTracking(location.pathname);
  
  return null;
}

// Add to your app
function App() {
  return (
    <Router>
      <TrackingProvider>
        <RouteTracker />
        <Routes>
          {/* Your routes */}
        </Routes>
        <TrackingToast />
      </TrackingProvider>
    </Router>
  );
}
```

## Complete API Reference

### TrackingProvider

Provides tracking context to all child components.

**Props:**
- `children` - React nodes to be wrapped by the provider

### useTracking

Access the tracking context and its functionality.

**Returns:**
- `trackEvent(eventType, data?)` - Track a custom event
- `events` - Array of all tracked events
- `sessionId` - Current tracking session ID

### usePageViewTracking

Track page views when a component mounts.

**Parameters:**
- `path?` - Optional custom path to track instead of current URL

### useClickTracking

Track clicks on a specific element.

**Parameters:**
- `ref` - React ref to the element to track
- `category?` - Optional category for the click event
- `label?` - Optional label for the click event

### useEnhancedClickTracking

Track clicks with detailed position data for heat maps.

**Parameters:**
- `ref` - React ref to the element to track
- `category?` - Optional category for the click event
- `label?` - Optional label for the click event
- `pageIdentifier?` - Optional page identifier for heat mapping

### usePageHeatMapTracking

Track all page clicks for heat map visualization.

**Parameters:**
- `pageIdentifier?` - Optional page identifier for heat mapping

### useFormTracking

Track form submissions.

**Parameters:**
- `formRef` - React ref to the form element
- `formName` - Name identifier for the form

### TrackingToast

Debug component showing tracking activity.

**Props:**
- `privacyUrl?` - URL to your privacy policy page (default: '/privacy')

### HeatMapOverlay

Heat map visualization with controls.

**Props:**
- `pageIdentifier?` - Page identifier to show data for (default: current path)
- `enabled?` - Whether to show the heat map initially (default: false)
- `controls?` - Whether to show the control panel (default: true)

### HeatMapVisualization

Low-level heat map visualization component.

**Props:**
- `pageIdentifier?` - Page identifier to show data for
- `width?` - Width of the heat map canvas
- `height?` - Height of the heat map canvas
- `pointRadius?` - Radius of heat points
- `maxOpacity?` - Maximum opacity of heat points
- `colors?` - Color scheme for heat points
- `threshold?` - Number of clicks to reach maximum intensity
- `showLabels?` - Whether to show click count labels
- `filter?` - Filter by time range and categories

### trackingService

Direct API for tracking and configuration.

**Methods:**
- `track(eventType, data?)` - Track a custom event
- `flush(immediate?)` - Manually send queued events
- `configure(options)` - Configure the tracking service

## Event Types

The library uses the following standard event types:

- `pageview` - Page view events
- `click` - Element click events
- `heatmap_click` - Background clicks for heat maps
- `form_submit` - Form submission events

You can define your own custom event types for your app's specific needs.

## License

MIT

# React User Tracking

A simple, lightweight tracking library for React applications.

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

## Features

- 📊 Automatic page view tracking
- 🖱️ Element click tracking
- 📝 Form submission tracking
- 📱 Device and browser detection
- 🔄 Batched event sending
- 🚪 Handles page unload events
- 📋 Debug toast component

## Usage

### Track Page Views

```jsx
import { usePageViewTracking } from 'react-user-tracking';

function HomePage() {
  // Automatically tracks when this component mounts
  usePageViewTracking();
  
  return <div>Home Page Content</div>;
}
```

### Track Element Clicks

```jsx
import { useRef } from 'react';
import { useClickTracking } from 'react-user-tracking';

function Button() {
  const buttonRef = useRef(null);
  
  // Track clicks on this button
  useClickTracking(buttonRef, 'cta', 'signup');
  
  return (
    <button ref={buttonRef}>
      Sign Up
    </button>
  );
}
```

### Track Form Submissions

```jsx
import { useRef } from 'react';
import { useFormTracking } from 'react-user-tracking';

function ContactForm() {
  const formRef = useRef(null);
  
  // Track form submissions
  useFormTracking(formRef, 'contact');
  
  return (
    <form ref={formRef}>
      <input name="email" type="email" />
      <input name="message" type="text" />
      <button type="submit">Send</button>
    </form>
  );
}
```

### Manual Event Tracking

```jsx
import { useTracking } from 'react-user-tracking';

function App() {
  const { trackEvent } = useTracking();
  
  const handleFeatureUse = () => {
    // Track a custom event
    trackEvent('feature_used', {
      metadata: {
        featureId: 'image-editor',
        action: 'crop'
      }
    });
    
    // Feature logic...
  };
  
  return (
    <button onClick={handleFeatureUse}>
      Use Feature
    </button>
  );
}
```

## API Reference

### TrackingProvider

Provides tracking context to all child components.

### Hooks

- `useTracking()`: Access the tracking context
- `usePageViewTracking(path?)`: Track page views
- `useClickTracking(ref, category?, label?)`: Track element clicks
- `useFormTracking(formRef, formName)`: Track form submissions

### Components

- `TrackingToast`: Debug component showing tracking activity

### Direct API

- `trackingService.track(eventType, data?)`: Track a custom event
- `trackingService.flush(immediate?)`: Manually send queued events

## License

MIT

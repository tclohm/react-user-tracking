import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import trackingService from './trackingService';
var TrackingContext = createContext(null);
// Provider component
export function TrackingProvider(_a) {
    var children = _a.children;
    var _b = useState([]), events = _b[0], setEvents = _b[1];
    function throttle(func, limit) {
        var inThrottle;
        var lastResult;
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var context = this;
            if (!inThrottle) {
                inThrottle = true;
                lastResult = func.apply(context, args);
                setTimeout(function () { return (inThrottle = false); }, limit);
            }
            return lastResult;
        };
    }
    var throttledTrackEvent = useCallback(throttle(function (eventType, data) {
        return trackingService.track(eventType, data);
    }, 300), []);
    // Override the track method to update our local state
    useEffect(function () {
        var originalTrack = trackingService.track.bind(trackingService);
        trackingService.track = function (eventType, data) {
            return throttledTrackEvent(eventType, data);
        };
        // Track initial page view
        if (typeof window !== 'undefined') {
            trackingService.track('pageview', {
                title: document.title,
                referrer: document.referrer
            });
        }
        // Clean up
        return function () {
            trackingService.track = originalTrack;
        };
    }, [throttledTrackEvent]);
    // Context value
    var value = {
        trackEvent: throttledTrackEvent,
        events: events,
        sessionId: trackingService.sessionId
    };
    return (React.createElement(TrackingContext.Provider, { value: value }, children));
}
// Custom hook for using tracking context
export function useTracking() {
    var context = useContext(TrackingContext);
    if (!context) {
        throw new Error('useTracking must be used within a TrackingProvider');
    }
    return context;
}
// Track page views when route changes
export function usePageViewTracking(path) {
    var trackEvent = useTracking().trackEvent;
    useEffect(function () {
        if (typeof window === 'undefined')
            return;
        trackEvent('pageview', {
            title: document.title,
            url: path || window.location.href,
            metadata: {
                path: window.location.pathname,
                search: window.location.search
            }
        });
    }, [path, trackEvent]);
}
// Track clicks on a specific element
export function useClickTracking(ref, category, label) {
    var trackEvent = useTracking().trackEvent;
    useEffect(function () {
        if (!ref.current || typeof window === 'undefined')
            return;
        var element = ref.current;
        var handleClick = function (e) {
            trackEvent('click', {
                target: {
                    tagName: element.tagName.toLowerCase(),
                    id: element.id || '',
                    category: category,
                    label: label
                },
                position: {
                    x: e.clientX,
                    y: e.clientY,
                    viewportWidth: window.innerWidth,
                    viewportHeight: window.innerHeight
                }
            });
        };
        element.addEventListener('click', handleClick);
        return function () { return element.removeEventListener('click', handleClick); };
    }, [ref, category, label, trackEvent]);
}
// Track form submissions
export function useFormTracking(formRef, formName) {
    var trackEvent = useTracking().trackEvent;
    useEffect(function () {
        if (!formRef.current || typeof window === 'undefined')
            return;
        var form = formRef.current;
        var handleSubmit = function (e) {
            var fields = Array.from(form.elements)
                .filter(function (el) {
                return 'name' in el && el.name !== '';
            })
                .map(function (el) { return ({
                name: el.name,
                type: 'type' in el ? el.type : 'unknown',
                hasValue: !!el.value
            }); });
            trackEvent('form_submit', {
                target: {
                    tagName: 'form',
                    id: form.id || '',
                    class: form.className || '',
                    formId: form.id || '',
                    formAction: form.action || '',
                    formMethod: form.method || 'get'
                },
                metadata: {
                    formName: formName,
                    fields: fields
                }
            });
        };
        form.addEventListener('submit', handleSubmit);
        return function () { return form.removeEventListener('submit', handleSubmit); };
    }, [formRef, formName, trackEvent]);
}

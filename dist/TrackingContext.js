var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import trackingService from './trackingService';
var TrackingContext = createContext(null);
// Provider component
export function TrackingProvider(_a) {
    var children = _a.children;
    var _b = useState([]), events = _b[0], setEvents = _b[1];
    //function throttle<T extends (...args: any[]) => any>(
    //  func: T,
    //  limit: number
    //): (...args: Parameters<T>) => ReturnType<T> {
    //  let inThrottle: boolean;
    //  let lastResult: ReturnType<T>;
    //
    //  return function(this: any, ...args: Parameters<T>): ReturnType<T> {
    //    const context = this;
    //    if (!inThrottle) {
    //      inThrottle = true;
    //      lastResult = func.apply(context, args);
    //      setTimeout(() => (inThrottle = false), limit);
    //    }
    //    return lastResult;
    //  };
    //}
    // avoid recursion
    var originalTrack = useRef(trackingService.track.bind(trackingService));
    var trackEvent = useCallback(function (eventType, data) {
        var event = originalTrack.current(eventType, data);
        setEvents(function (prev) {
            console.log("Adding event to state", event);
            return __spreadArray(__spreadArray([], prev, true), [event], false);
        });
        return event;
    }, []);
    // const throttledTrackEvent = trackEventWithState;
    // Override the track method to update our local state
    useEffect(function () {
        //const originalTrack = trackingService.track.bind(trackingService);
        //trackingService.track = (eventType: string, data?: Partial<TrackingEvent>) => {
        //  return throttledTrackEvent(eventType, data);
        //};
        // Track initial page view
        if (typeof window !== 'undefined') {
            trackEvent('pageview', {
                title: document.title,
                referrer: document.referrer
            });
        }
        // Clean up
        //return () => {
        //  trackingService.track = originalTrack;
        //};
    }, [trackEvent]);
    // Context value
    var value = {
        trackEvent: trackEvent,
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

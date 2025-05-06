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
    var originalTrack = useRef(trackingService.track.bind(trackingService));
    var trackEvent = useCallback(function (eventType, data) {
        var event = originalTrack.current(eventType, data);
        setEvents(function (prev) { return __spreadArray(__spreadArray([], prev, true), [event], false); });
        return event;
    }, []);
    // Override the track method to update our local state
    useEffect(function () {
        // Track initial page view
        if (typeof window !== 'undefined') {
            trackEvent('pageview', {
                title: document.title,
                referrer: document.referrer
            });
        }
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
// Enhanced hook to track clicks with more detailed position data
export function useEnhancedClickTracking(ref, category, label, pageIdentifier // Add page identifier for heat mapping
) {
    var trackEvent = useTracking().trackEvent;
    useEffect(function () {
        if (!ref.current || typeof window === 'undefined')
            return;
        var element = ref.current;
        var handleClick = function (e) {
            // Get element dimensions and position
            var rect = element.getBoundingClientRect();
            // Calculate relative position within the element (percentage)
            var relativeX = ((e.clientX - rect.left) / rect.width) * 100;
            var relativeY = ((e.clientY - rect.top) / rect.height) * 100;
            // Calculate position relative to the page
            var pageX = e.pageX;
            var pageY = e.pageY;
            // Calculate position relative to the viewport
            var viewportX = e.clientX;
            var viewportY = e.clientY;
            trackEvent('click', {
                target: {
                    tagName: element.tagName.toLowerCase(),
                    id: element.id || '',
                    category: category,
                    label: label,
                    width: rect.width,
                    height: rect.height,
                    pageIdentifier: pageIdentifier || window.location.pathname
                },
                position: {
                    x: e.clientX,
                    y: e.clientY,
                    pageX: pageX,
                    pageY: pageY,
                    viewportX: viewportX,
                    viewportY: viewportY,
                    relativeX: relativeX,
                    relativeY: relativeY,
                    viewportWidth: window.innerWidth,
                    viewportHeight: window.innerHeight,
                    scrollX: window.scrollX,
                    scrollY: window.scrollY
                }
            });
        };
        element.addEventListener('click', handleClick);
        return function () { return element.removeEventListener('click', handleClick); };
    }, [ref, category, label, pageIdentifier, trackEvent]);
}
// global click tracking for heat maps
export function usePageHeatMapTracking(pageIdentifier) {
    var trackEvent = useTracking().trackEvent;
    useEffect(function () {
        if (typeof window === 'undefined')
            return;
        var handleClick = function (e) {
            var _a;
            // Only track clicks on the page body, not on interactive elements
            if (e.target instanceof HTMLButtonElement ||
                e.target instanceof HTMLInputElement ||
                e.target instanceof HTMLAnchorElement ||
                e.target instanceof HTMLSelectElement ||
                e.target instanceof HTMLTextAreaElement) {
                return; // Skip interactive elements as they'll be tracked separately
            }
            var targetElement = e.target;
            trackEvent('heatmap_click', {
                target: {
                    tagName: ((_a = targetElement === null || targetElement === void 0 ? void 0 : targetElement.tagName) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || 'unknown',
                    id: (targetElement === null || targetElement === void 0 ? void 0 : targetElement.id) || '',
                    className: (targetElement === null || targetElement === void 0 ? void 0 : targetElement.className) || '',
                    pageIdentifier: pageIdentifier || window.location.pathname
                },
                position: {
                    x: e.clientX,
                    y: e.clientY,
                    pageX: e.pageX,
                    pageY: e.pageY,
                    viewportWidth: window.innerWidth,
                    viewportHeight: window.innerHeight,
                    scrollX: window.scrollX,
                    scrollY: window.scrollY
                }
            });
        };
        document.body.addEventListener('click', handleClick);
        return function () { return document.body.removeEventListener('click', handleClick); };
    }, [pageIdentifier, trackEvent]);
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

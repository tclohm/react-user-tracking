var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import React, { useState, useEffect } from 'react';
import { useTracking } from './TrackingContext.ts';
import '../styles/TrackingToast.css';
export default function TrackingToast(_a) {
    var _b = _a.privacyUrl, privacyUrl = _b === void 0 ? '/privacy' : _b;
    var _c = useTracking(), events = _c.events, sessionId = _c.sessionId;
    var _d = useState(true), visible = _d[0], setVisible = _d[1];
    var _e = useState(false), expanded = _e[0], setExpanded = _e[1];
    var _f = useState(0), timeSpent = _f[0], setTimeSpent = _f[1];
    var _g = useState(Date.now()), currentTime = _g[0], setCurrentTime = _g[1];
    // Update current time for relative timestamps
    useEffect(function () {
        var timer = setInterval(function () {
            setCurrentTime(Date.now());
        }, 10000); // Update every 10 seconds
        return function () { return clearInterval(timer); };
    }, []);
    // Time counter for "time on page"
    useEffect(function () {
        var timer = setInterval(function () {
            setTimeSpent(function (prev) { return prev + 1; });
        }, 1000);
        return function () { return clearInterval(timer); };
    }, []);
    var formatTime = function (seconds) {
        var mins = Math.floor(seconds / 60);
        var secs = seconds % 60;
        return "".concat(mins < 10 ? '0' + mins : mins, ":").concat(secs < 10 ? '0' + secs : secs);
    };
    // Format absolute timestamp
    var formatTimestamp = function (timestamp) {
        var date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };
    // Format relative timestamp
    var getRelativeTime = function (timestamp) {
        var seconds = Math.floor((currentTime - timestamp) / 1000);
        if (seconds < 5)
            return 'just now';
        if (seconds < 60)
            return "".concat(seconds, " seconds ago");
        var minutes = Math.floor(seconds / 60);
        if (minutes === 1)
            return '1 minute ago';
        if (minutes < 60)
            return "".concat(minutes, " minutes ago");
        var hours = Math.floor(minutes / 60);
        if (hours === 1)
            return '1 hour ago';
        if (hours < 24)
            return "".concat(hours, " hours ago");
        return formatTimestamp(timestamp);
    };
    // Get event icon based on type
    var getEventIcon = function (eventType) {
        switch (eventType) {
            case 'pageview': return '🔍';
            case 'click': return '👆';
            case 'form_submit': return '📝';
            default: return '🔔';
        }
    };
    // Get event type class
    var getEventTypeClass = function (eventType) {
        switch (eventType) {
            case 'pageview': return 'tracking-toast-event-pageview';
            case 'click': return 'tracking-toast-event-click';
            case 'form_submit': return 'tracking-toast-event-form_submit';
            default: return 'tracking-toast-event-custom';
        }
    };
    if (!visible)
        return null;
    // Count events
    var clickCount = events.filter(function (e) { return e.eventType === 'click'; }).length;
    var pageViewCount = events.filter(function (e) { return e.eventType === 'pageview'; }).length;
    // Get most recent events first (reversed)
    var recentEvents = __spreadArray([], events, true).reverse();
    return (React.createElement("div", { className: "tracking-toast-container" },
        React.createElement("div", { className: "tracking-toast-header" },
            React.createElement("div", { className: "tracking-toast-title" },
                React.createElement("span", { className: "tracking-toast-title-icon" }, "\uD83D\uDC41\uFE0F"),
                "We are tracking you"),
            React.createElement("div", null,
                React.createElement("button", { onClick: function () { return setExpanded(!expanded); }, className: "tracking-toast-button" }, expanded ? 'Less' : 'More'),
                React.createElement("button", { onClick: function () { return setVisible(false); }, className: "tracking-toast-button tracking-toast-close-button" }, "\u00D7"))),
        React.createElement("div", { className: "tracking-toast-time" },
            React.createElement("div", { className: "tracking-toast-time-container" },
                React.createElement("span", { className: "tracking-toast-time-icon" }, "\u23F1\uFE0F"),
                React.createElement("span", null,
                    "Time on page: ",
                    formatTime(timeSpent)))),
        expanded && (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "tracking-toast-section" },
                React.createElement("div", { className: "tracking-toast-section-header" },
                    React.createElement("span", null, "ACTIVITY LOG"),
                    React.createElement("span", { className: "tracking-toast-event-count" },
                        events.length,
                        " events")),
                React.createElement("div", { className: "tracking-toast-scroll-container" }, recentEvents.length === 0 ? (React.createElement("div", { className: "tracking-toast-no-events" }, "NO EVENTS RECORDED")) : (React.createElement(React.Fragment, null, recentEvents.map(function (event, index) {
                    var _a, _b, _c, _d;
                    return (React.createElement("div", { key: event.eventId || index, className: "tracking-toast-event ".concat(getEventTypeClass(event.eventType)) },
                        React.createElement("div", { className: "tracking-toast-event-header" },
                            React.createElement("span", { className: "tracking-toast-event-type" },
                                React.createElement("span", null, getEventIcon(event.eventType)),
                                event.eventType),
                            React.createElement("span", { className: "tracking-toast-event-time" }, getRelativeTime(event.timestamp))),
                        React.createElement("div", { className: "tracking-toast-event-details" }, event.eventType === 'pageview' ? (React.createElement("div", null,
                            React.createElement("div", { className: "tracking-toast-event-property" },
                                React.createElement("span", { className: "tracking-toast-event-label" }, "path: "),
                                React.createElement("span", { className: "tracking-toast-event-value" }, ((_a = event.metadata) === null || _a === void 0 ? void 0 : _a.path) || event.url || '/')),
                            event.title && (React.createElement("div", { className: "tracking-toast-event-property" },
                                React.createElement("span", { className: "tracking-toast-event-label" }, "title: "),
                                React.createElement("span", { className: "tracking-toast-event-value" }, event.title))))) : (React.createElement("div", null,
                            React.createElement("div", { className: "tracking-toast-event-property" },
                                React.createElement("span", { className: "tracking-toast-event-label" }, "element: "),
                                React.createElement("span", { className: "tracking-toast-event-value" },
                                    ((_b = event.target) === null || _b === void 0 ? void 0 : _b.tagName) || 'element',
                                    ((_c = event.target) === null || _c === void 0 ? void 0 : _c.category) ? " [".concat(event.target.category, "]") : '')),
                            ((_d = event.target) === null || _d === void 0 ? void 0 : _d.label) && (React.createElement("div", { className: "tracking-toast-event-property" },
                                React.createElement("span", { className: "tracking-toast-event-label" }, "label: "),
                                React.createElement("span", { className: "tracking-toast-event-value" }, event.target.label))))))));
                }))))),
            React.createElement("div", { className: "tracking-toast-stats" },
                React.createElement("div", { className: "tracking-toast-stat" },
                    React.createElement("span", { className: "tracking-toast-stat-icon", style: { color: '#4dabf7' } }, "\uD83D\uDC46"),
                    "Clicks: ",
                    clickCount),
                React.createElement("div", { className: "tracking-toast-stat" },
                    React.createElement("span", { className: "tracking-toast-stat-icon", style: { color: '#12b886' } }, "\uD83D\uDD0D"),
                    "Pages: ",
                    pageViewCount),
                React.createElement("div", { className: "tracking-toast-stat" },
                    React.createElement("span", { className: "tracking-toast-stat-icon", style: { color: '#aaa' } }, "\uD83D\uDCBB"),
                    "Device: desktop"),
                React.createElement("div", { className: "tracking-toast-stat" },
                    React.createElement("span", { className: "tracking-toast-stat-icon", style: { color: '#aaa' } }, "\uD83C\uDD94"),
                    "Session: ",
                    sessionId.substring(0, 8)),
                React.createElement("div", { className: "tracking-toast-privacy-link" },
                    React.createElement("a", { href: privacyUrl }, "PRIVACY POLICY")))))));
}

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import React, { useState, useEffect } from 'react';
import { useTracking } from './TrackingContext';
// Simple SVG icons
var EyeIcon = function () { return (React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" },
    React.createElement("path", { d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" }),
    React.createElement("circle", { cx: "12", cy: "12", r: "3" }))); };
var ClockIcon = function () { return (React.createElement("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" },
    React.createElement("circle", { cx: "12", cy: "12", r: "10" }),
    React.createElement("polyline", { points: "12 6 12 12 16 14" }))); };
var ClickIcon = function () { return (React.createElement("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" },
    React.createElement("path", { d: "M2 12h2M7 12h2M12 12h2M17 12h2M22 12h2M12 2v2M12 7v2M12 17v2M12 22v2" }))); };
var DeviceIcon = function () { return (React.createElement("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" },
    React.createElement("rect", { x: "2", y: "6", width: "20", height: "12", rx: "2" }),
    React.createElement("path", { d: "M12 16a2 2 0 0 0 0-4 2 2 0 0 0 0 4z" }))); };
export default function TrackingToast(_a) {
    var _b, _c;
    var _d = _a.privacyUrl, privacyUrl = _d === void 0 ? '/privacy' : _d;
    var _e = useTracking(), events = _e.events, sessionId = _e.sessionId;
    var _f = useState(true), visible = _f[0], setVisible = _f[1];
    var _g = useState(false), expanded = _g[0], setExpanded = _g[1];
    var _h = useState(0), timeSpent = _h[0], setTimeSpent = _h[1];
    // Time counter for "time on page"
    useEffect(function () {
        if (typeof window === 'undefined')
            return;
        var timer = window.setInterval(function () {
            setTimeSpent(function (prev) { return prev + 1; });
        }, 1000);
        return function () { return window.clearInterval(timer); };
    }, []);
    var formatTime = function (seconds) {
        var mins = Math.floor(seconds / 60);
        var secs = seconds % 60;
        return "".concat(mins < 10 ? '0' + mins : mins, ":").concat(secs < 10 ? '0' + secs : secs);
    };
    if (!visible)
        return null;
    // Count clicks
    var clickCount = events.filter(function (e) { return e.eventType === 'click'; }).length;
    // Get device type
    var deviceType = ((_c = (_b = events[0]) === null || _b === void 0 ? void 0 : _b.device) === null || _c === void 0 ? void 0 : _c.type) || 'desktop';
    // Base styles
    var styles = {
        container: {
            position: 'fixed',
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
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px'
        },
        title: {
            display: 'flex',
            alignItems: 'center',
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
            display: 'flex',
            alignItems: 'center',
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
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
        },
        actionItem: {
            display: 'flex',
            borderBottom: '1px solid #444',
            paddingBottom: '4px'
        },
        stats: {
            marginTop: '12px',
            paddingTop: '8px',
            borderTop: '1px solid #444',
            display: 'grid',
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
    return (React.createElement("div", { className: "tracking-toast-container", style: styles.container },
        React.createElement("div", { style: styles.header },
            React.createElement("div", { style: styles.title },
                React.createElement("span", { style: styles.icon },
                    React.createElement(EyeIcon, null)),
                "We are tracking you"),
            React.createElement("div", { style: { display: 'flex', gap: '8px' } },
                React.createElement("button", { onClick: function () { return setExpanded(!expanded); }, style: styles.button }, expanded ? 'Less' : 'More'),
                React.createElement("button", { onClick: function () { return setVisible(false); }, style: __assign(__assign({}, styles.button), { fontSize: '18px' }) }, "\u00D7"))),
        React.createElement("div", { style: styles.timeInfo },
            React.createElement(ClockIcon, null),
            React.createElement("span", null,
                "Time on page: ",
                formatTime(timeSpent))),
        expanded && (React.createElement("div", { style: styles.section },
            React.createElement("div", { style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    marginBottom: '6px',
                    color: '#aaa'
                } },
                React.createElement("span", null, "Recent Activity")),
            events.length === 0 ? (React.createElement("div", { style: { fontStyle: 'italic', color: '#777' } }, "No actions recorded yet")) : (React.createElement("div", { style: styles.actionList }, events.slice(0, 5).map(function (event, index) {
                var _a, _b;
                return (React.createElement("div", { key: event.eventId || index, style: styles.actionItem },
                    React.createElement("span", { style: {
                            minWidth: '60px',
                            color: event.eventType === 'click' ? '#4dabf7' : '#12b886'
                        } },
                        event.eventType,
                        ":"),
                    React.createElement("span", { style: { flex: 1, color: '#ddd' } },
                        ((_a = event.target) === null || _a === void 0 ? void 0 : _a.tagName) || '',
                        ((_b = event.target) === null || _b === void 0 ? void 0 : _b.id) ? "#".concat(event.target.id) : '')));
            }))))),
        expanded && (React.createElement("div", { style: styles.stats },
            React.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: '6px' } },
                React.createElement(ClickIcon, null),
                React.createElement("span", null,
                    "Clicks: ",
                    clickCount)),
            React.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: '6px' } },
                React.createElement(DeviceIcon, null),
                React.createElement("span", null,
                    "Device: ",
                    deviceType)),
            React.createElement("div", { style: styles.footer },
                "Data collected to improve your experience.",
                React.createElement("a", { href: privacyUrl, style: { color: '#4dabf7', marginLeft: '4px' } }, "Privacy Policy"))))));
}

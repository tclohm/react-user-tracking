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
import { useTracking } from './TrackingContext';
export default function TrackingSidebar(_a) {
    var _b = _a.privacyUrl, privacyUrl = _b === void 0 ? '/privacy' : _b, _c = _a.initiallyExpanded, initiallyExpanded = _c === void 0 ? false : _c;
    var _d = useTracking(), events = _d.events, sessionId = _d.sessionId;
    var _e = useState(initiallyExpanded), expanded = _e[0], setExpanded = _e[1];
    var _f = useState(0), timeSpent = _f[0], setTimeSpent = _f[1];
    var _g = useState(Date.now()), currentTime = _g[0], setCurrentTime = _g[1];
    var _h = useState('activity'), activeTab = _h[0], setActiveTab = _h[1]; // 'activity' or 'stats'
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
        var date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    // Get event icon based on type
    var getEventIcon = function (eventType) {
        switch (eventType) {
            case 'pageview': return '🔍';
            case 'click': return '👆';
            case 'form_submit': return '📝';
            case 'heatmap_click': return '🔥';
            default: return '🔔';
        }
    };
    // Get event color based on type
    var getEventColor = function (eventType) {
        switch (eventType) {
            case 'pageview': return '#12b886';
            case 'click': return '#4dabf7';
            case 'form_submit': return '#845ef7';
            case 'heatmap_click': return '#ff922b';
            default: return '#aaa';
        }
    };
    // Count different event types
    var clickCount = events.filter(function (e) { return e.eventType === 'click'; }).length;
    var pageViewCount = events.filter(function (e) { return e.eventType === 'pageview'; }).length;
    var formSubmitCount = events.filter(function (e) { return e.eventType === 'form_submit'; }).length;
    var heatmapClickCount = events.filter(function (e) { return e.eventType === 'heatmap_click'; }).length;
    // Get most recent events first (reversed)
    var recentEvents = __spreadArray([], events, true).reverse();
    return (React.createElement("div", { style: {
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
        } },
        React.createElement("div", { style: {
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
            }, onClick: function () { return setExpanded(!expanded); } },
            React.createElement("span", { style: {
                    transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease',
                    fontSize: '20px'
                } }, expanded ? '❯' : '❮')),
        React.createElement("div", { style: {
                padding: '15px 20px',
                borderBottom: '1px solid #333',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#111',
            } },
            React.createElement("div", { style: {
                    display: 'flex',
                    alignItems: 'center',
                    fontWeight: 'bold',
                    fontSize: '16px',
                } },
                React.createElement("span", { style: { marginRight: '8px', color: '#ff6b6b' } }, "\uD83D\uDC41\uFE0F"),
                "User Tracking"),
            React.createElement("div", { style: {
                    padding: '4px 8px',
                    backgroundColor: '#222',
                    borderRadius: '4px',
                    fontSize: '12px',
                } },
                React.createElement("span", { style: { marginRight: '4px' } }, "\u23F1\uFE0F"),
                formatTime(timeSpent))),
        React.createElement("div", { style: {
                display: 'flex',
                borderBottom: '1px solid #333',
            } },
            React.createElement("div", { style: {
                    flex: 1,
                    padding: '10px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: activeTab === 'activity' ? '#222' : 'transparent',
                    borderBottom: activeTab === 'activity' ? '2px solid #4dabf7' : 'none',
                }, onClick: function () { return setActiveTab('activity'); } }, "Activity"),
            React.createElement("div", { style: {
                    flex: 1,
                    padding: '10px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: activeTab === 'stats' ? '#222' : 'transparent',
                    borderBottom: activeTab === 'stats' ? '2px solid #4dabf7' : 'none',
                }, onClick: function () { return setActiveTab('stats'); } }, "Stats")),
        activeTab === 'activity' && (React.createElement("div", { style: {
                flex: 1,
                overflow: 'auto',
                padding: '10px',
            } },
            React.createElement("div", { style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '10px',
                    padding: '5px 10px',
                } },
                React.createElement("span", { style: { fontWeight: 'bold', fontSize: '14px' } }, "Recent Events"),
                React.createElement("span", { style: {
                        backgroundColor: '#333',
                        color: '#aaa',
                        padding: '2px 6px',
                        borderRadius: '10px',
                        fontSize: '12px'
                    } }, events.length)),
            recentEvents.length === 0 ? (React.createElement("div", { style: {
                    padding: '20px',
                    textAlign: 'center',
                    color: '#666',
                } }, "No events recorded yet")) : (React.createElement("div", null, recentEvents.map(function (event, index) {
                var _a, _b, _c, _d;
                return (React.createElement("div", { key: event.eventId || index, style: {
                        backgroundColor: '#222',
                        borderRadius: '6px',
                        marginBottom: '8px',
                        overflow: 'hidden',
                        border: '1px solid #333',
                    } },
                    React.createElement("div", { style: {
                            padding: '10px 12px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderBottom: '1px solid #333',
                            backgroundColor: '#282828',
                        } },
                        React.createElement("div", { style: {
                                display: 'flex',
                                alignItems: 'center',
                            } },
                            React.createElement("span", { style: {
                                    marginRight: '8px',
                                    color: getEventColor(event.eventType),
                                    fontSize: '16px',
                                } }, getEventIcon(event.eventType)),
                            React.createElement("span", { style: {
                                    color: getEventColor(event.eventType),
                                    fontWeight: 'bold',
                                } }, event.eventType)),
                        React.createElement("div", { style: {
                                fontSize: '11px',
                                color: '#aaa',
                                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                padding: '3px 6px',
                                borderRadius: '3px',
                            } }, getRelativeTime(event.timestamp))),
                    React.createElement("div", { style: { padding: '8px 12px' } }, event.eventType === 'pageview' ? (React.createElement("div", null,
                        React.createElement("div", { style: { marginBottom: '4px', fontSize: '13px' } },
                            React.createElement("span", { style: { color: '#777' } }, "path: "),
                            React.createElement("span", null, ((_a = event.metadata) === null || _a === void 0 ? void 0 : _a.path) || event.url || '/')),
                        event.title && (React.createElement("div", { style: { fontSize: '13px' } },
                            React.createElement("span", { style: { color: '#777' } }, "title: "),
                            React.createElement("span", null, event.title))))) : (React.createElement("div", null,
                        React.createElement("div", { style: { marginBottom: '4px', fontSize: '13px' } },
                            React.createElement("span", { style: { color: '#777' } }, "element: "),
                            React.createElement("span", null,
                                ((_b = event.target) === null || _b === void 0 ? void 0 : _b.tagName) || 'element',
                                ((_c = event.target) === null || _c === void 0 ? void 0 : _c.category) ? " [".concat(event.target.category, "]") : '')),
                        ((_d = event.target) === null || _d === void 0 ? void 0 : _d.label) && (React.createElement("div", { style: { fontSize: '13px' } },
                            React.createElement("span", { style: { color: '#777' } }, "label: "),
                            React.createElement("span", null, event.target.label))),
                        event.position && (React.createElement("div", { style: {
                                fontSize: '12px',
                                color: '#666',
                                marginTop: '4px',
                                display: 'flex',
                                gap: '10px'
                            } },
                            React.createElement("span", null,
                                "x: ",
                                Math.round(event.position.x)),
                            React.createElement("span", null,
                                "y: ",
                                Math.round(event.position.y)))))))));
            }))))),
        activeTab === 'stats' && (React.createElement("div", { style: {
                flex: 1,
                overflow: 'auto',
                padding: '15px',
            } },
            React.createElement("div", { style: { marginBottom: '20px' } },
                React.createElement("h3", { style: { fontSize: '16px', margin: '0 0 15px 0' } }, "Event Summary"),
                React.createElement("div", { style: {
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '10px',
                    } },
                    React.createElement("div", { style: {
                            backgroundColor: '#222',
                            padding: '12px',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                        } },
                        React.createElement("span", { style: {
                                fontSize: '22px',
                                marginRight: '10px',
                                color: '#4dabf7',
                            } }, "\uD83D\uDC46"),
                        React.createElement("div", null,
                            React.createElement("div", { style: { fontWeight: 'bold' } }, clickCount),
                            React.createElement("div", { style: { fontSize: '12px', color: '#aaa' } }, "Clicks"))),
                    React.createElement("div", { style: {
                            backgroundColor: '#222',
                            padding: '12px',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                        } },
                        React.createElement("span", { style: {
                                fontSize: '22px',
                                marginRight: '10px',
                                color: '#12b886',
                            } }, "\uD83D\uDD0D"),
                        React.createElement("div", null,
                            React.createElement("div", { style: { fontWeight: 'bold' } }, pageViewCount),
                            React.createElement("div", { style: { fontSize: '12px', color: '#aaa' } }, "Page Views"))),
                    React.createElement("div", { style: {
                            backgroundColor: '#222',
                            padding: '12px',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                        } },
                        React.createElement("span", { style: {
                                fontSize: '22px',
                                marginRight: '10px',
                                color: '#845ef7',
                            } }, "\uD83D\uDCDD"),
                        React.createElement("div", null,
                            React.createElement("div", { style: { fontWeight: 'bold' } }, formSubmitCount),
                            React.createElement("div", { style: { fontSize: '12px', color: '#aaa' } }, "Form Submits"))),
                    React.createElement("div", { style: {
                            backgroundColor: '#222',
                            padding: '12px',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                        } },
                        React.createElement("span", { style: {
                                fontSize: '22px',
                                marginRight: '10px',
                                color: '#ff922b',
                            } }, "\uD83D\uDD25"),
                        React.createElement("div", null,
                            React.createElement("div", { style: { fontWeight: 'bold' } }, heatmapClickCount),
                            React.createElement("div", { style: { fontSize: '12px', color: '#aaa' } }, "Heat Map Clicks"))))),
            React.createElement("div", { style: { marginBottom: '20px' } },
                React.createElement("h3", { style: { fontSize: '16px', margin: '0 0 15px 0' } }, "Session Info"),
                React.createElement("div", { style: {
                        backgroundColor: '#222',
                        padding: '15px',
                        borderRadius: '6px',
                    } },
                    React.createElement("div", { style: {
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '10px',
                            fontSize: '14px',
                        } },
                        React.createElement("span", { style: { color: '#aaa' } }, "Session ID:"),
                        React.createElement("span", { style: { fontFamily: 'monospace' } },
                            sessionId.substring(0, 12),
                            "...")),
                    React.createElement("div", { style: {
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '10px',
                            fontSize: '14px',
                        } },
                        React.createElement("span", { style: { color: '#aaa' } }, "Device:"),
                        React.createElement("span", null, "Desktop")),
                    React.createElement("div", { style: {
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '14px',
                        } },
                        React.createElement("span", { style: { color: '#aaa' } }, "Duration:"),
                        React.createElement("span", null, formatTime(timeSpent))))),
            React.createElement("div", { style: { textAlign: 'center', marginTop: '20px' } },
                React.createElement("a", { href: privacyUrl, style: {
                        display: 'inline-block',
                        color: '#4dabf7',
                        textDecoration: 'none',
                        padding: '8px 12px',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(77, 171, 247, 0.1)',
                        fontSize: '13px',
                    } }, "Privacy Policy"))))));
}

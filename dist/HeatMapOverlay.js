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
import HeatMapVisualization from './HeatMapVisualization';
import { usePageHeatMapTracking } from './TrackingContext';
export default function HeatMapOverlay(_a) {
    var _b = _a.pageIdentifier, pageIdentifier = _b === void 0 ? window.location.pathname : _b, _c = _a.enabled, enabled = _c === void 0 ? false : _c, _d = _a.controls, controls = _d === void 0 ? true : _d;
    var _e = useState(enabled), isVisible = _e[0], setIsVisible = _e[1];
    var _f = useState({
        pointRadius: 20,
        maxOpacity: 0.8,
        threshold: 10,
        showLabels: false,
        timeRange: 'all',
        colorScheme: 'default' // 'default', 'plasma', 'viridis', 'grayscale'
    }), settings = _f[0], setSettings = _f[1];
    // Start tracking clicks for heat map
    usePageHeatMapTracking(pageIdentifier);
    // Handle keyboard shortcut to toggle heat map
    useEffect(function () {
        var handleKeyDown = function (e) {
            // Toggle heat map with Alt+H
            if (e.altKey && e.key === 'h') {
                setIsVisible(function (prev) { return !prev; });
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return function () { return window.removeEventListener('keydown', handleKeyDown); };
    }, []);
    // Get color scheme based on setting
    var getColorScheme = function () {
        switch (settings.colorScheme) {
            case 'plasma':
                return {
                    low: 'rgba(13, 8, 135, 0.6)',
                    medium: 'rgba(156, 24, 109, 0.7)',
                    high: 'rgba(249, 168, 37, 0.8)'
                };
            case 'viridis':
                return {
                    low: 'rgba(68, 1, 84, 0.6)',
                    medium: 'rgba(33, 145, 140, 0.7)',
                    high: 'rgba(253, 231, 37, 0.8)'
                };
            case 'grayscale':
                return {
                    low: 'rgba(50, 50, 50, 0.6)',
                    medium: 'rgba(120, 120, 120, 0.7)',
                    high: 'rgba(200, 200, 200, 0.8)'
                };
            default:
                return {
                    low: 'rgba(0, 0, 255, 0.6)',
                    medium: 'rgba(255, 165, 0, 0.7)',
                    high: 'rgba(255, 0, 0, 0.8)' // Red
                };
        }
    };
    // Get time range filter based on setting
    var getTimeFilter = function () {
        var now = Date.now();
        switch (settings.timeRange) {
            case 'today':
                var today = new Date();
                today.setHours(0, 0, 0, 0);
                return { startTime: today.getTime() };
            case 'week':
                var weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return { startTime: weekAgo.getTime() };
            case 'month':
                var monthAgo = new Date();
                monthAgo.setMonth(monthAgo.getMonth() - 1);
                return { startTime: monthAgo.getTime() };
            default:
                return undefined;
        }
    };
    if (!isVisible) {
        // Only render toggle button if controls are enabled
        return controls ? (React.createElement("div", { style: {
                position: 'fixed',
                bottom: '20px',
                left: '20px',
                zIndex: 1001,
                padding: '8px',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer'
            }, onClick: function () { return setIsVisible(true); } }, "Show Heat Map (Alt+H)")) : null;
    }
    return (React.createElement(React.Fragment, null,
        React.createElement(HeatMapVisualization, { pageIdentifier: pageIdentifier, pointRadius: settings.pointRadius, maxOpacity: settings.maxOpacity, colors: getColorScheme(), threshold: settings.threshold, showLabels: settings.showLabels, filter: getTimeFilter() }),
        controls && (React.createElement("div", { style: {
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: 1002,
                padding: '15px',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                color: 'white',
                borderRadius: '8px',
                width: '250px',
                fontFamily: 'Arial, sans-serif',
                fontSize: '14px'
            } },
            React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' } },
                React.createElement("h3", { style: { margin: 0 } }, "Heat Map Controls"),
                React.createElement("button", { onClick: function () { return setIsVisible(false); }, style: {
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '16px'
                    } }, "\u00D7")),
            React.createElement("div", { style: { marginBottom: '10px' } },
                React.createElement("label", { style: { display: 'block', marginBottom: '5px' } }, "Point Size:"),
                React.createElement("input", { type: "range", min: "5", max: "50", value: settings.pointRadius, onChange: function (e) { return setSettings(__assign(__assign({}, settings), { pointRadius: parseInt(e.target.value) })); }, style: { width: '100%' } })),
            React.createElement("div", { style: { marginBottom: '10px' } },
                React.createElement("label", { style: { display: 'block', marginBottom: '5px' } }, "Opacity:"),
                React.createElement("input", { type: "range", min: "0.1", max: "1", step: "0.1", value: settings.maxOpacity, onChange: function (e) { return setSettings(__assign(__assign({}, settings), { maxOpacity: parseFloat(e.target.value) })); }, style: { width: '100%' } })),
            React.createElement("div", { style: { marginBottom: '10px' } },
                React.createElement("label", { style: { display: 'block', marginBottom: '5px' } }, "Color Scheme:"),
                React.createElement("select", { value: settings.colorScheme, onChange: function (e) { return setSettings(__assign(__assign({}, settings), { colorScheme: e.target.value })); }, style: { width: '100%', padding: '5px' } },
                    React.createElement("option", { value: "default" }, "Classic (Blue-Red)"),
                    React.createElement("option", { value: "plasma" }, "Plasma"),
                    React.createElement("option", { value: "viridis" }, "Viridis"),
                    React.createElement("option", { value: "grayscale" }, "Grayscale"))),
            React.createElement("div", { style: { marginBottom: '10px' } },
                React.createElement("label", { style: { display: 'block', marginBottom: '5px' } }, "Time Range:"),
                React.createElement("select", { value: settings.timeRange, onChange: function (e) { return setSettings(__assign(__assign({}, settings), { timeRange: e.target.value })); }, style: { width: '100%', padding: '5px' } },
                    React.createElement("option", { value: "all" }, "All Time"),
                    React.createElement("option", { value: "today" }, "Today"),
                    React.createElement("option", { value: "week" }, "Past Week"),
                    React.createElement("option", { value: "month" }, "Past Month"))),
            React.createElement("div", { style: { marginBottom: '10px' } },
                React.createElement("label", { style: { display: 'flex', alignItems: 'center' } },
                    React.createElement("input", { type: "checkbox", checked: settings.showLabels, onChange: function (e) { return setSettings(__assign(__assign({}, settings), { showLabels: e.target.checked })); }, style: { marginRight: '8px' } }),
                    "Show Click Counts")),
            React.createElement("div", { style: { fontSize: '12px', opacity: '0.7', marginTop: '10px' } }, "Press Alt+H to toggle heat map")))));
}

import React, { useState, useEffect, useRef } from 'react';
import { useTracking } from './TrackingContext';
export default function HeatMapVisualization(_a) {
    var _b = _a.pageIdentifier, pageIdentifier = _b === void 0 ? window.location.pathname : _b, _c = _a.width, width = _c === void 0 ? window.innerWidth : _c, _d = _a.height, height = _d === void 0 ? window.innerHeight : _d, _e = _a.pointRadius, pointRadius = _e === void 0 ? 20 : _e, _f = _a.maxOpacity, maxOpacity = _f === void 0 ? 0.8 : _f, _g = _a.colors, colors = _g === void 0 ? {
        low: 'rgba(0, 0, 255, 0.6)',
        medium: 'rgba(255, 165, 0, 0.7)',
        high: 'rgba(255, 0, 0, 0.8)' // Red
    } : _g, _h = _a.threshold, threshold = _h === void 0 ? 10 : _h, _j = _a.showLabels, showLabels = _j === void 0 ? false : _j, filter = _a.filter;
    var events = useTracking().events;
    var canvasRef = useRef(null);
    var _k = useState(new Map()), clickPoints = _k[0], setClickPoints = _k[1];
    var _l = useState(1), maxCount = _l[0], setMaxCount = _l[1];
    // Process events to extract click points
    useEffect(function () {
        var newClickPoints = new Map();
        var newMaxCount = 1;
        // Filter for click events related to this page
        var relevantEvents = events.filter(function (event) {
            var _a, _b;
            // Only include click and heatmap_click events
            if (event.eventType !== 'click' && event.eventType !== 'heatmap_click') {
                return false;
            }
            // Filter by page identifier
            if (((_a = event.target) === null || _a === void 0 ? void 0 : _a.pageIdentifier) &&
                event.target.pageIdentifier !== pageIdentifier) {
                return false;
            }
            // Apply time range filter if provided
            if ((filter === null || filter === void 0 ? void 0 : filter.startTime) && event.timestamp < filter.startTime) {
                return false;
            }
            if ((filter === null || filter === void 0 ? void 0 : filter.endTime) && event.timestamp > filter.endTime) {
                return false;
            }
            // Apply category filter if provided
            if ((filter === null || filter === void 0 ? void 0 : filter.categories) &&
                filter.categories.length > 0 &&
                ((_b = event.target) === null || _b === void 0 ? void 0 : _b.category) &&
                !filter.categories.includes(event.target.category)) {
                return false;
            }
            return true;
        });
        // Process clicks into points
        relevantEvents.forEach(function (event) {
            if (!event.position)
                return;
            // Get normalized coordinates (adjust for scroll position)
            var x = event.position.pageX || event.position.x;
            var y = event.position.pageY || event.position.y;
            if (typeof x !== 'number' || typeof y !== 'number')
                return;
            // Round coordinates to integers to group nearby clicks
            var roundedX = Math.round(x / 5) * 5;
            var roundedY = Math.round(y / 5) * 5;
            var key = "".concat(roundedX, ",").concat(roundedY);
            // Increment counter for this position
            if (newClickPoints.has(key)) {
                var point = newClickPoints.get(key);
                point.count += 1;
                if (point.count > newMaxCount) {
                    newMaxCount = point.count;
                }
            }
            else {
                newClickPoints.set(key, { x: roundedX, y: roundedY, count: 1 });
            }
        });
        setClickPoints(newClickPoints);
        setMaxCount(Math.max(newMaxCount, threshold));
    }, [events, pageIdentifier, filter, threshold]);
    // Draw the heat map on canvas
    useEffect(function () {
        var canvas = canvasRef.current;
        if (!canvas)
            return;
        var ctx = canvas.getContext('2d');
        if (!ctx)
            return;
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        // Draw heat points
        clickPoints.forEach(function (point) {
            // Calculate intensity based on click count
            var intensity = Math.min(point.count / maxCount, 1);
            // Select color based on intensity
            var color;
            if (intensity < 0.33) {
                color = colors.low;
            }
            else if (intensity < 0.66) {
                color = colors.medium;
            }
            else {
                color = colors.high;
            }
            // Create radial gradient for point
            var gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, pointRadius);
            gradient.addColorStop(0, color);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            // Draw point
            ctx.beginPath();
            ctx.fillStyle = gradient;
            ctx.globalAlpha = intensity * maxOpacity;
            ctx.arc(point.x, point.y, pointRadius, 0, Math.PI * 2);
            ctx.fill();
            // Draw label if enabled
            if (showLabels) {
                ctx.font = '12px Arial';
                ctx.fillStyle = 'black';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.globalAlpha = 1;
                ctx.fillText(point.count.toString(), point.x, point.y);
            }
        });
    }, [clickPoints, width, height, pointRadius, maxOpacity, colors, maxCount, showLabels]);
    return (React.createElement("div", { style: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 1000
        } },
        React.createElement("canvas", { ref: canvasRef, width: width, height: height, style: {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%'
            } })));
}

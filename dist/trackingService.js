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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var TrackingClient = /** @class */ (function () {
    function TrackingClient(options) {
        if (options === void 0) { options = {}; }
        var _this = this;
        this.config = __assign({ apiEndpoint: '/api/track', flushInterval: 5000, batchSize: 20 }, options);
        // Initialize event queue
        this.queue = [];
        // Create session and user IDs
        this.sessionId = this.generateId('session');
        this.userId = this.getUserId();
        this.isSending = false;
        this.flushIntervalId = null;
        // Only setup flush interval and event listeners in browser environment
        if (typeof window !== 'undefined') {
            this.flushIntervalId = window.setInterval(function () { return _this.flush(); }, this.config.flushInterval);
            window.addEventListener('beforeunload', function () { return _this.flush(true); });
        }
    }
    TrackingClient.prototype.generateId = function (prefix) {
        return "".concat(prefix, "_").concat(Math.random().toString(36).substring(2, 15));
    };
    TrackingClient.prototype.getUserId = function () {
        if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
            return this.generateId('user');
        }
        var userId = localStorage.getItem('tracking_user_id');
        if (!userId) {
            userId = this.generateId('user');
            try {
                localStorage.setItem('tracking_user_id', userId);
            }
            catch (e) {
                console.warn('Failed to store user ID in localStorage', e);
            }
        }
        return userId;
    };
    TrackingClient.prototype.getDeviceInfo = function () {
        if (typeof window === 'undefined' || typeof navigator === 'undefined') {
            return {
                type: 'desktop',
                browser: 'unknown',
                os: 'unknown',
                screenSize: '0x0'
            };
        }
        var userAgent = navigator.userAgent;
        var deviceType = 'desktop';
        if (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
            deviceType = 'mobile';
        }
        else if (/iPad|Tablet|PlayBook/i.test(userAgent)) {
            deviceType = 'tablet';
        }
        var browser = 'unknown';
        var os = 'unknown';
        if (userAgent.indexOf('Chrome') > -1) {
            browser = 'Chrome';
        }
        else if (userAgent.indexOf('Firefox') > -1) {
            browser = 'Firefox';
        }
        else if (userAgent.indexOf('Safari') > -1) {
            browser = 'Safari';
        }
        else if (userAgent.indexOf('MSIE') > -1 || userAgent.indexOf('Trident') > -1) {
            browser = 'Internet Explorer';
        }
        else if (userAgent.indexOf('Edge') > -1) {
            browser = 'Edge';
        }
        if (/Windows/i.test(userAgent))
            os = 'Windows';
        if (/Macintosh|Mac OS X/i.test(userAgent))
            os = 'MacOS';
        if (/Linux/i.test(userAgent))
            os = 'Linux';
        if (/Android/i.test(userAgent))
            os = 'Android';
        if (/iOS|iPhone|iPad|iPod/i.test(userAgent))
            os = 'iOS';
        return {
            type: deviceType,
            browser: browser,
            os: os,
            screenSize: (typeof window !== 'undefined') ? "".concat(window.screen.width, "x").concat(window.screen.height) : '0x0'
        };
    };
    TrackingClient.prototype.track = function (eventType, data) {
        if (data === void 0) { data = {}; }
        var event = __assign({ eventId: this.generateId('evt'), userId: this.userId, sessionId: this.sessionId, timestamp: Date.now(), eventType: eventType, url: (typeof window !== 'undefined') ? window.location.href : '', referrer: (typeof document !== 'undefined') ? document.referrer : '', title: (typeof document !== 'undefined') ? document.title : '', device: this.getDeviceInfo() }, data);
        this.queue.push(event);
        // If queue is large enough, send
        if (this.queue.length >= this.config.batchSize) {
            this.flush();
        }
        return event;
    };
    // Send events to server
    TrackingClient.prototype.flush = function (immediate) {
        if (immediate === void 0) { immediate = false; }
        return __awaiter(this, void 0, void 0, function () {
            var events, blob, success, response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Skip if queue is empty or already sending (unless immediate)
                        if (this.queue.length === 0 || (this.isSending && !immediate)) {
                            return [2 /*return*/];
                        }
                        this.isSending = true;
                        events = __spreadArray([], this.queue, true);
                        this.queue = [];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, 5, 6]);
                        // Beacon API for beforeunload events
                        if (immediate && typeof navigator !== 'undefined' && navigator.sendBeacon) {
                            blob = new Blob([JSON.stringify(events)], { type: 'application/json' });
                            success = navigator.sendBeacon(this.config.apiEndpoint, blob);
                            if (!success) {
                                throw new Error('Beacon API failed');
                            }
                            this.isSending = false;
                            return [2 /*return*/];
                        }
                        if (!(typeof fetch !== 'undefined')) return [3 /*break*/, 3];
                        return [4 /*yield*/, fetch(this.config.apiEndpoint, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(events),
                                keepalive: true
                            })];
                    case 2:
                        response = _a.sent();
                        if (!response.ok) {
                            this.queue = __spreadArray(__spreadArray([], events, true), this.queue, true);
                            console.error('Failed to send tracking events:', response.statusText);
                        }
                        _a.label = 3;
                    case 3: return [3 /*break*/, 6];
                    case 4:
                        error_1 = _a.sent();
                        // Put events back in queue
                        this.queue = __spreadArray(__spreadArray([], events, true), this.queue, true);
                        console.error('Error sending tracking events:', error_1);
                        return [3 /*break*/, 6];
                    case 5:
                        this.isSending = false;
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    TrackingClient.prototype.destroy = function () {
        var _this = this;
        if (this.flushIntervalId !== null && typeof window !== 'undefined') {
            window.clearInterval(this.flushIntervalId);
            window.removeEventListener('beforeunload', function () { return _this.flush(true); });
        }
        this.flush(true);
    };
    return TrackingClient;
}());
// Create singleton instance
var trackingService = new TrackingClient({
    apiEndpoint: (typeof process !== 'undefined' && process.env.REACT_APP_TRACKING_API) || '/api/track'
});
export default trackingService;

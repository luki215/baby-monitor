"use strict";
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
        while (_) try {
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
var openMediaDevices = function (constraints) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, navigator.mediaDevices.getUserMedia(constraints)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
function playVideoFromCamera() {
    return __awaiter(this, void 0, void 0, function () {
        var constraints, stream, videoElement, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    constraints = { 'video': true, 'audio': false };
                    return [4 /*yield*/, navigator.mediaDevices.getUserMedia(constraints)];
                case 1:
                    stream = _a.sent();
                    videoElement = document.querySelector('video#localVideo');
                    videoElement.srcObject = stream;
                    makeCall(stream);
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error('Error opening video camera.', error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
var send = function (message) { return new Promise(function (resolve) {
    resolve(message);
}); };
var Channel = /** @class */ (function () {
    function Channel() {
        this.listeners = [];
    }
    Channel.prototype.listen = function (onNewMessage) {
        this.listeners.push(onNewMessage);
    };
    Channel.prototype.send = function (message) {
        console.log('SENDING---', message, JSON.stringify(message).length);
        console.log(this.listeners);
        this.listeners.forEach(function (listener) { return listener(message); });
    };
    return Channel;
}());
var c = new Channel();
function makeCall(stream) {
    return __awaiter(this, void 0, void 0, function () {
        var configuration, peerConnection, offer;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    configuration = { 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }] };
                    peerConnection = new RTCPeerConnection(configuration);
                    stream.getTracks().forEach(function (t) { return peerConnection.addTrack(t); });
                    c.listen(function (message) { return __awaiter(_this, void 0, void 0, function () {
                        var remotetDesc;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!message.answer) return [3 /*break*/, 2];
                                    remotetDesc = new RTCSessionDescription(message.answer);
                                    return [4 /*yield*/, peerConnection.setRemoteDescription(remotetDesc)];
                                case 1:
                                    _a.sent();
                                    _a.label = 2;
                                case 2: return [2 /*return*/];
                            }
                        });
                    }); });
                    return [4 /*yield*/, peerConnection.createOffer()];
                case 1:
                    offer = _a.sent();
                    return [4 /*yield*/, peerConnection.setLocalDescription(offer)];
                case 2:
                    _a.sent();
                    c.send({ 'offer': offer });
                    // Listen for local ICE candidates on the local RTCPeerConnection
                    peerConnection.addEventListener('icecandidate', function (event) {
                        if (event.candidate) {
                            c.send({ 'iceCandidate': event.candidate });
                        }
                    });
                    return [2 /*return*/];
            }
        });
    });
}
function listenToCall() {
    return __awaiter(this, void 0, void 0, function () {
        var configuration, peerConnection, remoteStream, remoteVideo;
        var _this = this;
        return __generator(this, function (_a) {
            configuration = { 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }] };
            peerConnection = new RTCPeerConnection(configuration);
            remoteStream = new MediaStream();
            remoteVideo = document.getElementById('remoteVideo');
            remoteVideo.srcObject = remoteStream;
            peerConnection.addEventListener('track', function (event) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    console.log('track added');
                    remoteStream.addTrack(event.track);
                    return [2 /*return*/];
                });
            }); });
            c.listen(function (message) { return __awaiter(_this, void 0, void 0, function () {
                var answer;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!message.offer) return [3 /*break*/, 3];
                            peerConnection.setRemoteDescription(new RTCSessionDescription(message.offer));
                            return [4 /*yield*/, peerConnection.createAnswer()];
                        case 1:
                            answer = _a.sent();
                            return [4 /*yield*/, peerConnection.setLocalDescription(answer)];
                        case 2:
                            _a.sent();
                            c.send({ 'answer': answer });
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Listen for remote ICE candidates and add them to the local RTCPeerConnection
            c.listen(function (message) { return __awaiter(_this, void 0, void 0, function () {
                var e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!message.iceCandidate) return [3 /*break*/, 4];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, peerConnection.addIceCandidate(message.iceCandidate)];
                        case 2:
                            _a.sent();
                            console.log('ice added');
                            return [3 /*break*/, 4];
                        case 3:
                            e_1 = _a.sent();
                            console.error('Error adding received ice candidate', e_1);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
            // Listen for connectionstatechange on the local RTCPeerConnection
            peerConnection.addEventListener('connectionstatechange', function (event) {
                if (peerConnection.connectionState === 'connected') {
                    console.log('connected');
                }
            });
            return [2 /*return*/];
        });
    });
}
listenToCall();
playVideoFromCamera();

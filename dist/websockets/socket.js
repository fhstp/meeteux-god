"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IO = require("socket.io");
const jwt = require("jsonwebtoken");
const database_1 = require("../database");
const controller_1 = require("../controller");
const exhibitController_1 = require("../controller/exhibitController");
const messages_1 = require("../messages");
const authenticationTypes_1 = require("../messages/authenticationTypes");
class WebSocket {
    constructor(server) {
        this.io = new IO(server);
        this.odController = new controller_1.OdController();
        this.locationController = new controller_1.LocationController();
        this.exhibitController = new exhibitController_1.ExhibitController();
        this.database = database_1.Connection.getInstance();
        this.attachListeners();
    }
    attachListeners() {
        this.io.on('connection', (socket) => {
            socket.use((packet, next) => {
                const event = packet[0];
                const token = socket.token;
                if (event.localeCompare('registerOD') !== 0 && event.localeCompare('autoLoginOD') !== 0 && event.localeCompare('registerODGuest') !== 0 && event.localeCompare('disconnectedFromExhibit') !== 0 && event.localeCompare('loginExhibit') !== 0) {
                    jwt.verify(token, process.env.SECRET, (err, decoded) => {
                        if (err)
                            return next(new Error('Invalid token Error'));
                        const user = decoded.user;
                        if (user) {
                            if (user.isGuest) {
                                if (this.checkGuestAccess(event)) {
                                    next();
                                }
                                else {
                                    next(new Error('Access Restricted Error'));
                                }
                            }
                            else {
                                next();
                            }
                        }
                        next(new Error('Access Restricted Error'));
                    });
                }
                else {
                    next();
                }
            });
            socket.emit('news', { hello: 'world' });
            socket.on('registerOD', (data) => {
                this.odController.registerOD(data).then((result) => {
                    const user = result.data.user;
                    const locations = result.data.locations;
                    // Generate token
                    const token = jwt.sign({ user }, process.env.SECRET);
                    // Add token to result and to the socket connection
                    result.data = { token, user, locations };
                    socket.token = token;
                    socket.emit('registerODResult', result);
                });
            });
            socket.on('autoLoginOD', (data) => {
                jwt.verify(data, process.env.SECRET, (err, decoded) => {
                    if (err || !decoded)
                        return { data: null, message: new messages_1.Message(authenticationTypes_1.INVALID_TOKEN, "Invalid token!") };
                    const user = decoded.user;
                    if (user) {
                        this.odController.autoLoginUser(user.id).then((result) => {
                            if (result.message.code <= 299) {
                                const user = result.data.user;
                                const locations = result.data.locations;
                                // Generate token
                                const token = jwt.sign({ user }, process.env.SECRET);
                                // Add token to result and to the socket connection
                                result.data = { token, user, locations };
                                socket.token = token;
                            }
                            socket.emit('autoLoginODResult', result);
                        });
                    }
                });
            });
            socket.on('loginOD', (data) => {
                this.odController.loginUser(data).then((result) => {
                    const user = result.data.user;
                    const locations = result.data.locations;
                    // Generate token
                    const token = jwt.sign({ user }, process.env.SECRET);
                    // Add token to result and to the socket connection
                    result.data = { token, user, locations };
                    socket.token = token;
                    socket.emit('loginODResult', result);
                });
            });
            socket.on('registerODGuest', (data) => {
                this.odController.registerGuest(data).then((result) => {
                    const user = result.data.user;
                    const locations = result.data.locations;
                    // Generate token
                    const token = jwt.sign({ user }, process.env.SECRET);
                    // Add token to result and to the socket connection
                    result.data = { token, user, locations };
                    socket.token = token;
                    socket.emit('registerODResult', result);
                });
            });
            socket.on('registerLocation', (data) => {
                // console.log("register location: " + data.location + ", " + data.user);
                this.locationController.registerLocation(data).then((message) => {
                    socket.emit('registerLocationResult', message);
                });
            });
            socket.on('registerLocationLike', (data) => {
                this.locationController.registerLocationLike(data).then((message) => {
                    socket.emit('registerLocationLikeResult', message);
                });
            });
            socket.on('disconnectedFromExhibit', (data) => {
                console.log('disconnectedFromExhibit');
                this.locationController.disconnectedFromExhibit(data).then((message) => {
                    socket.emit('disconnectedFromExhibitResult', message);
                });
            });
            socket.on('disconnectUsers', (data) => {
                this.locationController.tableDisconnectFromExhibit(data);
            });
            socket.on('checkLocationStatus', (data) => {
                this.locationController.checkLocationStatus(data).then((message) => {
                    socket.emit('checkLocationStatusResult', message);
                });
            });
            socket.on('loginExhibit', (ipAddress) => {
                this.exhibitController.loginExhibit(ipAddress).then((message) => {
                    socket.emit('loginExhibitResult', message);
                });
            });
        });
    }
    checkGuestAccess(event) {
        let ok = true;
        // TODO: Check with restricted events
        return ok;
    }
}
exports.WebSocket = WebSocket;
//# sourceMappingURL=socket.js.map
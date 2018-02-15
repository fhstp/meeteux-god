"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IO = require("socket.io");
const jwt = require("jsonwebtoken");
const database_1 = require("../database");
const controller_1 = require("../controller");
const exhibitController_1 = require("../controller/exhibitController");
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
                if (event !== 'registerOD') {
                    jwt.verify(token, process.env.SECRET, function (err, decoded) {
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
                next();
            });
            socket.emit('news', { hello: 'world' });
            socket.on('registerOD', (data) => {
                this.odController.registerOD(data).then((values) => {
                    const user = values.user;
                    const locations = values.locations;
                    // Generate token
                    const token = jwt.sign({ user }, process.env.SECRET);
                    // Add token to result and to the socket connection
                    const result = { token, user, locations };
                    socket.token = token;
                    socket.emit('registerODResult', result);
                });
            });
            socket.on('registerODGuest', (data) => {
                this.odController.registerGuest(data).then((values) => {
                    const user = values.user;
                    const locations = values.locations;
                    // Generate token
                    const token = jwt.sign({ user }, 'cookies');
                    // Add token to result and to the socket connection
                    const result = { token, user, locations };
                    socket.token = token;
                    socket.emit('registerODResult', result);
                });
            });
            socket.on('registerLocation', (data) => {
                this.locationController.registerLocation(data).then((message) => {
                    socket.emit('registerLocationResult', message);
                });
            });
            socket.on('disconnectedFromExhibit', (data) => {
                const parentLocation = data.parentLocation;
                const location = data.location;
                this.locationController.disconnectedFromExhibit(parentLocation, location).then((message) => {
                    socket.emit('disconnectedFromExhibitResult', message);
                });
            });
            socket.on('disconnectNotRespondingUsers', (data) => {
                this.locationController.tableDisconnectFromExhibit(data);
            });
            socket.on('checkLocationStatus', (data) => {
                this.locationController.checkLocationStatus(data).then((message) => {
                    socket.emit('checkLocationStatusResult', message);
                });
            });
            socket.on('loginExhibit', (ipAddress) => {
                //console.log(ipAddress);
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
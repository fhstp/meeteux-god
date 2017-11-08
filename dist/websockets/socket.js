"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IO = require("socket.io");
const database_1 = require("../database");
const controller_1 = require("../controller");
const exhibitController_1 = require("../controller/exhibitController");
class WebSocket {
    constructor(server) {
        this.socket = new IO(server);
        this.odController = new controller_1.OdController();
        this.locationController = new controller_1.LocationController();
        this.exhibitController = new exhibitController_1.ExhibitController();
        this.database = database_1.Connection.getInstance();
        this.attachListeners();
    }
    attachListeners() {
        this.socket.on('connection', (socket) => {
            socket.emit('news', { hello: 'world' });
            socket.on('registerOD', (data) => {
                this.odController.registerOD(data).then((values) => {
                    socket.emit('registerODResult', values);
                });
            });
            socket.on('registerLocation', (data) => {
                this.locationController.registerLocation(data).then((message) => {
                    socket.emit('registerLocationResult', message);
                });
            });
            socket.on('checkLocationStatus', (data) => {
                this.locationController.checkLocationStatus(data).then((message) => {
                    socket.emit('checkLocationStatusResult', message);
                });
            });
            socket.on('loginExhibit', (ipAddress) => {
                console.log(ipAddress);
                this.exhibitController.loginExhibit(ipAddress).then((message) => {
                    socket.emit('loginExhibitResult', message);
                });
            });
        });
    }
}
exports.WebSocket = WebSocket;
//# sourceMappingURL=socket.js.map
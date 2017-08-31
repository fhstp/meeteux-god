"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IO = require("socket.io");
const database_1 = require("../database");
const controller_1 = require("../controller");
class WebSocket {
    constructor(server) {
        this.socket = new IO(server);
        this.odController = new controller_1.OdController();
        this.database = database_1.Connection.getInstance();
        this.attachListeners();
    }
    attachListeners() {
        this.socket.on('connection', (socket) => {
            socket.emit('news', { hello: 'world' });
            socket.on('my other event', function (data) {
                console.log(data);
            });
            socket.on('registerOD', (data) => {
                this.odController.registerOD(data);
            });
        });
    }
}
exports.WebSocket = WebSocket;
//# sourceMappingURL=socket.js.map
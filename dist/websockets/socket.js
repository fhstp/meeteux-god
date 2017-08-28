"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IO = require("socket.io");
const database_1 = require("../database");
class WebSocket {
    constructor(server) {
        this.socket = new IO(server);
        this.database = database_1.Connection.getInstance();
        this.attachListeners();
    }
    attachListeners() {
        this.socket.on('connection', function (socket) {
            socket.emit('news', { hello: 'world' });
            socket.on('my other event', function (data) {
                console.log(data);
            });
        });
    }
}
exports.WebSocket = WebSocket;
//# sourceMappingURL=socket.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IO = require("socket.io");
class Websocket {
    constructor(server) {
        this.socket = new IO(server);
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
exports.default = Websocket;
//# sourceMappingURL=websocket.js.map
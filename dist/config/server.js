"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Express = require("express");
const http = require("http");
const websockets_1 = require("../websockets");
class Server {
    constructor() {
        this.app = new Express();
        this.server = new http.Server(this.app);
        this.socket = new websockets_1.WebSocket(this.server);
        this.server.listen(3000);
        this.app.get('/', function (req, res) {
            res.sendFile(process.env.NODE_PATH + '/assets/index.html');
        });
    }
}
exports.default = Server;
//# sourceMappingURL=server.js.map
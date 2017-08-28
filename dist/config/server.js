"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Express = require("express");
const http = require("http");
const websockets_1 = require("../websockets");
require('dotenv').config();
class Server {
    constructor() {
        this.app = new Express();
        this.server = new http.Server(this.app);
        this.socket = new websockets_1.WebSocket(this.server);
        this.server.listen(process.env.SERVER_PORT);
        //this.app.get('/', function (req, res)
        //{
        //console.log(process.env.NODE_PATH);
        // res.sendFile(process.env.NODE_PATH + '/assets/index.html');
        //});
    }
}
exports.default = Server;
//# sourceMappingURL=server.js.map
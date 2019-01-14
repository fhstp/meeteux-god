"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Express = require("express");
const fs = require("fs");
const https = require("https");
const websockets_1 = require("../websockets");
const logger_1 = require("./logger");
require('dotenv').config();
//import * as http from 'http';
class Server {
    constructor() {
        this._logger = logger_1.default.getInstance();
        const cred = this.loadCredentials();
        this.app = new Express();
        this.server = https.createServer(cred, this.app);
        this.socket = new websockets_1.WebSocket(this.server);
        this.server.listen(process.env.SERVER_PORT, () => {
            this._logger.info('Server runs on Port ' + process.env.SERVER_PORT);
        });
        this.app.get('/', function (req, res) {
            res.sendFile(process.env.NODE_PATH + '/assets/localIndex.html');
        });
    }
    loadCredentials() {
        const cert = fs.readFileSync(process.env.CERT_PATH + '/fullchain.pem');
        const key = fs.readFileSync(process.env.CERT_PATH + '/privkey.pem');
        return {
            key: key,
            cert: cert
        };
    }
}
exports.default = Server;
//# sourceMappingURL=server.js.map
import * as Express from 'express';
import * as fs from 'fs';
import * as https from 'https';
import  { WebSocket } from '../websockets';
import Logger from './logger';
require('dotenv').config();

export default class Server
{
    private server: any;
    private socket: WebSocket;
    private app: any;
    private _logger: Logger;

    constructor()
    {
        this._logger = Logger.getInstance();
        const cred = this.loadCredentials();

        this.app = new Express();
        this.server = https.createServer(cred, this.app);
        //this.server = https.createServer(cred, this.app);
        this.socket = new WebSocket(this.server);

        this.server.listen(process.env.SERVER_PORT, () => {
            this._logger.info('Server runs on Port ' + process.env.SERVER_PORT);
        });

        this.app.get('/', function (req, res)
        {
            res.sendFile(process.env.NODE_PATH + '/assets/localIndex.html');
        });
    }

    private loadCredentials(): any
    {
        const cert = fs.readFileSync(process.env.CERT_PATH + '/fullchain.pem');
        const key = fs.readFileSync(process.env.CERT_PATH + '/privkey.pem');

        return {
            key: key,
            cert: cert
        };
    }
}


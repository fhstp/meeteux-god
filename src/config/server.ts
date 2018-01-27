import * as Express from 'express';
import * as fs from 'fs';
import * as https from 'https';
import  { WebSocket } from '../websockets';
require('dotenv').config();

//import * as http from 'http';

export default class Server
{
    private server: any;
    private socket: WebSocket;
    private app: any;

    constructor()
    {
        const cred = this.loadCredentials();

        this.app = new Express();
        this.server = https.createServer(cred, this.app);
        this.socket = new WebSocket(this.server);

        console.log('Server runs on Port: ' + process.env.SERVER_PORT);
        this.server.listen(process.env.SERVER_PORT);

        /*this.app.get('/', function (req, res)
        {
            console.log(process.env.NODE_PATH);
            res.sendFile(process.env.NODE_PATH + '/assets/godIndex.html');
        });*/
    }

    private loadCredentials(): any
    {
        const cert = fs.readFileSync(process.env.CERT_PATH + '/fullchain.pem')
        const key = fs.readFileSync(process.env.CERT_PATH + '/privkey.pem')

        return {
            key: key,
            cert: cert
        };
    }
}


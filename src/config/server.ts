import * as Express from 'express';
import * as http from 'http';
import  { WebSocket } from '../websockets';
require('dotenv').config();

export default class Server
{
    private server: any;
    private socket: WebSocket;
    private app: any;

    constructor()
    {
        this.app = new Express();
        this.server = new http.Server(this.app);
        this.socket = new WebSocket(this.server);

        console.log('Server runs on Port: ' + process.env.SERVER_PORT);
        this.server.listen(process.env.SERVER_PORT);

        //this.app.get('/', function (req, res)
        //{
            //console.log(process.env.NODE_PATH);
           // res.sendFile(process.env.NODE_PATH + '/assets/localIndex.html');
        //});
    }
}


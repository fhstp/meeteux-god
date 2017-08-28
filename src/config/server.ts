import * as Express from 'express';
import * as http from 'http';
require('dotenv').config();
import  { WebSocket } from '../websockets';

export default class Server
{
    private server: any;
    private socket: any;
    private app: any;

    constructor()
    {
        this.app = new Express();
        this.server = new http.Server(this.app);
        this.socket = new WebSocket(this.server);

        this.server.listen(3000);

        //this.app.get('/', function (req, res)
        //{
            //console.log(process.env.NODE_PATH);
           // res.sendFile(process.env.NODE_PATH + '/assets/index.html');
        //});
    }
}


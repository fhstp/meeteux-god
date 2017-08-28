import * as Express from 'express';
import * as http from 'http';
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

        this.server.listen(80);

        this.app.get('/', function (req, res)
        {
            res.sendFile(process.env.NODE_PATH + '/assets/index.html');
        });
    }
}


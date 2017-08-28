import * as IO from 'socket.io';
import  { Connection } from '../database';

export class WebSocket
{
    private socket: any;
    private database: any;

    constructor(server: any)
    {
        this.socket = new IO(server);
        this.database = Connection.getInstance();

        this.attachListeners();
    }

    private attachListeners(): void
    {
        this.socket.on('connection', function (socket)
        {
            socket.emit('news', { hello: 'world' });
            socket.on('my other event', function (data) {
                console.log(data);
            });
        });
    }
}
import * as IO from 'socket.io';

export class WebSocket
{
    private socket: any

    constructor(server: any)
    {
        this.socket = new IO(server);

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
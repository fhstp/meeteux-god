import * as IO from 'socket.io';
import  { Connection } from '../database';
import { OdController } from "../controller";

export class WebSocket
{
    private socket: any;
    private database: any;
    private odController: OdController;

    constructor(server: any)
    {
        this.socket = new IO(server);
        this.odController = new OdController();
        this.database = Connection.getInstance();

        this.attachListeners();
    }

    private attachListeners(): void
    {
        this.socket.on('connection', (socket) =>
        {
            socket.emit('news', { hello: 'world' });
            socket.on('my other event', function (data) {
                console.log(data);
            });
            socket.on('registerOD', (data) => {
                this.odController.registerOD(data);
            });
        });
    }
}
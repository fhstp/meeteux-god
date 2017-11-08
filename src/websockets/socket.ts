import * as IO from 'socket.io';
import  { Connection } from '../database';
import { OdController, LocationController } from "../controller";
import {ExhibitController} from "../controller/exhibitController";

export class WebSocket
{
    private socket: any;
    private database: any;
    private odController: OdController;
    private locationController: LocationController;
    private exhibitController: ExhibitController;

    constructor(server: any)
    {
        this.socket = new IO(server);
        this.odController = new OdController();
        this.locationController = new LocationController();
        this.exhibitController = new ExhibitController();
        this.database = Connection.getInstance();

        this.attachListeners();
    }

    private attachListeners(): void
    {
        this.socket.on('connection', (socket) =>
        {
            socket.emit('news', { hello: 'world' });

            socket.on('registerOD', (data) =>
            {
                this.odController.registerOD(data).then( (values) =>
                {
                    socket.emit('registerODResult', values);
                });
            });

            socket.on('registerLocation', (data) =>
            {
                this.locationController.registerLocation(data).then( (message) =>
                {
                    socket.emit('registerLocationResult', message);
                });
            });

            socket.on('checkLocationStatus', (data) =>
            {
               this.locationController.checkLocationStatus(data).then( (message) =>
               {
                  socket.emit('checkLocationStatusResult', message);
               });
            });

            socket.on('loginExhibit', (ipAddress) =>
            {
                console.log(ipAddress);
                this.exhibitController.loginExhibit(ipAddress).then( (message) =>
                {
                    socket.emit('loginExhibitResult', message);
                });
            });
        });
    }
}
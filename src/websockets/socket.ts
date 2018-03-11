import * as IO from 'socket.io';
import * as jwt from 'jsonwebtoken';
import  { Connection } from '../database';
import { OdController, LocationController } from "../controller";
import {ExhibitController} from "../controller/exhibitController";

export class WebSocket
{
    private io: any;
    private database: any;
    private odController: OdController;
    private locationController: LocationController;
    private exhibitController: ExhibitController;

    constructor(server: any)
    {
        this.io = new IO(server);
        this.odController = new OdController();
        this.locationController = new LocationController();
        this.exhibitController = new ExhibitController();
        this.database = Connection.getInstance();

        this.attachListeners();
    }

    private attachListeners(): void
    {
        this.io.on('connection', (socket) =>
        {
            socket.use((packet, next) =>
            {
                const event = packet[0];
                const token = socket.token;

                if(event !== 'registerOD')
                {
                    jwt.verify(token, process.env.SECRET, (err, decoded) =>
                    {
                        if(err) return next(new Error('Invalid token Error'));

                        const user = decoded.user;

                        if(user)
                        {
                            if(user.isGuest)
                            {
                                if(this.checkGuestAccess(event))
                                {
                                    next();
                                }
                                else
                                {
                                    next(new Error('Access Restricted Error'));
                                }
                            }
                            else {
                                next();
                            }
                        }

                        next(new Error('Access Restricted Error'));
                    });
                }

                next();
            });

            socket.emit('news', { hello: 'world' });

            socket.on('registerOD', (data) =>
            {
                this.odController.registerOD(data).then( (result) =>
                {
                    const user = result.data.user;
                    const locations = result.data.locations;

                    // Generate token
                    const token = jwt.sign({user}, process.env.SECRET);

                    // Add token to result and to the socket connection
                    result.data = {token, user, locations};
                    socket.token = token;

                    socket.emit('registerODResult', result);
                });
            });

            socket.on('registerODGuest', (data) =>
            {
                this.odController.registerGuest(data).then( (result) =>
                {
                    const user = result.data.user
                    const locations = result.data.locations;

                    // Generate token
                    const token = jwt.sign({user}, process.env.SECRET);

                    // Add token to result and to the socket connection
                    result.data = {token, user, locations};
                    socket.token = token;

                    socket.emit('registerODResult', result);
                });
            });

            socket.on('registerLocation', (data) =>
            {
                this.locationController.registerLocation(data).then( (message) =>
                {
                    socket.emit('registerLocationResult', message);
                });
            });

            socket.on('disconnectedFromExhibit', (data) =>
            {
                this.locationController.disconnectedFromExhibit(data).then( (message) =>
                {
                    socket.emit('disconnectedFromExhibitResult', message);
                });
            });

            socket.on('disconnectNotRespondingUsers', (data) =>
            {
                console.log(data);
                this.locationController.tableDisconnectFromExhibit(data);
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
                this.exhibitController.loginExhibit(ipAddress).then( (message) =>
                {
                    socket.emit('loginExhibitResult', message);
                });
            });
        });
    }

    private checkGuestAccess(event: String): boolean
    {
        let ok = true;

        // TODO: Check with restricted events

        return ok;
    }
}
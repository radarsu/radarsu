import {
    IRadarsuMessage, IRadarsuResponse, WebSocket, _, uuidv1,
} from './import';

export interface RadarsuWsExtended extends WebSocket {
    rs: RadarsuSocket;
}

export class RadarsuSocket {
    // attributes
    public ws: RadarsuWsExtended;

    public constructor(socket: WebSocket) {
        this.ws = _.assign(socket, {
            rs: this,
        });
    }

    // public
    public emit(data: IRadarsuMessage) {
        // data.uuid = uuidv1();
        return this.send(data);
    }

    public res(data: IRadarsuResponse) {
        return this.send(data);
    }

    // private
    private send(params: any) {
        // stringify
        if (_.isObject(params)) {
            params = JSON.stringify(params);
        }

        return new Promise((resolve, reject) => {
            this.ws.send(params, (err?: Error) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve();
            });
        });
    }
}

/// <reference types="ws" />
import { IRadarsuMessage, IRadarsuResponse, WebSocket } from './import';
export interface RadarsuWsExtended extends WebSocket {
    rs: RadarsuSocket;
}
export declare class RadarsuSocket {
    ws: RadarsuWsExtended;
    constructor(socket: WebSocket);
    emit(data: IRadarsuMessage): Promise<{}>;
    res(data: IRadarsuResponse): Promise<{}>;
    private send(params);
}

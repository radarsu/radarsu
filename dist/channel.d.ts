import { IRadarsuMessage, RadarsuSocket } from './import';
export declare class RadarsuChannel {
    connections: RadarsuSocket[];
    constructor(connections?: RadarsuSocket[]);
    leave(...connections: any[]): void;
    join(...connections: any[]): void;
    emit(params: IRadarsuMessage): Promise<void>;
}
export declare class RadarsuCombinedChannel extends RadarsuChannel {
    children: RadarsuChannel[];
    constructor(children?: RadarsuChannel[]);
    leave(...connections: any[]): void;
    join(...connections: any[]): void;
    emit(params: IRadarsuMessage): Promise<void>;
    private refresh();
    private call(method, ...args);
}

export interface IRadarsuResponse {
    args?: any;
    uuid?: string;
}
export interface IRadarsuMessage extends IRadarsuResponse {
    action?: string;
}
export declare type AnyFunction = (...args: any[]) => any;
export declare type VoidFunction = (...args: any[]) => void;

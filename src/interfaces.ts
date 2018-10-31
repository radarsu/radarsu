// responding with uuid and result in args
export interface IRadarsuResponse {
    args?: any;
	uuid?: string;
}

// general interface for functions like ws.emit({action, args})
export interface IRadarsuMessage extends IRadarsuResponse {
    action?: string;
}

export type AnyFunction = (...args: any[]) => any;
export type VoidFunction = (...args: any[]) => void;

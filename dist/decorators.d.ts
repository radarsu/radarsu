export declare const radarsuControllers: {
    [controllerName: string]: any;
};
export declare const RadarsuController: (target: any) => void;
export declare type MiddlewareFunction = () => Promise<void>;
export declare const RadarsuMiddleware: (...middlewares: any[]) => (target: any) => void;
export declare const radarsuModels: any[];
export declare const RadarsuModel: (target: any) => void;

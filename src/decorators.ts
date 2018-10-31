import {
    _,
} from './import';

// controller
export const radarsuControllers: {
    [controllerName: string]: any;
} = {};
export const RadarsuController = (target) => {
    const controllerName = _.kebabCase(target.name.replace(/Controller$/, ''));
    radarsuControllers[controllerName] = new target();
};

// middleware
export type MiddlewareFunction = () => Promise<void>;
export const RadarsuMiddleware = (...middlewares: any[]) => {
    return (target: any) => {
        (target as any).middlewares = middlewares;
    };
};

export const radarsuModels = [];
export const RadarsuModel = (target) => {
    radarsuModels.push(target);
};

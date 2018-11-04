"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const import_1 = require("./import");
exports.radarsuControllers = {};
exports.RadarsuController = (target) => {
    const controllerName = import_1._.kebabCase(target.name.replace(/Controller$/, ''));
    exports.radarsuControllers[controllerName] = new target();
};
exports.RadarsuMiddleware = (...middlewares) => {
    return (target) => {
        target.middlewares = middlewares;
    };
};
exports.radarsuModels = [];
exports.RadarsuModel = (target) => {
    exports.radarsuModels.push(target);
};
//# sourceMappingURL=decorators.js.map
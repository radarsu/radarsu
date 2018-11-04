"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const import_1 = require("./import");
class RadarsuSocket {
    constructor(socket) {
        this.ws = import_1._.assign(socket, {
            rs: this,
        });
    }
    emit(data) {
        return this.send(data);
    }
    res(data) {
        return this.send(data);
    }
    send(params) {
        if (import_1._.isObject(params)) {
            params = JSON.stringify(params);
        }
        return new Promise((resolve, reject) => {
            this.ws.send(params, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }
}
exports.RadarsuSocket = RadarsuSocket;
//# sourceMappingURL=socket.js.map
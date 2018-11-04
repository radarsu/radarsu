"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const import_1 = require("./import");
class RadarsuChannel {
    constructor(connections = []) {
        this.connections = connections;
    }
    leave(...connections) {
        connections.forEach((connection) => {
            const index = this.connections.indexOf(connection);
            if (index !== -1) {
                this.connections.splice(index, 1);
            }
        });
    }
    join(...connections) {
        connections.forEach((connection) => {
            if (this.connections.indexOf(connection) === -1) {
                this.connections.push(connection);
            }
        });
    }
    emit(params) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const ws of this.connections) {
                yield ws.emit(params);
            }
        });
    }
}
exports.RadarsuChannel = RadarsuChannel;
const collectConnections = (children) => {
    const arrs = import_1._.map(children, (child) => {
        return child.connections;
    });
    return import_1._.spread(import_1._.union)(arrs);
};
class RadarsuCombinedChannel extends RadarsuChannel {
    constructor(children = []) {
        super(collectConnections(children));
        this.children = children;
        this.children = children;
    }
    leave(...connections) {
        for (const child of this.children) {
            child.leave(...connections);
        }
    }
    join(...connections) {
        for (const child of this.children) {
            child.join(...connections);
        }
    }
    emit(params) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const ws of this.connections) {
                yield ws.emit(params);
            }
        });
    }
    refresh() {
        this.connections = collectConnections(this.children);
    }
    call(method, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            this.refresh();
            for (const ws of this.connections) {
                yield ws[method](...args);
            }
        });
    }
}
exports.RadarsuCombinedChannel = RadarsuCombinedChannel;
//# sourceMappingURL=channel.js.map
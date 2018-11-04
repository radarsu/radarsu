/// <reference types="sequelize" />
/// <reference types="ws" />
/// <reference types="node" />
/// <reference types="express" />
import { ApolloServer, ISequelizeConfig, RadarsuSocket, Sequelize, WebSocket, express, http, https, sequelize, winston } from './import';
export * from './decorators';
export * from './interfaces';
export * from './socket';
export interface IRadarsuSequelizeConfig {
    constructor?: ISequelizeConfig;
    sync?: sequelize.SyncOptions;
}
export interface IRadarsuConfig {
    dir?: string;
    app?: Radarsu;
    ws?: WebSocket.ServerOptions;
    sequelize?: IRadarsuSequelizeConfig;
    winston?: winston.LoggerOptions;
    http?: https.ServerOptions;
}
export declare class Radarsu {
    apollo: ApolloServer;
    connections: RadarsuSocket[];
    db: Sequelize;
    express: express.Application;
    http: https.Server | http.Server;
    log: winston.Logger;
    wss: WebSocket.Server;
    launch(config?: IRadarsuConfig): Promise<void>;
    initDb(config: IRadarsuConfig): Promise<void>;
    initHttp2(config: IRadarsuConfig): Promise<void>;
    initLogger(config: IRadarsuConfig): Promise<void>;
    initWs(config: IRadarsuConfig): Promise<void>;
    initLogo(config: any): void;
}

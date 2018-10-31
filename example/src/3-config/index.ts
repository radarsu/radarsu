import {
    IRadarsuConfig,
} from '../import';

// configs
import http from './http';
import sequelize from './sequelize';
import winston from './winston';
import ws from './ws';

export { radarsuLogger } from './winston';

export const config: IRadarsuConfig = {
    winston,
    sequelize,
    ws,
    http,
    dir: process.cwd(),
};

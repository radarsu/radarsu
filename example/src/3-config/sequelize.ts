import {
    IRadarsuSequelizeConfig,
} from '../import';

export default {
    constructor: {
        operatorsAliases: false,
        dialect: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'loganik1#',
        database: 'shard_game',
        logging: false,
        modelPaths: [`4-models`],
    },
    sync: {
        logging: false,
        alter: true,
        force: true,
    },
} as IRadarsuSequelizeConfig;

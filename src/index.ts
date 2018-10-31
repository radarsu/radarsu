import {
    ApolloServer, GraphQLObjectType, GraphQLSchema, GraphQLString, IRadarsuMessage, IRadarsuResponse, ISequelizeConfig, RadarsuSocket, Sequelize, VoidFunction, WebSocket, _, express, fs, gql, graphql, http, https, opn, path, radarsuControllers, radarsuModels, sequelize, winston, SubscriptionServer, execute, subscribe,
} from './import';

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

export class Radarsu {
    // attributes
    public apollo: ApolloServer;
    public connections: RadarsuSocket[] = [];
    public db: Sequelize;
    public express: express.Application;
    public http: https.Server | http.Server;
    public log: winston.Logger;
    public wss: WebSocket.Server;

    // public
    public async launch(config: IRadarsuConfig = {}) {
        // prepare logger
        await this.initLogger(config);

        // connect to db
        await this.initDb(config);

        // http2 server
        await this.initHttp2(config);

        // ws server
        await this.initWs(config);

        // logo
        await this.initLogo(config);
    }

    public async initDb(config: IRadarsuConfig) {
        this.db = new Sequelize(config.sequelize.constructor);
        this.db.addModels(radarsuModels);
        await this.db.sync(config.sequelize.sync);
        this.log.info(`Database - done.`);
    }

    public async initHttp2(config: IRadarsuConfig) {
        this.express = express();

        // static pages
        this.express.use('/', express.static('templates/startbootstrap-resume-gh-pages'));
        this.express.use('/ws', express.static('templates/ws'));
        this.express.use('/admin', express.static('templates/ngx-admin-master/dist'));

        // http
        if (config.http.cert && config.http.key) {
            this.http = https.createServer(config.http, this.express);
        } else {
            this.http = http.createServer(this.express);
        }

        // create ApolloServer
        // Construct a schema, using GraphQL schema language
        const typeDefs = gql`
          type Query {
            hello: String
          }
        `;

        // Provide resolver functions for your schema fields
        const resolvers = {
            Query: {
                hello: () => 'Hello world!',
            },
        };

        this.apollo = new ApolloServer({ typeDefs, resolvers });
        this.apollo.applyMiddleware({ app: this.express });

        // graphql
        const schema = new GraphQLSchema({
            query: new GraphQLObjectType({
                name: 'RootQueryType',
                fields: {
                    hello: {
                        type: GraphQLString,
                        resolve() {
                            return 'world';
                        },
                    },
                },
            }),
        });

        const subscriptionServer = SubscriptionServer.create({
            schema,
            execute,
            subscribe,
        }, {
                server: this.http,
                path: '/graphql',
            });

        // swagger
        // load tsoajson
        const tsoajson = require(path.resolve(config.dir, `tsoa.json`));
        const swaggerPath = path.resolve(`${tsoajson.swagger.outputDirectory}/swagger.yaml`);
        const swagger = fs.readFileSync(swaggerPath, 'utf8');

        // host swagger.yaml
        this.express.get('/swagger', (req, res) => {
            res.end(swagger);
        });

        // host swagger-ui
        const swaggerHtmlPath = path.resolve(config.dir, `templates/swagger`);
        const swaggerPublicPath = path.resolve(swaggerHtmlPath, 'public');
        const swaggerIndexPath = path.resolve(swaggerHtmlPath, 'index.html');
        const swaggerIndexHtml = fs.readFileSync(swaggerIndexPath, 'utf8');
        const swaggerTemplate = _.template(swaggerIndexHtml);
        const swaggerCache = swaggerTemplate({
            title: `Radarsu - REST`,
        });

        this.express.use('/public', express.static(swaggerPublicPath));
        this.express.use('/api-docs', (req, res) => {
            res.end(swaggerCache);
        });

        this.http.listen(config.ws.port);
        this.log.info(`Http server (port ${config.ws.port}) - done.`);
    }

    public async initLogger(config: IRadarsuConfig) {
        this.log = winston.createLogger(config.winston);
        this.log.info(`Logger - done.`);
    }

    public async initWs(config: IRadarsuConfig) {
        this.wss = new WebSocket.Server({
            server: this.http,
        });
        this.wss.on('connection', (ws) => {
            const rs = new RadarsuSocket(ws);
            ws.on('open', () => {
                this.connections.push(rs);
            });

            ws.on('message', async (msg: string) => {
                const message: IRadarsuMessage = JSON.parse(msg);
                this.log.debug(`Received`, message);

                // action = `user.login`
                const actions = message.action.split('.');
                const controllerName = actions.shift();
                const controller = radarsuControllers[controllerName];

                if (!controller) {
                    throw new Error(`No controller ${controllerName}.`);
                }

                const controllerAction = actions.shift();
                const action: VoidFunction = controller[controllerAction];
                if (!action) {
                    throw new Error(`No action ${controllerAction} in controller ${controllerName}.`);
                }

                const result = await action.bind(controller)(rs, ...message.args);
                const response: IRadarsuResponse = {
                    uuid: message.uuid,
                };

                if (result) {
                    response.args = [result];
                }

                await rs.res(response);
            });

            ws.on('close', () => {
                const index = this.connections.indexOf(rs);
                if (index !== -1) {
                    this.connections.splice(this.connections.indexOf(rs), 1);
                }
            });
        });
        this.log.info(`WebSocket server (port ${config.ws.port}) - done.`);
    }

    public initLogo(config) {
        this.log.info(`######
                           #     #   ##   #####    ##   #####   ####  #    #
                           #     #  #  #  #    #  #  #  #    # #      #    #
                           ######  #    # #    # #    # #    #  ####  #    #
                           #   #   ###### #    # ###### #####       # #    #
                           #    #  #    # #    # #    # #   #  #    # #    #
                           #     # #    # #####  #    # #    #  ####   ####`);
        opn(`http://localhost:${config.ws.port}`);
    }
}

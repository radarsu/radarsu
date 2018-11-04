"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const import_1 = require("./import");
__export(require("./decorators"));
__export(require("./socket"));
class Radarsu {
    constructor() {
        this.connections = [];
    }
    launch(config = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.initLogger(config);
            yield this.initDb(config);
            yield this.initHttp2(config);
            yield this.initWs(config);
            yield this.initLogo(config);
        });
    }
    initDb(config) {
        return __awaiter(this, void 0, void 0, function* () {
            this.db = new import_1.Sequelize(config.sequelize.constructor);
            this.db.addModels(import_1.radarsuModels);
            yield this.db.sync(config.sequelize.sync);
            this.log.info(`Database - done.`);
        });
    }
    initHttp2(config) {
        return __awaiter(this, void 0, void 0, function* () {
            this.express = import_1.express();
            this.express.use('/', import_1.express.static('templates/startbootstrap-resume-gh-pages'));
            this.express.use('/ws', import_1.express.static('templates/ws'));
            this.express.use('/admin', import_1.express.static('templates/ngx-admin-master/dist'));
            if (config.http.cert && config.http.key) {
                this.http = import_1.https.createServer(config.http, this.express);
            }
            else {
                this.http = import_1.http.createServer(this.express);
            }
            const typeDefs = import_1.gql `
          type Query {
            hello: String
          }
        `;
            const resolvers = {
                Query: {
                    hello: () => 'Hello world!',
                },
            };
            this.apollo = new import_1.ApolloServer({ typeDefs, resolvers });
            this.apollo.applyMiddleware({ app: this.express });
            const schema = new import_1.GraphQLSchema({
                query: new import_1.GraphQLObjectType({
                    name: 'RootQueryType',
                    fields: {
                        hello: {
                            type: import_1.GraphQLString,
                            resolve() {
                                return 'world';
                            },
                        },
                    },
                }),
            });
            const subscriptionServer = import_1.SubscriptionServer.create({
                schema,
                execute: import_1.execute,
                subscribe: import_1.subscribe,
            }, {
                server: this.http,
                path: '/graphql',
            });
            const tsoajson = require(import_1.path.resolve(config.dir, `tsoa.json`));
            const swaggerPath = import_1.path.resolve(`${tsoajson.swagger.outputDirectory}/swagger.yaml`);
            const swagger = import_1.fs.readFileSync(swaggerPath, 'utf8');
            this.express.get('/swagger', (req, res) => {
                res.end(swagger);
            });
            const swaggerHtmlPath = import_1.path.resolve(config.dir, `templates/swagger`);
            const swaggerPublicPath = import_1.path.resolve(swaggerHtmlPath, 'public');
            const swaggerIndexPath = import_1.path.resolve(swaggerHtmlPath, 'index.html');
            const swaggerIndexHtml = import_1.fs.readFileSync(swaggerIndexPath, 'utf8');
            const swaggerTemplate = import_1._.template(swaggerIndexHtml);
            const swaggerCache = swaggerTemplate({
                title: `Radarsu - REST`,
            });
            this.express.use('/public', import_1.express.static(swaggerPublicPath));
            this.express.use('/api-docs', (req, res) => {
                res.end(swaggerCache);
            });
            this.http.listen(config.ws.port);
            this.log.info(`Http server (port ${config.ws.port}) - done.`);
        });
    }
    initLogger(config) {
        return __awaiter(this, void 0, void 0, function* () {
            this.log = import_1.winston.createLogger(config.winston);
            this.log.info(`Logger - done.`);
        });
    }
    initWs(config) {
        return __awaiter(this, void 0, void 0, function* () {
            this.wss = new import_1.WebSocket.Server({
                server: this.http,
            });
            this.wss.on('connection', (ws) => {
                const rs = new import_1.RadarsuSocket(ws);
                ws.on('open', () => {
                    this.connections.push(rs);
                });
                ws.on('message', (msg) => __awaiter(this, void 0, void 0, function* () {
                    const message = JSON.parse(msg);
                    this.log.debug(`Received`, message);
                    const actions = message.action.split('.');
                    const controllerName = actions.shift();
                    const controller = import_1.radarsuControllers[controllerName];
                    if (!controller) {
                        throw new Error(`No controller ${controllerName}.`);
                    }
                    const controllerAction = actions.shift();
                    const action = controller[controllerAction];
                    if (!action) {
                        throw new Error(`No action ${controllerAction} in controller ${controllerName}.`);
                    }
                    const result = yield action.bind(controller)(rs, ...message.args);
                    const response = {
                        uuid: message.uuid,
                    };
                    if (result) {
                        response.args = [result];
                    }
                    yield rs.res(response);
                }));
                ws.on('close', () => {
                    const index = this.connections.indexOf(rs);
                    if (index !== -1) {
                        this.connections.splice(this.connections.indexOf(rs), 1);
                    }
                });
            });
            this.log.info(`WebSocket server (port ${config.ws.port}) - done.`);
        });
    }
    initLogo(config) {
        this.log.info(`######
                           #     #   ##   #####    ##   #####   ####  #    #
                           #     #  #  #  #    #  #  #  #    # #      #    #
                           ######  #    # #    # #    # #    #  ####  #    #
                           #   #   ###### #    # ###### #####       # #    #
                           #    #  #    # #    # #    # #   #  #    # #    #
                           #     # #    # #####  #    # #    #  ####   ####`);
        import_1.opn(`http://localhost:${config.ws.port}`);
    }
}
exports.Radarsu = Radarsu;
//# sourceMappingURL=index.js.map
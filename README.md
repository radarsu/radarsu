<p align="center">
    <a href="https://github.com/radarsu/radarsu/" target="blank"><img src="https://github.com/radarsu/radarsu/blob/master/assets/logo.png" alt="radarsu logo" /></a><br/>
    <strong>Simplicity is the ultimate sophistication.</strong>
</p>

<p align="center">
<a href="http://nodejs.org" target="blank">Node.js</a> server-side TypeScript framework with one thing in mind - <strong>removing code is easier than writing it</strong>.<br/>
<strong>Auto-generated Swagger docs, REST, GraphQL, WebSockets and others</strong> - have it all, delete what you don't need.
</p>
<p align="center">
<strong>Inspired by:</strong> <a href="https://github.com/nestjs/nest/" target="_blank" alt="sails.js">sails.js</a>, <a href="https://github.com/feathersjs/feathers" target="_blank" alt="feathers">feathers</a>, <a href="https://github.com/nestjs/nest/" target="_blank">nestjs</a>.
</p>

## Description
Have you tried <strong>meteor</strong>, <strong>loopback</strong>, <strong>sails.js</strong>, <strong>nestjs</strong> and nothing suits your needs? Lack of WebSocket integration? No auto-generated swagger docs or CRUD? Overcomplicated structure with many concepts you do not really want to implement? <strong>Simple solution comes here.</strong>

## Installation
```sh
npm i radarsu-core
```

## Features
- Integrated <strong>REST</strong>, <strong>GraphQL</strong> and <strong>WebSocket API</strong>.
- <strong>Automatic validation</strong> of incoming requests.
- <strong>Pretty logging</strong> to console and files with a well-configured <a href="https://github.com/winstonjs/winston" target="_blank" alt="winston">Winston</a>.

<img src="https://github.com/radarsu/radarsu/blob/master/assets/logger.png" alt="radarsu logo" />

- <strong>Auto-generated swagger</strong> docs and <strong>GraphQL panel</strong>.
- <strong>Auto-generated CRUD client</strong> for all the models powered by <a href="https://github.com/angular/angular" taget="_blank" alt="angular 2 4 6">Angular</a> and <a href="https://github.com/primefaces/primeng" taget="_blank" alt="primefaces primeng">Primeng</a>.
- <strong>CLI</strong> for generating various components based on templates that you can easiely modify.
- <strong>RadarsuSocket</strong> Client and Server library allowing easy <a href="https://github.com/einaros/ws" target="_blank" alt="einaros websocket">WebSocket</a> communication between Client and Server:

```ts
// client side
const result = await ws.emit({
	action: `user/login`,
	args: [{
		login: `test`,
		password: `test`,
	}],
});
console.log(result); // 'NOT YET IMPLEMENTED';
```
```ts
// requests goes to the server through validation and other middleware
interface ILoginRequest {
	login: string;
	password: string;
}

@RadarsuController
@RadarsuMiddleware(exampleMiddleware, exampleGuard)
export class UserController {

	// body parameters are automatically validated based on ILoginRequest interface
    public login(@Body() body: ILoginRequest, rs: RadarsuSocket) {
	    return 'NOT YET IMPLEMENTED';
    }
}
```

- <strong>Simple approach</strong> leaves everything as simple as possible, no coding redundancy, simple file structure:
- src
  - <strong>1-helpers</strong> - utility functions you like, your own little libraries.
  - <strong>2-interfaces</strong> - types and interfaces.
  - <strong>3-config</strong> - configuration of application and various libraries.
  - <strong>4-entities</strong> - database models powered by <a href="https://github.com/RobinBuschmann/sequelize-typescript" target="_blank" alt="sequelize typescript">sequelize-typescript</a>.
  - <strong>5-services</strong> - additional logics and storing data in server memory.
  - <strong>6-middleware</strong> - filters, guards, interceptors, whatever you like as a middleware.
  - <strong>7-controllers</strong> - routing and application entry point for all the REST, GraphQL and WebSocket Requests.
  - <strong>import</strong> - barrel import of every library and object you may need.
  - <strong>index.ts</strong> - application entry point (bootstrap).
- <strong>data</strong> - place for logs and some server assets (like a favicon).
- <strong>templates</strong> - place for templates that you can modify accodring to your needs, used to auto-generate components. Powered by <a href="https://github.com/mde/ejs" target="_blank" alt="ejs template">ejs</a>.

# Drawbacks
<strong>Structure</strong> - <strong>type-based structure</strong> instead of module-based. It simplifies imports and prevents circular dependencies. All helpers come before config and entities, all services come after entities, middleware comes before controller etc. This also allows you to easiely understand the flow of application and makes ES6 import available from a single barrel.

<strong>Opinionated</strong> - in order to provide you with a well-configured setup of various libraries perfectly working together <strong><a href="https://github.com/radarsu/radarsu" target="_blank" alt="radarsu framework">radarsu framework</a></strong> does not yet have adapters for other popular libraries. If you wish to switch from <a href="https://github.com/winstonjs/winston" target="_blank" alt="winston">Winston</a> to <a href="https://github.com/trentm/node-bunyan" target="_blank" alt="bunyan">Bunyan</a> or from Sequelize to other database, you need to rewrite initLogger, initDb, (...), methods.
```ts
import {
    Radarsu, config, radarsuLogger,
} from './import';

const log = radarsuLogger(__filename);

(async () => {
    config.app = new Radarsu();
    config.app.initLogger((options) => {
        // you are on your own here to return other logger you like
        return {};
    });
    await config.app.launch(config);
})();
```

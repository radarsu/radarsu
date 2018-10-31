import {
    Radarsu, config, radarsuLogger,
} from './import';

const log = radarsuLogger(__filename);

(async () => {
    config.app = new Radarsu();
    await config.app.launch(config).catch((err) => {
        // actually it never does!
        log.error(`Something went wrong :(`, err);
    });
})();

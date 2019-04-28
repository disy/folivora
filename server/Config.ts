const fs = require('fs');

const CONFIG = (() => {
    const CONFIG_FILENAME = __dirname + '/../config.json';
    const CONFIG_FILE = fs.existsSync(CONFIG_FILENAME) ? require(CONFIG_FILENAME) : {};

    const DEFAULT_CONFIG = {
        webroot: '/',
        port: 3000,
        lecturer: {}
    };

    let config = Object.assign(DEFAULT_CONFIG, CONFIG_FILE);

    config.webroot = normalizeWebroot(config.webroot);

    return config;
})();

function normalizeWebroot(webroot) {
    if (typeof webroot !== 'string') {
        return '/';
    }

    if (!/\/$/.test(webroot)) {
        webroot = webroot + '/';
    }

    if (!/^\//.test(webroot)) {
        webroot = '/' + webroot;
    }

    return webroot;
}

export default class Config {
    public static get(key) {
        if (!(key in CONFIG)) {
            console.log(`WARNING! Config key "${key}" is missing.`);
        }

        return CONFIG[key];
    }
}

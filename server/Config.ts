const fs = require('fs');

const CONFIG = (() => {
    const CONFIG_FILENAME = '../config.json';
    const CONFIG_FILE = fs.existsSync(CONFIG_FILENAME) ? require(CONFIG_FILENAME) : {};

    const DEFAULT_CONFIG = {
        port: 3000,
        lecturer: {}
    };

    return Object.assign(DEFAULT_CONFIG, CONFIG_FILE);
})();

export default class Config {
    public static get(key) {
        if (!(key in CONFIG)) {
            console.log(`WARNING! Config key "${key}" is missing.`);
        }

        return CONFIG[key];
    }
}
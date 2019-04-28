const Db = require('tingodb')().Db;

export default class Database {
    private static instance;

    public static get() {
        if (!Database.instance) {
            Database.instance = new Db('./database', {});
        }

        return Database.instance;
    }
}

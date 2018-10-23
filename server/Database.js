const Db = require('tingodb')().Db;

class Database {
    static get() {
        return Database.instance;
    }
}
Database.instance = new Db('./database', {});

module.exports = Database;
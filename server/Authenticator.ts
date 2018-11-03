import * as ROLE from './ROLES';

const userDatabase = require(__dirname + '/../lecturer.json');

export default class Authenticator {
    public static isValid(role, user, token) {
        if (role === ROLE.STUDENT) {
            return true;
        } else if (role === ROLE.LECTURER && Authenticator.isTokenValid(user, token)) {
            return true;
        }
    }

    public static isTokenValid(user, token) {
        if (user && token && userDatabase[user] === token) {
            return true;
        }

        return false;
    }
}
import * as ROLE from './ROLES';
import Config from './Config'

export default class Authenticator {
    public static isValid(role, user, token) {
        if (role === ROLE.STUDENT) {
            return true;
        } else if (role === ROLE.LECTURER && Authenticator.isTokenValid(user, token)) {
            return true;
        }
    }

    public static isTokenValid(user, token) {
        if (user && token && Config.get('lecturer')[user] === token) {
            return true;
        }

        return false;
    }
}
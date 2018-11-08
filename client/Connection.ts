import * as io from 'socket.io-client'

export default class Connection {
    private static instance;

    public static get(): Connection {
        if (!Connection.instance) {
            Connection.instance = new Connection();
        }

        return Connection.instance;
    }

    private constructor() {

    }

    public connect(role, user, token): Promise<[SocketIOClient.Socket, string, string]> {
        const socket = io(`?role=${role}&user=${user || ''}&token=${token || ''}`);

        socket.on('connect_error', (err) => {
            console.warn('Connection error:', err);

            $('#systemMessage').show().text('Connection error. Trying to reconnect...');
        });

        socket.on('reconnect', () => {
            console.log('Successfully reconnected');

            $('#systemMessage').hide();
        });

        return new Promise((resolve, reject) => {
            socket.once('connect', () => resolve([socket, role, user]));

            socket.once('error', (err) => {
                socket.close();

                reject(err);
            });
        });
    }
}
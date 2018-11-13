import * as crypto from 'crypto';
import * as express from 'express';
import * as expressHandlebars from 'express-handlebars';
import { Server } from 'http';
import * as socketIO from 'socket.io';
const randomString = require("randomstring");
import Authenticator from './Authenticator';
import * as ROLE from './ROLES';
import Lecturer from './Lecturer';
import Student from './Student';
import Config from './Config';

class App {
    public express;
    public http;
    public websocket;

    private connectedUsers = 0;

    private secretKey = crypto.randomBytes(256);

    public getSecretKey() {
        return this.secretKey;
    }

    private studentCode = randomString.generate({
        length: 6,
        readable: true,
        charset: 'alphanumeric',
        capitalization: 'uppercase'
    });

    public getStudentCode() {
        return this.studentCode;
    }

    constructor() {
        this.express = express();
        this.http = new Server(this.express);
        this.websocket = socketIO(this.http);

        this.mountRoutes();
        this.mountViewEngine();

        this.mountWebsocketMiddleware();
        this.mountWebsocketListener();

        this.express.use(this.expressLectureProtectionMiddleware)
        this.express.use(express.static('public'));
    }

    public getNumberOfConnectedUsers() {
        return this.connectedUsers;
    }

    private mountRoutes() {
        this.express.get('/', function (req, res) {
            res.sendFile(__dirname + '/index.html');
        });
    }

    private mountViewEngine() {
        this.express.engine('.hbs', expressHandlebars({
            defaultLayout: 'main',
            extname: '.hbs',
        }));
        this.express.set('view engine', '.hbs');
    }

    private mountWebsocketMiddleware() {
        this.websocket.use((socket, next) => {
            let { role, token, user } = socket.handshake.query;
            let remoteAddress = socket.request.headers['x-forwarded-for'] || socket.request.connection.remoteAddress;

            user = typeof user === 'string' ? user.toLowerCase() : user;

            if (Authenticator.isValid(role, user, token)) {
                console.log(`New connection from ${remoteAddress} as role "${role}" with username "${user}".`);

                return next();
            }

            console.log(`Authentication error from ${remoteAddress} with "${user}" and "${token}".`);

            next(new Error('authentication error'));
        });
    }

    private mountWebsocketListener() {
        this.websocket.on('connection', (socket) => {
            let { role, user } = socket.handshake.query;

            this.connectedUsers++;

            this.emitStatistic();

            socket.on('disconnect', (reason) => {
                console.log(`${user} has left the building.`);

                this.connectedUsers--;

                this.emitStatistic();
            });

            if (role === ROLE.LECTURER) {
                new Lecturer(user, socket, this.websocket);
            } else {
                new Student(user, socket, this.websocket);
            }
        });
    }

    private emitStatistic() {
        this.websocket.to('lecturer').emit('statistic', {
            connectedUsers: this.connectedUsers,
        });
    }

    private expressLectureProtectionMiddleware = (req, res, next) => {
        if (!/^\/lectures\//.test(req.url)) {
            return next();
        }

        if (req.query.hash) {
            let webroot = Config.get('webroot').slice(0, -1);
            let hash = crypto.createHmac('sha256', this.getSecretKey()).update(webroot + req.path).digest('hex');

            if (hash === req.query.hash) {
                return next();
            }
        }

        res.status(403);
        res.end('You are not allowed');
    }
}

let app = new App();

console.log('Student code: ' + app.getStudentCode());

export default app;
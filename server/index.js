const express = require('express');
const expressHandlebars = require('express-handlebars');
const app = express();
const http = require('http').Server(app);
const socket = require('socket.io');
const LectureRepository = require('./LectureRepository');
const userDatabase = require('../lecturer.json');

const ROLE = require('./ROLES');
const Student = require('./Student');
const Lecturer = require('./Lecturer');

const io = socket(http);

let lectureRepository = LectureRepository.get();
lectureRepository.init();

if (lectureRepository.getNumberOfLectures() === 0) {
    console.log('I found no lecture in public/lectures/. Abort.');

    process.exit(1);
}

app.engine('.hbs', expressHandlebars({
    defaultLayout: 'main',
    extname: '.hbs',
}));
app.set('view engine', '.hbs');

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

function isTokenValid(user, token) {
    if (user && token && userDatabase[user] === token) {
        return true;
    }

    return false;
}

io.use((socket, next) => {
    let role = socket.handshake.query.role;
    let token = socket.handshake.query.token;
    let user = socket.handshake.query.user;
    let remoteAddress = socket.request.connection.remoteAddress;

    if (role === ROLE.STUDENT) {
        return next();
    } else if (role === ROLE.LECTURER && isTokenValid(user, token)) {
        return next();
    }

    console.log(`Authentication error from ${remoteAddress} with "${user}" and "${token}".`);

    next(new Error('authentication error'));
});

io.on('connection', function (socket) {
    let role = socket.handshake.query.role;
    let user = socket.handshake.query.user;
    let remoteAddress = socket.request.connection.remoteAddress;

    console.log(`New connection from ${remoteAddress} as role "${role}" with username "${user}".`);

    socket.on('disconnect', (reason) => {
        console.log(`${user} has left the building.`);
    });

    if (role === ROLE.LECTURER) {
        new Lecturer(user, socket, io);
    } else {
        new Student(user, socket, io);
    }
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});
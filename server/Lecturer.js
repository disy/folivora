const Student = require('./Student');

class Lecturer extends Student {
    constructor(id, socket, io) {
        super(id, socket, io);

        socket.join('lecturer');

        socket.on('move', (direction) => {
            this.lecture.move(direction);

            io.emit('page', this.lecture.getCurrentPage());
        });

        socket.on('poll', ({
            question,
            choices
        }) => {
            this.lecture.setPoll(question, choices);
        });
    }
}

module.exports = Lecturer;
const LectureRepository = require('./LectureRepository');

class Student {
    constructor(id, socket, io) {
        this.id = id;
        this.socket = socket;
        this.io = io;
        this.lecture = LectureRepository.get().getLecture();

        socket.on('ready', () => {
            socket.emit('page', this.lecture.getCurrentPage());
        });

        socket.on('vote', ({
            slideIndex,
            choice
        }) => {
            let success = this.lecture.vote(this.id, slideIndex, choice);

            if (success) {
                io.to('lecturer').emit('vote', {
                    slideIndex,
                    choice
                });
            }
        });
    }
}

module.exports = Student;
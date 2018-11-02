const LectureRepository = require('./LectureRepository');

class Student {
    constructor(id, socket, io) {
        this.id = id;
        this.socket = socket;
        this.io = io;
        this.lectureRepository = LectureRepository.get();

        socket.on('ready', () => {
            let lecture = this.lectureRepository.getActiveLecture();

            if (lecture) {
                socket.emit('page', lecture.getCurrentPage());
            }
        });

        socket.on('vote', ({
            slideIndex,
            choice
        }) => {
            let lecture = this.lectureRepository.getActiveLecture();

            if (!lecture) {
                return;
            }

            let success = lecture.vote(this.id, slideIndex, choice);

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
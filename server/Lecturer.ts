import Student from './Student';
import app from './App';

export default class Lecturer extends Student {
    constructor(id, socket, io) {
        super(id, socket, io);

        socket.join('lecturer');

        socket.on('get', (param, response) => {
            if (param === 'lectures') {
                response(this.lectureRepository.getLectureData());
            } else if (param === 'info') {
                response({
                    code: app.getStudentCode(),
                    connectedUsers: app.getNumberOfConnectedUsers()
                });
            }
        });

        socket.on('config', (config) => {
            if (config.activeLecture && this.lectureRepository.exists(config.activeLecture)) {
                console.log(`Set active lecture: ${config.activeLecture}`);

                this.lectureRepository.setActiveLecture(config.activeLecture);

                io.emit('page', this.lectureRepository.getLecture(config.activeLecture).getCurrentPage());
            }
        });

        socket.on('move', (direction) => {
            let lecture = this.lectureRepository.getActiveLecture();

            if (!lecture) {
                return;
            }

            lecture.move(direction);

            io.emit('page', lecture.getCurrentPage());
        });

        socket.on('poll', (data) => {
            let lecture = this.lectureRepository.getActiveLecture();

            if (!lecture) {
                return;
            }

            lecture.setPoll(data.index, data.question, data.choices);

            io.emit('page', lecture.getCurrentPage());
        });
    }
}
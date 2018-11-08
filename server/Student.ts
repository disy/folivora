import LectureRepository from './LectureRepository';

export default class Student {
    protected id;
    protected socket;
    protected io;
    protected lectureRepository;

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

        socket.on('comment', (data) => {
            if (!data || !data.index || !data.comment) {
                return;
            }

            if (data.comment.length > 500) {
                console.log(`Truncate ${data.comment.length} character comment.`);

                data.comment = data.comment.slice(0, 500);
            }

            console.log(`${this.id} comments on slide ${data.index}: ${data.comment}`);

            io.to('lecturer').emit('comment', {
                index: data.index,
                comment: data.comment,
                date: new Date(),
            });
        })
    }
}
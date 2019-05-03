import LectureRepository from './LectureRepository';
import SpamProtection from './SpamProtection';
import { Socket, Server } from 'socket.io';

export default class Student {
    protected lectureRepository: LectureRepository;
    protected remoteAddress: string;

    constructor(protected id: string, protected socket: Socket, protected io: Server) {
        this.lectureRepository = LectureRepository.get();
        this.remoteAddress = socket.request.headers['x-forwarded-for'] || socket.request.connection.remoteAddress;

        socket.on('ready', () => {
            let lecture = this.lectureRepository.getActiveLecture();

            if (lecture) {
                socket.emit('page', lecture.getCurrentPage());
            }
        });

        socket.on('vote', ({
            index,
            choice
        }) => {
            let lecture = this.lectureRepository.getActiveLecture();

            if (!lecture) {
                return;
            }

            let success = lecture.vote(this.id, index, choice);

            if (success) {
                io.to('lecturer').emit('vote', {
                    index,
                    choice
                });
            }
        });

        socket.on('comment', (data, response) => {
            if (!data || !data.index || !data.comment) {
                return;
            }

            if (data.comment.length > 500) {
                console.log(`Truncate ${data.comment.length} character comment.`);

                data.comment = data.comment.slice(0, 500);
            }

            if (!SpamProtection.get().isAllowed(this.remoteAddress, 'comment')) {
                console.log(`${this.id} sent too many comments and was therefore blocked.`);

                return response({
                    name: 'spam-protection',
                    message: 'You sent too many comments. If you have further questions, please wait a minute or raise your hand.',
                });
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

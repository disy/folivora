import Student from './Student'
import PollResultManager from './PollResultManager'
import EditPollModal from './EditPollModal';
import LectureModal from './LectureModal';
import ShowCommentModal from './ShowCommentModal';
import InfoModal from './InfoModal'
import { IPageData } from '../model/Page.interface';

const ARROW_LEFT = 37;
const ARROW_RIGHT = 39;
const PAGE_DOWN = 34;
const PAGE_UP = 33;
const POINT = 190;

interface IComment {
    index: number
    date: Date,
    comment: string
}

export default class Lecturer extends Student {
    private previousButton: JQuery;
    private nextButton: JQuery;
    private pollResultButton: JQuery;
    private editPollButton: JQuery;
    private comments: IComment[] = [];

    constructor(id, socket) {
        super(id, socket);

        socket.on('statistic', (data) => {
            console.log('statistic', data);

            InfoModal.updateStatistic(data);
        });

        socket.on('vote', ({
            index,
            choice
        }) => {
            let pollResult = PollResultManager.get(index);

            if (pollResult) {
                pollResult.addVote(choice);

                this.pollResultButton.attr('data-badge', pollResult.getNumberOfVotes());
            }
        });

        socket.on('page', (page: IPageData) => {
            this.editPollButton.off('click').click(() => {
                new EditPollModal(page.index, page.poll, (data) => {
                    socket.emit('poll', data);
                });
            });

            this.pollResultButton.off('click').attr('disabled', 'disabled').removeAttr('data-badge');

            if (page.previousUrl) {
                this.previousButton.removeAttr('disabled');
            } else {
                this.previousButton.attr('disabled', 'disabled');
            }

            if (page.nextUrl) {
                this.nextButton.removeAttr('disabled');
            } else {
                this.nextButton.attr('disabled', 'disabled');
            }

            if (page.poll) {
                PollResultManager.set(page.index, page.poll.choices, page.votes);

                this.pollResultButton.attr('data-badge', page.votedIds.length);
                this.pollResultButton.removeAttr('disabled');
                this.pollResultButton.click(() => {
                    PollResultManager.get(page.index).show();
                });
            }
        })

        socket.on('comment', ({ index, date, comment }) => {
            console.log(index, date, comment);

            this.comments.push({
                index,
                comment,
                date: new Date(date),
            });

            this.commentButton.attr('data-badge', this.comments.length);
        });

        $('body').keyup((ev) => {
            let keyCode = ev.keyCode;

            if (keyCode === ARROW_LEFT || keyCode === PAGE_UP) {
                this.move(-1);
            } else if (keyCode === ARROW_RIGHT || keyCode === PAGE_DOWN) {
                this.move(1);
            } else if (keyCode === POINT) {
                $('body').toggleClass('blank');
            }
        });
    }

    private move(direction: -1 | 1) {
        if (this.comments.length > 0) {
            new ShowCommentModal(this.comments);

            this.comments = [];
            this.commentButton.removeAttr('data-badge');

            return;
        }

        if ($('.modal.show').length > 0) {
            console.log('Do not move while modal is open.');

            return;
        }

        this.socket.emit('move', direction);
    }

    protected initUi() {
        super.initUi();
        let barElement = $('#navBar');

        this.previousButton = $('<button>');
        this.previousButton.text('Previous');
        this.previousButton.click(() => this.move(-1));
        this.previousButton.appendTo(barElement);

        this.nextButton = $('<button>');
        this.nextButton.text('Next');
        this.nextButton.click(() => this.move(1));
        this.nextButton.appendTo(barElement);

        this.editPollButton = $('<button>');
        this.editPollButton.text('Edit poll');
        this.editPollButton.appendTo(barElement);

        this.pollResultButton = $('<button>');
        this.pollResultButton.attr('disabled', 'disabled');
        this.pollResultButton.text('Poll result');
        this.pollResultButton.appendTo(barElement);

        let lectureSelectionButton = $('<button>');
        lectureSelectionButton.text('Lectures');
        lectureSelectionButton.click(() => {
            this.socket.emit('get', 'lectures', (data) => {
                console.log('lectures', data)
                new LectureModal(data, (id) => {
                    this.socket.emit('config', {
                        activeLecture: id,
                    });
                });
            });
        });
        lectureSelectionButton.appendTo(barElement);

        let layoutButton = $('<button>');
        layoutButton.text('Layout');
        layoutButton.click(() => {
            let currentLayout = parseInt($('body').attr('data-layout'), 10);
            let nextLayout = isNaN(currentLayout) ? 0 : (currentLayout + 1) % 3;

            $('body').attr('data-layout', nextLayout);
        });
        layoutButton.appendTo(barElement);

        let infoButton = $('<button>');
        infoButton.text('Info');
        infoButton.click(() => {
            this.get('info').then(data => {
                new InfoModal(data.code, data.connectedUsers);
            })
        });
        infoButton.appendTo(barElement);
    }

    private get(key: string): Promise<any> {
        return new Promise(resolve => {
            this.socket.emit('get', key, (data) => {
                resolve(data);
            });
        })
    }
}

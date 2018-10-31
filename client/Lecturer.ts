import Student from './Student'
import PollResultManager from './PollResultManager'
import EditPollModal from './EditPollModal';

const ARROW_LEFT = 37;
const ARROW_RIGHT = 39;
const PAGE_DOWN = 34;
const PAGE_UP = 33;

export default class Lecturer extends Student {
    private previousButton: JQuery;
    private nextButton: JQuery;
    private pollResultButton: JQuery;
    private editPollButton: JQuery;

    constructor(id, socket) {
        super(id, socket);

        socket.on('vote', ({
            slideIndex,
            choice
        }) => {
            let pollResult = PollResultManager.get(slideIndex);

            if (pollResult) {
                pollResult.addVote(choice);

                this.pollResultButton.attr('data-badge', pollResult.getNumberOfVotes());
            }
        });

        socket.on('page', (page) => {
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

        this.initUi();

        $('body').keyup((ev) => {
            let keyCode = ev.keyCode;

            if (keyCode === ARROW_LEFT || keyCode === PAGE_UP) {
                socket.emit('move', -1);
            } else if (keyCode === ARROW_RIGHT || keyCode === PAGE_DOWN) {
                socket.emit('move', 1);
            }
        });
    }

    private initUi() {
        let barElement = $('#navBar');

        this.previousButton = $('<button>');
        this.previousButton.text('Previous');
        this.previousButton.click(() => this.socket.emit('move', -1));
        this.previousButton.appendTo(barElement);

        this.nextButton = $('<button>');
        this.nextButton.text('Next');
        this.nextButton.click(() => this.socket.emit('move', 1));
        this.nextButton.appendTo(barElement);

        this.editPollButton = $('<button>');
        this.editPollButton.text('Edit poll');
        this.editPollButton.appendTo(barElement);

        this.pollResultButton = $('<button>');
        this.pollResultButton.attr('disabled', 'disabled');
        this.pollResultButton.text('Poll result');
        this.pollResultButton.appendTo(barElement);
    }
}
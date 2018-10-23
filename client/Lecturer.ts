import Student from './Student'
import PollResultManager from './PollResultManager'
import EditPollModal from './EditPollModal';

const ARROW_LEFT = 37;
const ARROW_RIGHT = 39;

export default class Lecturer extends Student {
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
            }
        });

        socket.on('page', (page) => {
            this.editPollButton.off('click').click(() => {
                new EditPollModal(page.index, page.poll, (data) => {
                    socket.emit('poll', data);
                });
            });

            this.pollResultButton.off('click').attr('disabled', 'disabled');

            if (page.votedIds.length === 0) {
                return;
            }

            this.pollResultButton.removeAttr('disabled');
            this.pollResultButton.click(() => {
                PollResultManager.get(page.index).show();
            });
        })

        this.initUi();

        $('body').keyup((ev) => {
            let keyCode = ev.keyCode;

            if (keyCode === ARROW_LEFT) {
                socket.emit('move', -1);
            } else if (keyCode === ARROW_RIGHT) {
                socket.emit('move', 1);
            }
        });
    }

    private initUi() {
        let barElement = $('#navBar');

        let previousElement = $('<button>');
        previousElement.text('Previous');
        previousElement.click(() => this.socket.emit('move', -1));
        previousElement.appendTo(barElement);

        let nextElement = $('<button>');
        nextElement.text('Next');
        nextElement.click(() => this.socket.emit('move', 1));
        nextElement.appendTo(barElement);

        this.editPollButton = $('<button>');
        this.editPollButton.text('Edit poll');
        this.editPollButton.appendTo(barElement);

        this.pollResultButton = $('<button>');
        this.pollResultButton.attr('disabled', 'disabled');
        this.pollResultButton.text('Poll result');
        this.pollResultButton.appendTo(barElement);
    }
}
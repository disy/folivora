import { Socket } from 'socket.io';
import Page from './Page';
import VoteModal from './VoteModal'
import CommentModal from './CommentModal'
import SystemMessage from './SystemMessage';

export default class Student {
    private systemMessageTimeout;
    protected commentButton: JQuery;

    constructor(protected id: string, protected socket: Socket) {
        this.id = id;
        this.socket = socket;

        this.initUi();

        this.systemMessageTimeout = setTimeout(() => {
            SystemMessage.show('Connected. Waiting...');
        }, 500);

        this.socket.on('page', (page) => page && this.onPage(page));

        this.socket.emit('ready');
    }

    public onPage(page) {
        console.log('onPage', page)

        if (this.systemMessageTimeout) {
            clearTimeout(this.systemMessageTimeout);
        }
        SystemMessage.hide();

        this.commentButton.off('click').on('click', () => {
            new CommentModal((comment) => {
                this.socket.emit('comment', {
                    comment,
                    index: page.index,
                }, (error) => {
                    if (!error) {
                        return;
                    }

                    alert(error.message || error);
                });
            })
        });

        new Page(page);

        let hasVoted = page.votedIds.indexOf(this.id) > -1;

        new VoteModal(hasVoted, page.poll, (choice) => {
            this.socket.emit('vote', {
                slideIndex: page.index,
                choice,
            });
        });
    }

    protected initUi() {
        let barElement = $('#navBar');

        this.commentButton = $('<button>');
        this.commentButton.text('Comment');
        this.commentButton.appendTo(barElement);
    }
}

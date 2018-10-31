import { Socket } from "socket.io";
import Page from "./Page";
import VoteModal from './VoteModal'

export default class Student {
    constructor(protected id: string, protected socket:Socket) {
        this.id = id;
        this.socket = socket;

        this.socket.on('page', (page) => page && this.onPage(page));

        this.socket.emit('ready');
    }

    onPage(page) { console.log('onPage', page)
        new Page(page);

        let hasVoted = page.votedIds.indexOf(this.id) > -1;

        new VoteModal(hasVoted, page.poll, (choice) => {
            this.socket.emit('vote', {
                slideIndex: page.index,
                choice: choice,
            });
        });
    }
}
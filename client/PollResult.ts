import {COLORS} from './CONST'

export default class PollResult {
    private element;
    private totalVotes: number = 0;

    constructor(private votes = {}) {
        this.element = $('#pollResultModal');

        for (let choice in this.votes) {
            this.totalVotes += this.votes[choice];
        }
    }

    show() {
        let body = this.element.find('.modal-body');
        body.empty();

        let choiceIndex = 0;
        for (let choice in this.votes) {
            let votes = this.votes[choice];
            let percentage = votes / this.totalVotes * 100;
            let choiceElement = $('<p>');
            choiceElement.addClass('poll-result__item');
            choiceElement.text(choice);
            choiceElement.attr('data-choice', choice);
            choiceElement.css('background-color', COLORS[choiceIndex % COLORS.length]);
            choiceElement.css('width', `${percentage}%`);
            choiceElement.attr('data-percentage', (Math.round(percentage * 10) / 10) + '%');
            choiceElement.appendTo(body);

            choiceIndex++;
        }

        this.element.modal('show');
    }

    addVote(choice) {
        let votes = this.votes[choice] || 0;

        this.votes[choice] = votes + 1;
        this.totalVotes++;

        for (let choice in this.votes) {
            let choiceElement = this.element.find(`[data-choice="${choice}"]`);
            let votes = this.votes[choice];
            let percentage = votes / this.totalVotes * 100;

            choiceElement.css('width', `${percentage}%`);
            choiceElement.attr('data-percentage', (Math.round(percentage * 10) / 10) + '%');
        }
    }

    getNumberOfVotes() {
        return this.totalVotes;
    }
}
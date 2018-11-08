import {COLORS} from './CONST'

export default class PollResult {
    private element;
    private totalVotes: number = 0;

    constructor(private choices = [], private votes = {}) {
        this.element = $('#pollResultModal');

        for (let choice in this.votes) {
            this.totalVotes += this.votes[choice] || 0;
        }
    }

    show() {
        let body = this.element.find('.modal-body');
        body.empty();

        let choiceIndex = 0;
        for (let choice of this.choices) {
            let votes = this.votes[choice] || 0;
            let percentage = this.totalVotes === 0 ? 0 : votes / this.totalVotes * 100;
            let choiceElement = $('<div>');
            choiceElement.addClass('poll-result__item');
            choiceElement.appendTo(body);

            let textElement = $('<p>');
            textElement.addClass('poll-result__text');
            textElement.text(choice);
            textElement.appendTo(choiceElement);

            let barElement = $('<div>');
            barElement.addClass('poll-result__bar');
            barElement.attr('data-choice', choice);
            barElement.css('background-color', COLORS[choiceIndex % COLORS.length]);
            barElement.css('width', `${percentage}%`);
            barElement.attr('data-percentage', (Math.round(percentage * 10) / 10) + '%');
            barElement.appendTo(choiceElement);

            choiceIndex++;
        }

        this.element.modal('show');
    }

    addVote(choice) {
        let votes = this.votes[choice] || 0;

        this.votes[choice] = votes + 1;
        this.totalVotes++;

        for (let choice in this.votes) {
            let barElement = this.element.find(`[data-choice="${choice}"]`);
            let votes = this.votes[choice];
            let percentage = votes / this.totalVotes * 100;

            barElement.css('width', `${percentage}%`);
            barElement.attr('data-percentage', (Math.round(percentage * 10) / 10) + '%');
        }
    }

    getNumberOfVotes() {
        return this.totalVotes;
    }
}
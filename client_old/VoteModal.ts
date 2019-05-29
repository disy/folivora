import Modal from "./Modal";

export default class VoteModal extends Modal {
    private voteBody: JQuery;
    private questionElement: JQuery;
    private listElement: JQuery;

    constructor(hasVoted, data, private voteFor) {
        super($('#voteModal'));
        this.hide();

        this.voteBody = this.element.find('.modal-body');
        this.voteBody.empty();

        this.questionElement = this.element.find('.modal-title');

        this.listElement = $('<ol type="A">');
        this.listElement.appendTo(this.voteBody);

        $('#pollNotice').text(data ? data.question : '');

        if (data && data.question && data.choices) {
            this.questionElement.text(data.question);

            data.choices.forEach((choice) => this.addChoice(choice));

            $('#pollNotice').off('click');
            if (hasVoted) {
                $('#pollNotice').addClass('voted');
            } else {
                $('#pollNotice').on('click', () => {
                    this.show();
                });
            }
            $('#pollNotice').show().addClass('show');
        } else {
            $('#pollNotice').hide().removeClass('show')
        }
    }

    addChoice(choice) {
        let self = this;
        let itemElement = $('<li>');
        let choiceElement = $('<button>');

        choiceElement.addClass('btn btn-success btn-vote');
        choiceElement.text(choice);
        choiceElement.appendTo(itemElement);
        itemElement.appendTo(this.listElement);

        choiceElement.click(function () {
            self.voteBody.find('button').prop('disabled', 'disabled');

            self.voteFor($(this).text());

            $('#pollNotice').addClass('voted');
            self.hide();
        });
    }
}
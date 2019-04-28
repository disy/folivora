import Modal from './Modal';

type SavePoll = (data: { index: number, question?: string, choices?: string[] }) => void;

export default class EditPollModal extends Modal {
    constructor(private pageIndex, data: { question: string, choices: string[] }, private savePoll: SavePoll) {
        super($('#pollModal'));

        $('#questionInput').val(data && data.question ? data.question : '');
        $('#choicesList').empty();
        $('#addOption').off('click').click(() => {
            let answerElement = $('<li><input class="form-control" type="text"/></li>');

            answerElement.appendTo('#choicesList');
        });
        $('#deletePoll').off('click').click(() => {
            if (confirm('Delete?')) {
                this.onDelete();
            }
        })

        if (data && data.question && data.choices) {
            data.choices.forEach((choice) => this.addChoice(choice));
        }

        let saveElement = this.element.find('.btn-primary');
        saveElement.off('click').click(() => this.onSave());

        this.show();
    }

    public addChoice(choice) {
        $('#choicesList').append(`<li><input class="form-control" value="${choice}" type="text"/></li>`);
    }

    public onDelete() {
        this.savePoll({
            index: this.pageIndex
        });

        this.hide();
    }

    public onSave() {
        let question = <string> $('#questionInput').val();
        let choices = $('#choicesList').find('input').map((index, element) => <string> $(element).val()).get().filter(c => !!c);

        if (!this.pageIndex || !question || choices.length === 0) {
            return;
        }

        this.savePoll({
            index: this.pageIndex,
            question,
            choices,
        });

        this.hide();
    }
}

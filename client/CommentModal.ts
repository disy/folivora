import Modal from './Modal';

export default class CommentModal extends Modal {
    constructor(sendComment) {
        super($('#commentModal'));
        this.hide();

        let bodyElement = this.element.find('.modal-body');
        bodyElement.empty();

        let commentElement = $('<input class="form-control" type="text" maxlength="500"/>');
        commentElement.appendTo(bodyElement);

        let footerElement = this.element.find('.modal-footer');
        footerElement.empty();

        let submitElement = $('<button type="button" class="btn btn-primary">');
        submitElement.text('Send comment');
        submitElement.click(() => {
            let comment = commentElement.val();

            if (comment) {
                sendComment(comment);

                this.hide();
            }
        });
        submitElement.appendTo(footerElement);

        this.show();
    }
}

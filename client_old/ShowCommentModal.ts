import Modal from "./Modal";

export default class CommentModal extends Modal {
    constructor(comments: {index:number, comment:string, date:Date}[]) {
        super($('#showCommentModal'));

        (<any>this.element).modal({
            backdrop: 'static'
        });

        this.hide();

        let listElement = this.element.find('.modal-body ul');
        listElement.empty();

        for (let comment of comments) {
            let itemElement = $('<li>');
            itemElement.text(comment.comment);
            itemElement.appendTo(listElement);
        }

        this.show();
    }
}
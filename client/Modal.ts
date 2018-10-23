export default class Modal {
    constructor(protected element: JQuery) {

    }

    show() {
        (<any> this.element).modal('show');
    }

    hide() {
        (<any> this.element).modal('hide');
    }
}
export default class Modal {
    constructor(protected element: JQuery) {

    }

    public show() {
        (<any> this.element).modal('show');
    }

    public hide() {
        (<any> this.element).modal('hide');
    }
}

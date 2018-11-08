import Modal from "./Modal";
import * as QRCode from 'qrcode'

export default class InfoModal extends Modal {
    constructor(code: string) {
        super($('#infoModal'));

        let bodyElement = this.element.find('.modal-body');
        bodyElement.empty();

        let url = window.location.origin + window.location.pathname;

        let urlElement = $('<p>');
        urlElement.text(url);
        urlElement.addClass('infoModal__url');
        urlElement.appendTo(bodyElement);

        let codeElement = $('<p>');
        codeElement.text(code);
        codeElement.addClass('infoModal__code');
        codeElement.appendTo(bodyElement);

        QRCode.toString(url + '#' + code).then(qrCodeImage => {
            bodyElement.prepend(qrCodeImage);
        });

        this.show();
    }
}
import Modal from './Modal';
import * as QRCode from 'qrcode'

export default class InfoModal extends Modal {
    constructor(code: string, connectedUsers: number) {
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

        let statisticElement = $('<p>');
        statisticElement.attr('id', 'statisticElement');
        statisticElement.addClass('infoModal__statistic');
        statisticElement.appendTo(bodyElement);
        InfoModal.updateStatistic({ connectedUsers });

        this.show();
    }

    public static updateStatistic(statistic) {
        let statisticElement = $('#statisticElement');

        statisticElement.text(`There are ${statistic.connectedUsers} connected users.`);
    }
}

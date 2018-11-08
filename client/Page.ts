export default class Page {
    private index: number;
    private url: string;

    constructor(data) {
        this.index = data.index;
        this.url = data.url;

        if (data.previousUrl) {
            $('#previous-slide').css('background-image', `url(${data.previousUrl})`);
        }

        if (data.nextUrl) {
            $('#next-slide').css('background-image', `url(${data.nextUrl})`);
        }

        $('body').attr('data-currentIndex', this.index);
        $('#current-slide').css('background-image', `url(${this.url})`);

        $('#progress').css('width', `${data.progress * 100}%`);
    }
}
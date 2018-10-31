export default class Page {
    private index: number;
    private url: string;

    constructor(data) {
        this.index = data.index;
        this.url = data.url;

        if (data.previousUrl) {
            $('#preloading').attr('src', data.nextUrl);
        }

        if (data.nextUrl) {
            $('#preloading2').attr('src', data.nextUrl);
        }

        $('body').attr('data-currentIndex', this.index);
        $('body').css('background-image', `url(${this.url})`);

        $('#progress').css('width', `${data.progress * 100}%`);
    }
}
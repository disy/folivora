export default class Page {
    private index: number;
    private url: string;

    constructor(data) {
        this.index = data.index;
        this.url = data.url;

        if (data.nextUrl) {
            $('#preloading').attr('src', data.nextUrl);
        }

        $('body').attr('data-currentIndex', this.index);
        $('body').css('background-image', `url(${this.url})`);
    }
}
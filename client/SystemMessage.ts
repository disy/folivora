
export enum Level {
    Warning = 'warning',
    Info = 'info'
};

export default class SystemMessage {
    private static element = $('#systemMessage');

    public static show(text: string, level: Level = Level.Info) {
        SystemMessage.element.attr('data-level', level).text(text).show();
    }

    public static hide() {
        SystemMessage.element.hide();
    }
}

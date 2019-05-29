import Modal from "./Modal";

export default class LectureModal extends Modal {
    constructor(data, private selectLecture: (id) => void) {
        super($('#lectureModal'));

        this.element.find('.modal-body ul').empty();

        for (let id in data) {
            let lecture = data[id];

            this.addLectureToList(lecture.id, lecture.name, lecture.length);
        }

        this.show();
    }

    addLectureToList(id, name, length) {
        let listElement = $('<li>');
        let linkElement = $('<a>');
        linkElement.attr('href', '#');
        linkElement.text(`${name} (${length})`);
        linkElement.click((ev) => {
            ev.preventDefault();

            this.selectLecture(id);

            this.hide();
        });
        linkElement.appendTo(listElement);
        listElement.appendTo(this.element.find('.modal-body ul'));
    }
}
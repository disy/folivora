const fs = require('fs');
const path = require('path');
const publicDir = __dirname + '/../public/';
const rootDir = publicDir + 'lectures/';
const slideFilenameRegex = /^([1-9]\d*)\.svg$/
const Lecture = require('./Lecture');

class LectureRepository {
    static get() {
        return LectureRepository.instance;
    }

    constructor() {
        this.lectures = {};
        this.lectureData = {};
        this.lectureIds = [];
    }

    init() {
        console.log('Read all lectures. Please wait...');

        this.lectureData = readAllLectures();
        this.lectureIds = Object.keys(this.lectureData);

        console.log(`I found ${this.lectureIds.length} lecture(s).`);
    }

    getLecture(id) {
        id = id || this.lectureIds[0];

        if (!this.lectureData[id]) {
            return;
        }

        if (!this.lectures[id]) {
            this.lectures[id] = new Lecture(this.lectureData[id]);
        }

        return this.lectures[id];
    }

    getNumberOfLectures() {
        return this.lectureIds.length;
    }
}
LectureRepository.instance = new LectureRepository();

function readAllLectures() {
    let items = fs.readdirSync(rootDir);
    let lectures = {};

    for (let item of items) {
        if (fs.statSync(rootDir + '/' + item).isDirectory()) {
            let lecture = readLecture(item);

            if (lecture) {
                lectures[item] = lecture;
            }
        }
    }

    return lectures;
}

function readLecture(id) {
    let dir = rootDir + '/' + id;
    let slides = fs.readdirSync(dir);
    let lecture = {
        path: path.relative(publicDir, dir),
        length: 0,
        min: 99999,
        max: 0,
        name: id.replace('-', ' '),
        id
    };

    for (let slide of slides) {
        let match = slide.match(slideFilenameRegex);

        if (!fs.statSync(dir + '/' + slide).isFile() || !match) {
            console.log(`Skip ${slide}.`);

            continue;
        }

        let slideIndex = parseInt(match[1]);

        if (lecture.min > slideIndex) {
            lecture.min = slideIndex;
        }

        if (lecture.max < slideIndex) {
            lecture.max = slideIndex
        }

        lecture.length++;
    }

    if (lecture.length === 0) {
        console.log(`INFO: Skip "${id}", because it doesn't contain any slides.`);

        return;
    }

    if ((lecture.max - lecture.min + 1) !== lecture.length) {
        console.log(`WARNING: In lecture "${id}" are probably one or more slides missing!`);
    }

    return lecture;
}

module.exports = LectureRepository;
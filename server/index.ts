import app from './App'
import LectureRepository from './LectureRepository';
import Config from './Config'

const PORT = process.argv[2] || Config.get('port');

let lectureRepository = LectureRepository.get();
lectureRepository.init();

if (lectureRepository.getNumberOfLectures() === 0) {
    console.log('I found no lecture in public/lectures/. Abort.');

    process.exit(1);
}

app.http.listen(PORT, function () {
    console.log(`listening on *:${PORT}`);
});
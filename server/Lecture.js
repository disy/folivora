const Database = require('./Database');

class Lecture {
    static get(id) {
        if (!Lecture.instances) {
            Lecture.instances = {};
        }

        if (!Lecture.instances[id]) {
            Lecture.instances[id] = new Lecture(id);
        }

        return Lecture.instances[id];
    }

    constructor(id) {
        this.id = id || 'undefined';

        this.collection = Database.get().collection('lectures');
        this.collection.findOne({
            id: {
                $eq: this.id
            }
        }, (err, data) => {
            if (err || !data) {
                console.log('Error:', err, data);
                return;
            }

            this.currentPageIndex = data.currentPageIndex || 1;
            this.polls = data.polls || [];
            this.votes = data.votes || [];
            this.votedIds = data.votedIds || [];
        }) || {};

        this.currentPageIndex = 1;
        this.polls = [];
        this.votes = [];
        this.votedIds = [];
    }

    getCurrentPage() {
        let currentPage = {
            index: this.currentPageIndex,
            url: `svg/page${this.currentPageIndex}.svg`,
            nextUrl: `svg/page${this.currentPageIndex + 1}.svg`,
            poll: this.polls[this.currentPageIndex],
            votes: this.votes[this.currentPageIndex],
            votedIds: this.votedIds[this.currentPageIndex] || [],
        };

        return currentPage;
    }

    move(direction) {
        this.currentPageIndex = Math.max(this.currentPageIndex + parseInt(direction), 1);

        this.save();
    }

    setPoll(question, choices) {
        this.polls[this.currentPageIndex] = {
            question,
            choices
        }

        this.save();
    }

    vote(userId, slideIndex, choice) {
        if (!this.votes[slideIndex]) {
            this.votes[slideIndex] = {};
        }

        let poll = this.polls[slideIndex];
        if (!poll || poll.choices.indexOf(choice) < 0) {
            return false;
        }

        if (!this.votes[slideIndex][choice]) {
            this.votes[slideIndex][choice] = 0;
        }

        if (!this.votedIds[slideIndex]) {
            this.votedIds[slideIndex] = [];
        }

        if (this.votedIds[slideIndex].indexOf(userId) < 0) {
            this.votedIds[slideIndex].push(userId);
            this.votes[slideIndex][choice]++;

            console.log(`"${userId}" voted on slide ${slideIndex} for "${choice}"`);

            this.save();

            return true;
        }

        return false;
    }

    save() {
        this.collection.update({
            id: this.id
        }, {
            $set: {
                id: this.id,
                currentPageIndex: this.currentPageIndex,
                polls: this.polls,
                votes: this.votes,
                votedIds: this.votedIds,
            }
        }, {
            upsert: true
        }, (err, result) => {
            if (err) {
                console.log('Error while saving lecture: ', err);
            }
        });
    }
}

module.exports = Lecture;
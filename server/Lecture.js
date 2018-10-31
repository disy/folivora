const Database = require('./Database');

class Lecture {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.path = data.path;
        this.min = data.min;
        this.max = data.max;

        this.currentPageIndex = this.min;
        this.polls = [];
        this.votes = [];
        this.votedIds = [];

        this.collection = Database.get().collection('lectures');
        this.collection.findOne({
            id: {
                $eq: this.id
            }
        }, (err, data) => {
            if (err || !data) {
                console.log(`Could not read any data for lecture "${this.id}":`, err, data);
                return;
            }

            this.currentPageIndex = data.currentPageIndex || this.min;
            this.polls = data.polls || [];
            this.votes = data.votes || [];
            this.votedIds = data.votedIds || [];
        }) || {};
    }

    getCurrentPage() {
        let previousIndex = this.currentPageIndex > this.min ? this.currentPageIndex - 1 : undefined;
        let nextIndex = this.currentPageIndex < this.max ? this.currentPageIndex + 1 : undefined;

        let currentPage = {
            index: this.currentPageIndex,
            previousUrl: this.getUrl(previousIndex),
            url: this.getUrl(this.currentPageIndex),
            nextUrl: this.getUrl(nextIndex),
            poll: this.polls[this.currentPageIndex],
            votes: this.votes[this.currentPageIndex],
            votedIds: this.votedIds[this.currentPageIndex] || [],
        };

        return currentPage;
    }

    getUrl(index) {
        return index ? `${this.path}/${index}.svg` : undefined;
    }

    move(direction) {
        this.currentPageIndex = Math.min(Math.max(this.currentPageIndex + parseInt(direction), this.min), this.max);

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
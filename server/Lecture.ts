import * as crypto from 'crypto';
import Database from './Database';
import app from './App'
import Config from './Config';
import { ILectureData } from '../model/Lecture.interface';
import { IPollData } from '../model/Poll.interface';
import { IPageData } from '../model/Page.interface';

export default class Lecture {
    private id: string;
    private name: string;
    private path: string;
    private min: number;
    private max: number;

    private currentPageIndex: number;
    private polls: { [index: number]: IPollData };
    private votes: { [index: number]: { [choice: string]: number } };
    private votedIds: { [index: number]: string[] };

    private collection;

    constructor(data: ILectureData) {
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
        });
    }

    public getCurrentPage(): IPageData {
        let previousIndex = this.currentPageIndex > this.min ? this.currentPageIndex - 1 : undefined;
        let nextIndex = this.currentPageIndex < this.max ? this.currentPageIndex + 1 : undefined;
        let progress = (this.currentPageIndex - this.min) / (this.max - this.min);

        let currentPage = {
            index: this.currentPageIndex,
            previousUrl: this.getUrl(previousIndex),
            url: this.getUrl(this.currentPageIndex),
            nextUrl: this.getUrl(nextIndex),
            poll: this.polls[this.currentPageIndex],
            votes: this.votes[this.currentPageIndex],
            votedIds: this.votedIds[this.currentPageIndex] || [],
            progress,
        };

        return currentPage;
    }

    public getUrl(index: number) {
        if (!index) {
            return;
        }

        let path = `${Config.get('webroot')}${this.path}/${index}.svg`;
        let hash = crypto.createHmac('sha256', app.getSecretKey()).update(path).digest('hex');

        return `${path}?hash=${hash}`;
    }

    public move(direction) {
        this.currentPageIndex = Math.min(Math.max(this.currentPageIndex + parseInt(direction, 10), this.min), this.max);

        this.save();
    }

    public setPoll(index: number, question: string, choices: string[]) {
        if (!index) {
            return;
        }

        if (question && choices) {
            this.polls[index] = {
                question,
                choices
            }
        } else {
            delete this.polls[index];
            delete this.votes[index];
            delete this.votedIds[index];
        }

        this.save();
    }

    public vote(userId: string, slideIndex: number, choice: string) {
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

    public save() {
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

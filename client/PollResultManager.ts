import PollResult from './PollResult'

export default class PollResultManager {
    private static instances = {};

    static get(pageIndex) {
        return PollResultManager.instances[pageIndex];
    }

    static set(pageIndex, votes) {
        PollResultManager.instances[pageIndex] = new PollResult(votes);

        return PollResultManager.instances[pageIndex];
    }
}
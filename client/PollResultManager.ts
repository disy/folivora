import PollResult from './PollResult'

export default class PollResultManager {
    private static instances = {};

    static get(pageIndex) {
        return PollResultManager.instances[pageIndex];
    }

    static set(pageIndex, choices, votes) {
        PollResultManager.instances[pageIndex] = new PollResult(choices, votes);

        return PollResultManager.instances[pageIndex];
    }
}
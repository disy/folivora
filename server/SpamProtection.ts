
const OBLIVION_TIME = 60 * 1000;

export default class SpamProtection {
    private static instance = new SpamProtection();

    public static get(): SpamProtection {
        return SpamProtection.instance;
    }

    private trials: { [ip: string]: { [operation: string]: number } } = {};

    private constructor() {

    }

    public isAllowed(ip: string, operation: string, max: number = 3) {
        if (!this.trials[ip]) {
            this.trials[ip] = {};
        }

        if (!this.trials[ip][operation]) {
            this.trials[ip][operation] = 0;
        }

        this.trials[ip][operation]++;

        this.startOblivionProcess(ip, operation);

        return this.trials[ip][operation] <= max;
    }

    private startOblivionProcess(ip: string, operation: string) {
        setTimeout(() => {
            this.trials[ip][operation]--;
        }, OBLIVION_TIME);
    }
}
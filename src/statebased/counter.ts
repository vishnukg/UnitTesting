export class Counter {
    private count: number;
    constructor(initial: number) {
        this.count = initial;
    }

    click() {
        this.count++;
    }

    getCount() {
        return this.count;
    }
}

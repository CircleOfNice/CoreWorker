import { Singleton } from "@circle/core-meta";

@Singleton
class Increment {
    constructor() {
        this.counter  = 0;
        this.interval = setInterval(::this.increase, 1);
    }

    increase() {
        this.counter = this.counter + 1;

        console.log(`Log No. ${this.counter}`);
        return this.counter > 39 ? clearInterval(this.interval) : null;
    }
}

Increment();

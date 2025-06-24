import { ILogger } from "./logger";

export class ConsoleLogger implements ILogger {
    Log(msg: string): void {
        console.log(msg);
    }
}

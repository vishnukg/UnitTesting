import { ILogger } from "./logger";

// A TypeScript method decorator factory.
// Accepts an ILogger so the concern remains injectable and testable.
export function Log(logger: ILogger, message: string) {
    return function (
        _target: object,
        _propertyKey: string,
        descriptor: PropertyDescriptor
    ): PropertyDescriptor {
        const original = descriptor.value;
        descriptor.value = function (...args: unknown[]) {
            logger.Log(message);
            return original.apply(this, args);
        };
        return descriptor;
    };
}

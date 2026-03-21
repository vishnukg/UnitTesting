// Pure function — no dependencies, no side effects, deterministic.
// Takes everything it needs as arguments and returns a value.
// Zero mocks needed to test it.
export function canAccommodate(
    reserved: number,
    quantity: number,
    capacity: number
): boolean {
    return reserved + quantity <= capacity;
}

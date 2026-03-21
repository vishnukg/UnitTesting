import { test, assert } from "vitest";
import { canAccommodate } from "./canAccommodate";

// Value based testing on a pure function — no stubs, no mocks, no setup.
// The function takes all its inputs as arguments, so there is nothing to fake.

test("canAccommodate returns true when reserved + quantity is under capacity", () => {
    const result = canAccommodate(3, 3, 10);
    assert.equal(result, true);
});

test("canAccommodate returns false when reserved + quantity exceeds capacity", () => {
    const result = canAccommodate(10, 3, 10);
    assert.equal(result, false);
});

test("canAccommodate returns true when reservation fills exactly to capacity", () => {
    const result = canAccommodate(7, 3, 10);
    assert.equal(result, true);
});

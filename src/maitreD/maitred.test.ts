import { test, assert } from "vitest";
import { MaitreD } from "./maitred";

test("Get Total Capacity returns total capacity", () => {
  const capacity = 10;
  const sut = new MaitreD(capacity);

  const result = sut.getTotalCapacity();

  assert.equal(result, capacity);
});

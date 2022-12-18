import { test, assert } from "vitest";
import { MaitreD } from "./maitred";

test("Get Capacity returns total capacity", () => {
  const capacity = 10;
  const maiterd = new MaitreD(capacity);

  const result = maiterd.getTotalCapacity();

  assert.equal(result, capacity);
});

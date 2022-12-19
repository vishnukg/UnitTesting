import { test, assert } from "vitest";
import { Counter } from "./counter";

test("Calling Click once will increment the counter value by 1", () => {
  const initialValue = 0;
  const sut = new Counter(initialValue);
  sut.click();

  const result = sut.getCount();

  assert.equal(result, 1);
});

test("Calling Click twice will increment the counter value by 2", () => {
  const initialValue = 0;
  const sut = new Counter(initialValue);
  sut.click();
  sut.click();

  const result = sut.getCount();

  assert.equal(result, 2);
});

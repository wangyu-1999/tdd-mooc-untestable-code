import { describe, test } from "vitest";
import { expect } from "chai";
import { daysUntilChristmas } from "../src/testable1.mjs";

describe("testable 1: days until Christmas", () => {
  test("the date before Christmas", () => {
    const date = new Date("2025", 11, 24);
    expect(daysUntilChristmas(date)).to.equal(1);
  });
});

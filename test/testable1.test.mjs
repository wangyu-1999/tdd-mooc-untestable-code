import { describe, test } from "vitest";
import { expect } from "chai";
import { daysUntilChristmas } from "../src/testable1.mjs";

describe("testable 1: days until Christmas", () => {
  test("the date before Christmas", () => {
    const date = new Date("2025", 11, 24);
    expect(daysUntilChristmas(date)).to.equal(1);
  });

  test("the date on Christmas", () => {
    const date = new Date("2025", 11, 25);
    expect(daysUntilChristmas(date)).to.equal(0);
  });

  test("the date after Christmas", () => {
    const date = new Date("2025", 11, 26);
    expect(daysUntilChristmas(date)).to.equal(364);
  });

  test("the date is the first day of the year", () => {
    const date = new Date("2025", 0, 1);
    expect(daysUntilChristmas(date)).to.equal(358);
  });
});

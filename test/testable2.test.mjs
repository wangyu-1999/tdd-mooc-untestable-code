import { describe, test } from "vitest";
import { expect } from "chai";
import { diceRoll, diceHandValue } from "../src/testable2.mjs";

describe("testable 2: a dice game", () => {
  describe("diceRoll", () => {
    test("return 1 when randomGenerator returns 0", () => {
      const randomGenerator = () => 0;
      const result = diceRoll(randomGenerator);
      expect(result).to.equal(1);
    });

    test("return 6 when randomGenerator returns 0.99", () => {
      const randomGenerator = () => 0.99;
      const result = diceRoll(randomGenerator);
      expect(result).to.equal(6);
    });
  });
});

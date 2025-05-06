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

    test("return 4 when randomGenerator returns 0.5", () => {
      const randomGenerator = () => 0.5;
      const result = diceRoll(randomGenerator);
      expect(result).to.equal(4);
    });

    test("should return a number between 1 and 6", () => {
      for (let i = 0; i < 100; i++) {
        const result = diceRoll();
        expect(result).to.be.within(1, 6);
      }
    });
  });

  describe("diceHandValue", () => {
    test("should return 101 when both dice are 1", () => {
      const randomGenerator = () => 0;
      const result = diceHandValue(randomGenerator);
      expect(result).to.equal(101);
    });

    test("should return 106 when both dice are 6", () => {
      const randomGenerator = () => 0.99;
      const result = diceHandValue(randomGenerator);
      expect(result).to.equal(106);
    });
  });
});

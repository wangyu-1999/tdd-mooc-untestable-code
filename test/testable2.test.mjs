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
  });
});

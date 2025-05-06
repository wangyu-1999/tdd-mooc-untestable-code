import { describe, test } from "vitest";
import { expect } from "chai";
import { parsePeopleCsv, parseCsv, readCsv } from "../src/testable3.mjs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe("Testable 3: CSV file parsing", () => {
  describe("parseCsvContent", () => {
    test("should parse CSV content with multiple people", () => {
      const csvContent = `Loid,Forger,,Male
Anya,Forger,6,Female
Yor,Forger,27,Female`;

      const result = parseCsv(csvContent);

      expect(result).to.deep.equal([
        { firstName: "Loid", lastName: "Forger", gender: "m" },
        { firstName: "Anya", lastName: "Forger", gender: "f", age: 6 },
        { firstName: "Yor", lastName: "Forger", gender: "f", age: 27 },
      ]);
    });

    test("should handle empty age field", () => {
      const csvContent = `John,Doe,,Male`;

      const result = parseCsv(csvContent);

      expect(result).to.deep.equal([{ firstName: "John", lastName: "Doe", gender: "m" }]);
      expect(result[0]).to.not.have.property("age");
    });

    test("should convert gender to lowercase first letter", () => {
      const csvContent = `Jane,Doe,30,Female
John,Doe,32,Male`;

      const result = parseCsv(csvContent);

      expect(result[0].gender).to.equal("f");
      expect(result[1].gender).to.equal("m");
    });

    test("should handle empty lines", () => {
      const csvContent = `Anya,Forger,6,Female
      
Yor,Forger,27,Female`;

      const result = parseCsv(csvContent);

      expect(result).to.have.lengthOf(2);
    });
  });

  describe("readCsvFile", () => {
    test("should read file content", async () => {
      const testFilePath = join(__dirname, "test-people.csv");
      const testContent = `Test,Person,25,Male`;

      try {
        await fs.writeFile(testFilePath, testContent);

        const result = await readCsv(testFilePath);

        expect(result).to.equal(testContent);
      } finally {
        await fs.unlink(testFilePath);
      }
    });
  });

  describe("parsePeopleCsv", () => {
    test("parses CSV file", async () => {
      const testFilePath = join(__dirname, "test-people.csv");
      const testContent = `Loid,Forger,,Male
Anya,Forger,6,Female
Yor,Forger,27,Female`;
      try {
        fs.writeFile(testFilePath, testContent);
        const result = await parsePeopleCsv(testFilePath);
        expect(result).to.deep.equal([
          { firstName: "Loid", lastName: "Forger", gender: "m" },
          { firstName: "Anya", lastName: "Forger", gender: "f", age: 6 },
          { firstName: "Yor", lastName: "Forger", gender: "f", age: 27 },
        ]);
      } finally {
        await fs.unlink(testFilePath);
      }
    });
  });
});

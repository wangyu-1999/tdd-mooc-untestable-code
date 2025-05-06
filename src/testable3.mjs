// Direct dependency on the file system
// No way to provide different CSV content scenarios without creating actual files
// Tests become dependent on the environment and specific file paths

import { readFile } from "node:fs/promises";
import { parse } from "csv-parse/sync";

export async function readCsv(filePath) {
  return await readFile(filePath, { encoding: "utf8" });
}

export function parseCsv(csvData) {
  const records = parse(csvData, {
    skip_empty_lines: true,
    trim: true,
  });
  return records.map(([firstName, lastName, age, gender]) => {
    const person = {
      firstName,
      lastName,
      gender: gender.charAt(0).toLowerCase(),
    };
    if (age !== "") {
      person.age = parseInt(age);
    }
    return person;
  });
}
export async function parsePeopleCsv(filePath) {
  const csvData = await readFile(filePath, { encoding: "utf8" });
  return parseCsv(csvData);
}

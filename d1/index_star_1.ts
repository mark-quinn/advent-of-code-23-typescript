import { readFileSync } from "fs";

const test_data = readFileSync("./d1/test_file.txt", "utf-8");

const valid_lines = test_data.split("\n").filter((line) => line);

const line_numbers = valid_lines
  .map((line) => line.split("").filter((char) => Number(char)))
  .filter((line) => line.length > 0);

const calibration_values = line_numbers.map((line) =>
  Number(line[0] + line[line.length - 1])
);

const sum = calibration_values.reduce((prev, cur) => prev + cur, 0);

console.log("Result", sum);

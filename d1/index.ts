import { readFileSync } from "fs";

const test_numbers_in_str_regex =
  /(?=([0-9]|(one)|(two)|(three)|(four)|(five)|(six)|(seven)|(eight)|(nine)))/gi;

const numberWordToDigitStringMap: Record<string, string> = {
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
};

const test_data = readFileSync("./d1/test_file.txt", "utf-8");

const valid_lines = test_data.split("\n").filter((line) => line);

const mapped_numbers = valid_lines
  .map((line) => {
    const matchedLines = Array.from(
      line.matchAll(test_numbers_in_str_regex),
      (match) => match[1]
    );

    if (matchedLines.length > 0) {
      return matchedLines.map((match) => {
        const found_number_match = numberWordToDigitStringMap[match];

        return found_number_match ? found_number_match : match;
      });
    }
  })
  .filter((line) => line) as string[][];

const calibration_values = mapped_numbers.map((line) =>
  Number(line[0] + line[line.length - 1])
);

const sum = calibration_values.reduce((prev, cur) => prev + cur, 0);

console.log("Result", sum);

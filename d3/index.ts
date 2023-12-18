import { readFileSync } from "fs";

type NumberRange = {
  startIndex: number;
  endIndex: number;
  number: number;
};

type MapRangeOfIndexesParams = NumberRange;

type SymbolNumberMatches = Record<number, number[]>;

const mapRangeOfIndexes = ({
  startIndex,
  endIndex,
}: MapRangeOfIndexesParams) => {
  const size = endIndex - startIndex + 3;

  return [...Array(size).keys()].map((i) => i + startIndex - 1);
};

const digit_regex = /\d*[0-9]/g;
const symbols_regex = /[*]/g;

const test_data = readFileSync("./d3/test_file.txt", "utf-8");

const lines = test_data.split("\n").filter((line) => line);
let sum = 0;

lines.forEach((line, lineIndex) => {
  const line_symbol_matches = Array.from(line.matchAll(symbols_regex));
  const line_number_matches = Array.from(line.matchAll(digit_regex));

  if (!line_symbol_matches) return;

  const symbol_number_matches: SymbolNumberMatches = {};

  Array.from(line_symbol_matches.values()).forEach((match) => {
    line_number_matches.forEach(({ index, "0": number }) => {
      if (!match || !match.index) return;

      const number_range_including_adjacents = mapRangeOfIndexes({
        startIndex: index,
        endIndex: index || index === 0 ? index + number.length - 1 : 0,
        number: Number(number),
      } as NumberRange);

      const symbol_is_adjacent = number_range_including_adjacents.includes(
        match.index
      );

      if (symbol_is_adjacent) {
        symbol_number_matches[match.index] = symbol_number_matches[match.index]
          ? [...symbol_number_matches[match.index], Number(number)]
          : [Number(number)];
      }
    });

    const line_before_number_matches = lines[lineIndex - 1]
      ? Array.from(lines[lineIndex - 1].matchAll(digit_regex))
      : [];

    if (line_before_number_matches.length > 0) {
      line_before_number_matches.forEach(({ index, "0": number }) => {
        if (!match || !match.index) return;

        const number_range_including_adjacents = mapRangeOfIndexes({
          startIndex: index,
          endIndex: index || index === 0 ? index + number.length - 1 : 0,
          number: Number(number),
        } as NumberRange);

        const symbol_is_adjacent = number_range_including_adjacents.includes(
          match.index
        );

        if (symbol_is_adjacent) {
          symbol_number_matches[match.index] = symbol_number_matches[
            match.index
          ]
            ? [...symbol_number_matches[match.index], Number(number)]
            : [Number(number)];
        }
      });
    }

    const line_after_number_matches = lines[lineIndex + 1]
      ? Array.from(lines[lineIndex + 1].matchAll(digit_regex))
      : [];

    if (line_after_number_matches.length > 0) {
      line_after_number_matches.forEach(({ index, "0": number }) => {
        if (!match || !match.index) return;

        const number_range_including_adjacents = mapRangeOfIndexes({
          startIndex: index,
          endIndex: index || index === 0 ? index + number.length - 1 : 0,
          number: Number(number),
        } as NumberRange);

        const symbol_is_adjacent = number_range_including_adjacents.includes(
          match.index
        );

        if (symbol_is_adjacent) {
          symbol_number_matches[match.index] = symbol_number_matches[
            match.index
          ]
            ? [...symbol_number_matches[match.index], Number(number)]
            : [Number(number)];
        }
      });
    }
  });

  Object.values(symbol_number_matches).forEach((number_matches) => {
    if (number_matches.length === 2) {
      const [numOne, numTwo] = number_matches;

      sum += numOne * numTwo;
    }
  });
});

console.log(`Sum: ${sum}`);

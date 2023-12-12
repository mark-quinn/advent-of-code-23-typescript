import { readFileSync } from "fs";

type NumberRange = {
  startIndex: number;
  endIndex: number;
  number: number;
};

type SymbolNumberLineMap = {
  symbol_indexes?: number[];
  number_ranges?: NumberRange[];
};

const digit_regex = /\d*[0-9]/g;
const symbols_regex = /[-!$%^#&*()@_+|~=`{}\[\]:";'<>?,\/]/gi;

const test_data = readFileSync("./d3/test_file.txt", "utf-8");

const lines = test_data.split("\n").filter((line) => line);

const symbol_number_line_map = new Map<number, SymbolNumberLineMap>();

let sum = 0;

type MapRangeOfIndexesParams = NumberRange & {
  includeDirectAdjacents?: boolean;
};

const mapRangeOfIndexes = ({
  startIndex,
  endIndex,
  includeDirectAdjacents,
}: MapRangeOfIndexesParams) => {
  let size = endIndex - startIndex + 1;

  if (includeDirectAdjacents) {
    size += 2;
  }

  return [...Array(size).keys()].map((i) => i + startIndex - 1);
};

type FindArrayIntersectionParams = {
  arr_one: number[];
  arr_two: number[];
};

const findArrayIntersection = ({
  arr_one,
  arr_two,
}: FindArrayIntersectionParams) =>
  arr_one.filter((num) => arr_two.includes(num));

lines.map((line, index) => {
  const found_symbols = Array.from(line.matchAll(symbols_regex));
  const found_numbers = Array.from(line.matchAll(digit_regex));

  let symbol_indexes: number[] | undefined = undefined;
  let mapped_number_ranges: NumberRange[] | undefined = undefined;

  if (found_symbols.length > 0) {
    symbol_indexes = found_symbols.map(({ index }) => index) as number[];
  }

  if (found_numbers.length > 0) {
    mapped_number_ranges = found_numbers.map(({ index, "0": number }) => {
      return {
        startIndex: index,
        endIndex: index || index === 0 ? index + number.length - 1 : 0,
        number: Number(number),
      };
    }) as NumberRange[];
  }

  symbol_number_line_map.set(index, {
    symbol_indexes,
    number_ranges: mapped_number_ranges,
  });
});

Array.from(symbol_number_line_map.entries()).forEach(([lineIndex, lineMap]) => {
  const current_line_numbers = lineMap.number_ranges;
  const current_line_symbols = lineMap.symbol_indexes;

  if (!current_line_numbers) return;

  const line_before = symbol_number_line_map.get(lineIndex - 1);
  const line_after = symbol_number_line_map.get(lineIndex + 1);

  current_line_numbers.flatMap(({ startIndex, endIndex, number }) => {
    const ranges = mapRangeOfIndexes({
      startIndex,
      endIndex,
      number,
      includeDirectAdjacents: true,
    });

    if (current_line_symbols) {
      const number_has_adjacent_symbol = findArrayIntersection({
        arr_one: current_line_symbols,
        arr_two: ranges,
      });

      if (number_has_adjacent_symbol.length > 0) {
        console.debug(
          `Adding: ${number} to sum. Same line`,
          current_line_symbols
        );

        sum += number;
        return;
      }
    }

    if (line_before?.symbol_indexes) {
      const number_has_adjacent_symbol = findArrayIntersection({
        arr_one: line_before.symbol_indexes,
        arr_two: ranges,
      });

      if (number_has_adjacent_symbol.length > 0) {
        console.debug(
          `Adding: ${number} to sum. Line before`,
          line_before.symbol_indexes
        );

        sum += number;
        return;
      }
    }

    if (line_after?.symbol_indexes) {
      const number_has_adjacent_symbol = findArrayIntersection({
        arr_one: line_after.symbol_indexes,
        arr_two: ranges,
      });

      if (number_has_adjacent_symbol.length > 0) {
        console.debug(
          `Adding: ${number} to sum. Line after`,
          line_after.symbol_indexes
        );

        sum += number;
        return;
      }
    }
  });
});

console.log(sum);

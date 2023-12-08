import { readFileSync } from "fs";

type Colour = "blue" | "red" | "green";

type ColourMinimumRequiredCubes = Record<Colour, number>;

const test_regex = /([0-9]|[0-9][0-9]) (red|blue|green)/gi;

const test_data = readFileSync("./d2/test_file.txt", "utf-8");

const games = test_data.split("\n").filter((line) => line);

const game_sets = games.map((game) => game.split(": "));

// The power of a set of cubes is equal to the numbers of red, green, and blue cubes multiplied together
let sum_of_powers: number = 0;

game_sets.forEach((game) => {
  if (game.length !== 2) return;

  const set_colours = game[1].match(test_regex);
  if (!set_colours) return;

  const colour_minimum_required_cubes: ColourMinimumRequiredCubes = {
    blue: 0,
    green: 0,
    red: 0,
  };

  for (const [index, colour] of set_colours.entries()) {
    const [quantity, col] = colour.split(" ");

    const current_colour = col as Colour;
    const number_of_cubes = Number(quantity);

    if (colour_minimum_required_cubes[current_colour] < number_of_cubes) {
      colour_minimum_required_cubes[current_colour] = number_of_cubes;
    }

    const current_colour_val = colour_minimum_required_cubes[current_colour];
    const isLastColour = index === set_colours.length - 1;

    if (isLastColour && current_colour_val !== 0) {
      const sum = Object.values(colour_minimum_required_cubes).reduce(
        (prev, cur) => {
          if (prev === 0) return cur;

          if (cur === 0) return prev;

          return prev * cur;
        },
        0
      );

      console.log(`${game[0]}: ${sum}`);

      sum_of_powers += sum;
    }
  }
});

console.log(`Sum of the powers of the games: ${sum_of_powers}`);

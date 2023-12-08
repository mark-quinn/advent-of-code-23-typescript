import { readFileSync } from "fs";

type Colour = "blue" | "red" | "green";

const colour_to_num_of_cubes_map: Record<Colour, number> = {
  red: 12,
  green: 13,
  blue: 14,
};

const test_regex = /([0-9]|[0-9][0-9]) (red|blue|green)/gi;

const test_data = readFileSync("./d2/test_file.txt", "utf-8");

const games = test_data.split("\n").filter((line) => line);

const game_sets = games.map((game) => game.split(": "));
let sum_of_valid_game_ids: number = 0;

game_sets.forEach((game) => {
  if (game.length !== 2) return;

  const set_colours = game[1].match(test_regex);
  if (!set_colours) return;

  for (const [index, colour] of set_colours.entries()) {
    const [quantity, col] = colour.split(" ");

    const total_num_of_cubes = colour_to_num_of_cubes_map[col as Colour];

    if (Number(quantity) > total_num_of_cubes) {
      console.error(
        `Too many ${col} cubes! Actual: ${quantity}, Total: ${total_num_of_cubes}`
      );
      break;
    }

    const isLastColour = index === set_colours.length - 1;

    if (isLastColour) {
      const gameId = Number(game[0].replace("Game ", ""));

      sum_of_valid_game_ids += gameId;
    }
  }
});

console.log(`Sum of valid game IDs: ${sum_of_valid_game_ids}`);

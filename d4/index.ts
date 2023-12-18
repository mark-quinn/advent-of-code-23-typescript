import { readFileSync } from "fs";

type ScratchCard = {
  index: number;
  winningNumbers: number[];
  cardNumbers: number[];
  totalMatches: number;
  score: number;
};

const digit_regex = /\d*[0-9]/g;

export const day4 = () => {
  const test_data = readFileSync("./d4/test_file.txt", "utf-8");
  const lines = test_data.split("\n").filter((line) => line);

  const scratchCards = mapTestLinesToScratchCards(lines);

  const total = scratchCards.reduce((prev, cur) => prev + cur.score, 0);

  console.log(`Total points: ${total}`);
};

export const mapTestLinesToScratchCards = (lines: string[]): ScratchCard[] => {
  return lines
    .map((line) => {
      const parts = line.split(": ");

      const cardIndex = Number(parts[0].split(" ")[1]);

      const [winningNumbers, cardNumbers] = parts[1]
        .split(" | ")
        .map((numbers) =>
          numbers.match(digit_regex)?.map((num) => Number(num))
        );

      if (!winningNumbers || !cardNumbers) {
        return;
      }

      const totalMatches = calculateTotalMatches({
        cardNumbers,
        winningNumbers,
      });

      const score = calculateScore({ totalMatches });

      const scratchCard: ScratchCard = {
        index: cardIndex,
        cardNumbers,
        winningNumbers,
        totalMatches,
        score,
      };

      return scratchCard;
    })
    .filter((line) => line) as ScratchCard[];
};

const calculateTotalMatches = ({
  cardNumbers,
  winningNumbers,
}: Pick<ScratchCard, "cardNumbers" | "winningNumbers">) => {
  return winningNumbers.filter((num) => cardNumbers.includes(num)).length;
};

const calculateScore = ({
  totalMatches,
}: Pick<ScratchCard, "totalMatches">) => {
  if (totalMatches < 1) return 0;

  return 2 ** (totalMatches - 1);
};

day4();

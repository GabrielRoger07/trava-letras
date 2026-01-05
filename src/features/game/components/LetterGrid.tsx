import "./LetterGrid.css";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

type Props = {
  usedLetters: string[];
  onPick: (letter: string) => void;
};

export function LetterGrid({ usedLetters, onPick }: Props) {
  const usedSet = new Set(usedLetters);

  return (
    <div className="letterGrid">
      {ALPHABET.map((letter) => {
        const isUsed = usedSet.has(letter);

        return (
          <button
            key={letter}
            type="button"
            className={`letterGrid__btn ${isUsed ? "is-used" : ""}`}
            disabled={isUsed}
            onClick={() => onPick(letter)}
          >
            {letter}
          </button>
        );
      })}
    </div>
  );
}
import "./LetterGrid.css";

type Props = {
  letters: string[];
  usedLetters: string[];
  onPick: (letter: string) => void;
};

export function LetterGrid({ letters, usedLetters, onPick }: Props) {
  const usedSet = new Set(usedLetters);

  return (
    <div className="letterGrid">
      {letters.map((letter) => {
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
import "./TurnTimer.css"

type Props = {
  playerName: string;
  remaining: number;
  instruction?: string;
};

export function TurnTimer({ playerName, remaining, instruction }: Props) {
  return (
    <div className="turnTimer">
      <div className="turnTimer__label">Vez de</div>
        <div className="turnTimer__name">
          <span className="turnTimer__nameText">{playerName}</span>
      </div>

      <div className="turnTimer__time" aria-live="polite">
        {String(remaining).padStart(2, "0")}
      </div>

      {instruction ? <div className="turnTimer__hint">{instruction}</div> : null}
    </div>
  );
}
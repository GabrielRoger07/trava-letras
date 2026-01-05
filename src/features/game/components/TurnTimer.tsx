import "./TurnTimer.css"

type Props = {
  playerName: string;
  remaining: number;
  instruction?: string;
};

export function TurnTimer({ playerName, remaining, instruction }: Props) {
  const isDanger = remaining <= 3;

  return (
    <div className="turnTimer">
      <div className="turnTimer__label">Vez de</div>
        <div className="turnTimer__name">
          <span className="turnTimer__nameText">{playerName}</span>
      </div>

      <div className={`turnTimer__time ${isDanger ? "turnTimer__time--danger" : ""}`} aria-live="polite">
        {String(remaining).padStart(2, "0")}
      </div>

      {instruction ? <div className="turnTimer__hint">{instruction}</div> : null}
    </div>
  );
}
type Props = {
  playerName: string;
  remaining: number;
  instruction?: string;
};

export function TurnTimer({ playerName, remaining, instruction }: Props) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ opacity: 0.7 }}>Vez de</div>
      <div style={{ fontSize: 36, fontWeight: 800, marginTop: 6 }}>{playerName}</div>
      <div style={{ fontSize: 72, fontWeight: 900, marginTop: 12 }}>{String(remaining).padStart(2, "0")}</div>
      {instruction ? <div style={{ opacity: 0.7, marginTop: 10 }}>{instruction}</div> : null}
    </div>
  );
}
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import { useGame } from "../../../state/useGame";
import { LetterGrid } from "../components/LetterGrid";
import { TurnTimer } from "../components/TurnTimer";
import { useTurnTimer } from "../hooks/useTurnTimer";
import "./GameScreen.css";

function TurnTimerBlock({
    seconds, playerName, onExpire
}: {
    seconds: number, playerName: string, onExpire: () => void
}) {

    const { remaining } = useTurnTimer({ seconds, onExpire })

    return (
        <TurnTimer 
            playerName={playerName}
            remaining={remaining}
            instruction="Fale a palavra e toque na letra usada"
        />
    )
}

export default function GameScreen() {
    const navigate = useNavigate();
    const { state, dispatch } = useGame();
    const { setup, game } = state;

    const sortedScore = useMemo(() => {
        return [...setup.players].sort((a, b) => b.wins - a.wins);
    }, [setup.players]);

    if (game.status === "setup") {
        return (
        <div className="page gameScreen">
            <h1>Jogo</h1>
            <p>Você precisa iniciar o jogo antes.</p>
            <Button onClick={() => navigate("/")}>Voltar ao início</Button>
        </div>
        );
    }

    const currentPlayer = setup.players[game.currentPlayerIndex];
    const currentTheme = game.themes[game.currentThemeIndex];

    const usedLetters = currentTheme?.usedLetters ?? [];
    const activeLetters = setup.activeLetters;
    const allUsed = usedLetters.length >= activeLetters.length;
    const canGoNextTheme = allUsed && game.status === "playing";

    const hasNextTheme = game.currentThemeIndex < game.themes.length - 1

    const winnersText = (() => {
        if(!game.lastThemeResult) return ""
        const names = game.lastThemeResult.winnerIndexes
            .map((index) => setup.players[index]?.name)
            .filter(Boolean)
        return names.join(" e ");
    })();

    function pickLetter(letter: string) {
        if (game.status !== "playing") return;
        dispatch({ type: "PICK_LETTER", payload: letter });
    }

    function loseTurn() {
        if (game.status !== "playing") return;
        dispatch({ type: "LOSE_TURN" });
    }

    function nextTheme() {
        dispatch({ type: "NEXT_THEME" });
    }

    return (
        <div className="page gameScreen">
        <header className="gameHeader">
            <div className="gameHeader__left">
            <div className="gameHeader__theme">{currentTheme?.name ?? "-"}</div>
            <div className="gameHeader__progress">
                {game.currentThemeIndex + 1} de {game.themes.length}
            </div>
            </div>

            <div className="gameHeader__right">
            <Button variant="secondary" onClick={() => {
                dispatch({ type: "RESET_GAME" })
                navigate("/")
            }}>
                Sair
            </Button>
            </div>
        </header>

        {game.status === "theme_result" ? (
            <div className="gameFinished">
                <h1>Fim do Tema</h1>
                <p style={{ marginTop: 8 }}>
                    {winnersText ? (
                        <>
                            <strong>Ganhou:</strong> {winnersText}
                        </>
                    ) : null}
                </p>

                <div className="gameFinished__score" style={{ marginTop: 16 }}>
                    {sortedScore.map((p) => (
                        <div key={p.id} className="gameFinished__row">
                            <span>{p.name}</span>
                            <strong>{p.wins}</strong>
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: 16 }}>
                    <Button onClick={nextTheme} disabled={!hasNextTheme}>
                        Próximo Tema
                    </Button>
                </div>
            </div>
        ) : null}

        {game.status === "finished" ? (
            <div className="gameFinished">
            <h1>Placar Final</h1>

            {winnersText ? (
                <p style={{ marginTop: 8 }}>
                    <strong>Último tema:</strong> ganhou {winnersText}
                </p>
            ) : null}

            <div className="gameFinished__score" style={{ marginTop: 16 }}>
                {sortedScore.map((p) => (
                <div key={p.id} className="gameFinished__row">
                    <span>{p.name}</span>
                    <strong>{p.wins}</strong>
                </div>
                ))}
            </div>

            <div style={{ marginTop: 16 }}>
                <Button onClick={() => {
                    dispatch({ type: "RESET_GAME" })
                    navigate("/")
                }}>
                    Voltar ao Início
                </Button>
            </div>

            </div>
        ) : null}

        {game.status === "playing" ? (
            <>
            <div key={game.turn}>
                <TurnTimerBlock
                    seconds={setup.secondsPerTurn}
                    playerName={currentPlayer?.name ?? "-"}
                    onExpire={() => dispatch({ type: "LOSE_TURN" })}
                />
            </div>

            <div className="gameGrid">
                <LetterGrid letters={activeLetters} usedLetters={usedLetters} onPick={pickLetter} />
            </div>

            <div className="gameActions">
                <Button variant="secondary" onClick={loseTurn}>
                Perdi / Pular
                </Button>
                <Button disabled={!canGoNextTheme} onClick={nextTheme}>
                Próximo Tema
                </Button>
            </div>

            <div className="gameHint">Letras usadas: {usedLetters.length}/{activeLetters.length}</div>
            </>
        ) : null}
        </div>
    );
}
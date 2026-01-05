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
        <div className="page game">
            <main className="game__content">
                <h1 className="game__title">Jogo</h1>
                <p className="game__subtitle">Você precisa iniciar o jogo antes.</p>
                <div style={{ marginTop: 16 }}>
                    <Button variant="hero" onClick={() => navigate("/")}>Voltar ao início</Button>
                </div>
            </main>
        </div>
        );
    }

    const currentPlayer = setup.players[game.currentPlayerIndex];
    const currentTheme = game.themes[game.currentThemeIndex];

    const usedLetters = currentTheme?.usedLetters ?? [];
    const activeLetters = setup.activeLetters.length ? setup.activeLetters : "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    const resultText = (() => {
        if(!game.lastThemeResult) return ""

        if(game.lastThemeResult.type === "tie") {
            return "Empate! Todos pontuaram +1";
        }

        const names = game.lastThemeResult.winnerIndexes
            .map((index) => setup.players[index]?.name)
            .filter(Boolean)
        return `Ganhou: ${names.join(" e ")}`;
    })();

    function pickLetter(letter: string) {
        if (game.status !== "playing") return;
        dispatch({ type: "PICK_LETTER", payload: letter });
    }

    function exitGame() {
        dispatch({ type: "RESET_GAME" });
        navigate("/");
    }

    return (
        <div className="page game">
        <header className="game__topbar">
            <div className="game__topbarLeft">
                <div className="game__theme">{currentTheme?.name ?? "-"}</div>
                <div className="game__themeSub">
                    Tema {game.currentThemeIndex + 1} de {game.themes.length}
                </div>
            </div>

            <button type="button" className="game__exit" onClick={exitGame}>
                Sair
            </button>
        </header>

        {game.status === "theme_result" ? (
            <main className="game__content">
                <div className="game__panel">
                    <h1 className="game__panelTitle">Fim do Tema</h1>
                
                    {resultText ? (
                        <p className="game__panelSubtitle">
                        <strong>{resultText}</strong>
                    </p>
                    ) : null}

                    <div className="game__score">
                        {sortedScore.map((p) => (
                            <div key={p.id} className="game__scoreRow">
                                <span className="game__scoreName">{p.name}</span>
                                <strong className="game__scoreValue">{p.wins}</strong>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        ) : null}

        {game.status === "finished" ? (
            <main className="game__content">
                <div className="game__panel">
                    <h1 className="game__panelTitle">Placar Final</h1>

                    {resultText ? (
                        <p className="game__panelSubtitle">
                            <strong>{resultText}</strong>
                        </p>
                    ) : null}

                    <div className="game__score">
                        {sortedScore.map((p) => (
                        <div key={p.id} className="game__scoreRow">
                            <span className="game__scoreName">{p.name}</span>
                            <strong className="game__scoreValue">{p.wins}</strong>
                        </div>
                        ))}
                    </div>

                    <div className="game__panelActions">
                        <Button variant="hero" onClick={exitGame}>
                            Voltar ao Início
                        </Button>
                    </div>
                </div>
            </main>
        ) : null}

        {game.status === "playing" ? (
            <>
                <main className="game__content">
                    <div key={game.turn} className="game_timerWrap">
                        <TurnTimerBlock
                            seconds={setup.secondsPerTurn}
                            playerName={currentPlayer?.name ?? "-"}
                            onExpire={() => dispatch({ type: "LOSE_TURN" })}
                        />
                    </div>

                    <div className="game_gridWrap">
                        <LetterGrid letters={activeLetters} usedLetters={usedLetters} onPick={pickLetter} />
                    </div>
                </main>

                <footer className="game__footer">
                    <div className="game__footerInner">
                        <div className="game__meta" aria-live="polite">
                            <strong className="game__metaNumber">{usedLetters.length}</strong>
                            <span className="game__metaDivider">/</span>
                            <span className="game__metaTotal">{activeLetters.length}</span>
                            <span className="game__metaLabel">letras usadas</span>
                        </div>
                    </div>
                </footer>
            </>
        ) : null}
        </div>
    );
}
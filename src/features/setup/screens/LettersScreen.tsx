import { useNavigate } from "react-router-dom"
import { useGame } from "../../../state/useGame"
import { useMemo } from "react";
import { Button } from "../../../components/ui/Button";
import "./LettersScreen.css"

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
const HARD_LETTERS = ["K", "W", "Y"]

function StepDots({total, current} : { total: number, current: number}) {
    return (
        <div className="step-dots" aria-label={`Etapa ${current} de ${total}`}>
            {Array.from({ length: total }).map((_, index) => (
                <span key={index} className={`step-dot ${index + 1 === current ? "active" : ""}`} aria-hidden="true" />
            ))}
        </div>
    )
}

export default function LettersScreen() {
    const navigate = useNavigate();
    const { state, dispatch } = useGame();

    const activeLetters = state.setup.activeLetters?.length ? state.setup.activeLetters : ALPHABET;

    const activeSet = useMemo(() => new Set(activeLetters), [activeLetters]);

    function toggleLetter(letter: string) {
        if(activeSet.has(letter)) {
            const next = activeLetters.filter((l) => l !== letter);
            dispatch({ type: "SET_ACTIVE_LETTERS", payload: next });
            return
        }

        const next = [...activeLetters, letter].sort(
            (a, b) => ALPHABET.indexOf(a) - ALPHABET.indexOf(b)
        );
        dispatch({ type: "SET_ACTIVE_LETTERS", payload: next });
    }

    function selectAll() {
        dispatch({ type: "SET_ACTIVE_LETTERS", payload: ALPHABET });
    }

    function selectCommonOnly() {
        const common = ALPHABET.filter((l) => !HARD_LETTERS.includes(l));
        dispatch({ type: "SET_ACTIVE_LETTERS", payload: common })
    }

    const total = ALPHABET.length
    const selected = activeLetters.length
    const canStart = selected >= 1;

    function start() {
        if(!canStart) return
        dispatch({ type: "START_GAME" })
        navigate("/game")
    }

    return (
        <div className="page letters">
            <header className="letters__topbar">
                <button type="button" className="letters__back" onClick={() => navigate(-1)} aria-label="Voltar">←</button>
                <StepDots total={4} current={4}/>
                <div className="letters__topbarSpacer" aria-hidden="true" />
            </header>

            <main className="letters__content">
                <div className="letters__header">
                    <h1 className="letters__title">Letras do Jogo</h1>
                    <p className="letters__subtitle">Escolha quais letras farão parte do jogo</p>
                </div>

                <section className="letters__grid" aria-label="Selecionar letras">
                    {ALPHABET.map((letter) => {
                        const isOn = activeSet.has(letter);
                        return (
                            <button key={letter} type="button" className={`letters__btn ${isOn ? "is-on" : "is-off"}`} onClick={() => toggleLetter(letter)} aria-pressed={isOn}>
                                {letter}
                            </button>
                        )
                    })}
                </section>

                <div className="letters__countCard" aria-live="polite">
                    <strong className="letters__countNumber">{selected}</strong>
                    <span className="letters__countDivider">/</span>
                    <span className="letters__countTotal">{total}</span>
                    <span className="letters__countLabel">letras selecionadas</span>
                </div>
                
                <div className="letters__tip" role="note">
                    <span className="letters__tipIcon" aria-hidden="true">💡</span>
                    <span className="letters__tipText">
                        <strong>Dica:</strong> As letras <strong>K, W</strong> e <strong>Y</strong> têm poucas palavras em português.
                        Você pode removê-las para um jogo mais fluido.
                    </span>
                </div>

                <div className="letters__quick">
                    <button type="button" className="letters__pill" onClick={selectAll}>Selecionar Todas</button>
                    <button type="button" className="letters__pill" onClick={selectCommonOnly}>Remover K/W/Y</button>
                </div>
            </main>

            <footer className="letters__footer">
                <div className="letters__footerInner">
                    <Button variant="hero" disabled={!canStart} onClick={start}>Iniciar Jogo 🎮</Button>
                </div>
            </footer>
        </div>
    )
}
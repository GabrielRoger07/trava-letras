import { useNavigate } from "react-router-dom"
import { useGame } from "../../../state/useGame"
import { useMemo } from "react";
import { Button } from "../../../components/ui/Button";
import "./LettersScreen.css"

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

export default function LettersScreen() {
    const navigate = useNavigate();
    const { state, dispatch } = useGame();

    const activeLetters = state.setup.activeLetters;

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
        const common = ALPHABET.filter((l) => !["K", "W", "Y"].includes(l));
        dispatch({ type: "SET_ACTIVE_LETTERS", payload: common })
    }

    const canStart = activeLetters.length >= 1;

    function start() {
        if(!canStart) return
        dispatch({ type: "START_GAME" })
        navigate("/game")
    }

    return (
        <div className="page letters">
            <h1 className="letters__title">Letras do Jogo</h1>
            <p className="letters__subtitle">
                Toque para desativar letras difíceis (ex.: K, W, Y). Pelo menos 1 letra deve ficar ativa.
            </p>

            <div className="letters__grid">
                {ALPHABET.map((letter) => {
                    const isOn = activeSet.has(letter);
                    return (
                        <button key={letter} type="button" className={`letters__btn ${isOn ? "is-on" : "is-off"}`} onClick={() => toggleLetter(letter)}>{letter}</button>
                    )
                })}
            </div>

            <div className="letters__meta">
                {activeLetters.length} letra{activeLetters.length === 1 ? "": "s"} ativa{activeLetters.length === 1 ? "": "s"}
            </div>
            
            <div className="letters__quick">
                <button type="button" className="letters__link" onClick={selectAll}>Selecionar Todas</button>
                <button type="button" className="letters__link" onClick={selectCommonOnly}>Remover K/W/Y</button>
            </div>

            <div className="letters__actions">
                <Button variant="secondary" onClick={() => navigate(-1)}>Voltar</Button>
                <Button disabled={!canStart} onClick={start}>Iniciar Jogo</Button>
            </div>
        </div>
    )
}
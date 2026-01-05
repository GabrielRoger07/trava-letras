import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import "./StartScreen.css"

export default function StartScreen() {
    const navigate = useNavigate()

    return (
        <div className="page start">
            <div className="start__content">
                <div className="start__hero">
                    <div className="start__logo" aria-hidden="true">
                        ✨
                    </div>

                    <h1 className="start__title">Trava Letras</h1>
                    <p className="start__subtitle">Jogo presencial de palavras por tema e letras</p>
                </div>

                <div className="start__actions">
                    <Button variant="hero" onClick={() => navigate("/setup/players")}>
                        <span className="start__play" aria-hidden="true">▶</span>
                        Começar
                    </Button>

                    <button type="button" className="start__howTo" onClick={() => alert("Em breve: tela de como jogar 🙂")}>
                        <span className="start__howToIcon" aria-hidden="true">?</span>
                        Como jogar
                    </button>
                </div>

                <div className="start__footer">
                    <span className="start__sparkle" aria-hidden="true">✨</span>
                    Funciona sem login
                </div>
            </div>
        </div>
    )
}
import { useNavigate } from "react-router-dom";

export default function GameScreen() {
    const navigate = useNavigate()

    return (
        <div className="page">
            <h1>Jogo</h1>

            <button onClick={() => navigate("/")}>Voltar ao Início</button>
        </div>
    )
}
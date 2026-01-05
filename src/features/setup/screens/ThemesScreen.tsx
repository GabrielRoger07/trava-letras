import { useNavigate } from "react-router-dom";

export default function ThemesScreen() {
    const navigate = useNavigate()

    return (
        <div className="page">
            <h1>Temas</h1>

            <button onClick={() => navigate(-1)}>Voltar</button>
            <button onClick={() => navigate("/game")}>Iniciar Jogo</button>
        </div>
    )
}
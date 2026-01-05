import { useNavigate } from "react-router-dom";

export default function TimerScreen() {
    const navigate = useNavigate()

    return (
        <div className="page">
            <h1>Tempo por Jogador</h1>

            <button onClick={() => navigate(-1)}>Voltar</button>
            <button onClick={() => navigate("/setup/themes")}>Continuar</button>
        </div>
    )
}
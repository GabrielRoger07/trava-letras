import { useNavigate } from "react-router-dom";

export default function PlayersScreen() {
    const navigate = useNavigate()

    return (
        <div className="page">
            <h1>Jogadores</h1>

            <button onClick={() => navigate(-1)}>Voltar</button>
            <button onClick={() => navigate("/setup/timer")}>Continuar</button>
        </div>
    )
}
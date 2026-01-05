import { useNavigate } from "react-router-dom";

export default function StartScreen() {
    const navigate = useNavigate()

    return (
        <div className="page center">
            <div>
                <h1>Trava Letras</h1>
                <button onClick={() => navigate("/setup/players")}>Começar</button>
            </div>
        </div>
    )
}
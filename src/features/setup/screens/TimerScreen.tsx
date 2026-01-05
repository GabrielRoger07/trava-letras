import { useNavigate } from "react-router-dom";
import "./TimerScreen.css"
import { useGame } from "../../../state/useGame";
import { SegmentedControl } from "../../../components/ui/SegmentedControl";
import { Button } from "../../../components/ui/Button";

const TIMER_OPTIONS = [5, 10, 15, 20, 25, 30];

export default function TimerScreen() {
    const navigate = useNavigate()
    const { state, dispatch } = useGame()

    const selectedTime = state.setup.secondsPerTurn || 10;

    function handleTimeChange(seconds: number) {
        dispatch({type: "SET_TIMER", payload: seconds})
    }

    return (
        <div className="page timer">
            <h1 className="timer__title">Tempo por Jogador</h1>

            <div className="timer__options">
                <SegmentedControl 
                    options={TIMER_OPTIONS.map((value) => ({
                        label: `${value}s`,
                        value
                    }))}
                    value={selectedTime}
                    onChange={handleTimeChange}
                />
            </div>

            <div className="timer_actions">
                <Button variant="secondary" onClick={() => navigate(-1)}>Voltar</Button>
                <Button onClick={() => navigate("/setup/themes")}>Continuar</Button>
            </div>

        </div>
    )
}
import { useNavigate } from "react-router-dom";
import "./TimerScreen.css"
import { useGame } from "../../../state/useGame";
import { SegmentedControl } from "../../../components/ui/SegmentedControl";
import { Button } from "../../../components/ui/Button";

const TIMER_OPTIONS = [5, 10, 15, 20, 25, 30];

function StepDots({total, current} : { total: number, current: number}) {
    return (
        <div className="step-dots" aria-label={`Etapa ${current} de ${total}`}>
            {Array.from({ length: total }).map((_, index) => (
                <span key={index} className={`step-dot ${index + 1 === current ? "active" : ""}`} aria-hidden="true" />
            ))}
        </div>
    )
}

export default function TimerScreen() {
    const navigate = useNavigate()
    const { state, dispatch } = useGame()

    const selectedTime = state.setup.secondsPerTurn || 10;

    function handleTimeChange(seconds: number) {
        dispatch({type: "SET_TIMER", payload: seconds})
    }

    return (
        <div className="page timer">
            <header className="timer__topbar">
                <button type="button" className="timer__back" onClick={() => navigate(-1)} aria-label="Voltar">←</button>
                <StepDots total={4} current={2}/>
                <div className="timer__topbarSpacer" aria-hidden="true" />
            </header>

            <main className="timer__content">
                <div className="timer__header">
                    <h1 className="timer__title">Tempo por Jogador</h1>
                    <p className="players__subtitle">O tempo reinicia a cada rodada</p>
                </div>

                <section className="timer__options">
                    <SegmentedControl 
                        options={TIMER_OPTIONS.map((value) => ({
                            label: String(value),
                            value
                        }))}
                        value={selectedTime}
                        onChange={handleTimeChange}
                    />
                </section>
            </main>

            <footer className="timer__footer">
                <div className="timer__footerInner">
                    <Button variant="hero" onClick={() => navigate("/setup/themes")}>Continuar</Button>
                </div>
            </footer>
        </div>
    )
}
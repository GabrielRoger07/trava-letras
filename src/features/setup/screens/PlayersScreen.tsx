import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import { SegmentedControl } from "../../../components/ui/SegmentedControl";
import { TextInput } from "../../../components/ui/TextInput";
import { useGame } from "../../../state/useGame";
import type { Player } from "../../../state/gameTypes";
import "./PlayersScreen.css"

function StepDots({total, current} : { total: number, current: number}) {
    return (
        <div className="step-dots" aria-label={`Etapa ${current} de ${total}`}>
            {Array.from({ length: total }).map((_, index) => (
                <span key={index} className={`step-dot ${index + 1 === current ? "active" : ""}`} aria-hidden="true" />
            ))}
        </div>
    )
}

export default function PlayersScreen() {
    const navigate = useNavigate()
    const { state, dispatch } = useGame();

    const players = state.setup.players;
    const playerCount = players.length || 2;

    function buildPlayers(count: number): Player[] {
        return Array.from({ length: count }).map((_, index) => ({
            id: players[index]?.id ?? crypto.randomUUID(),
            name: players[index]?.name ?? "",
            wins: players[index]?.wins ?? 0
        }))
    }

    useEffect(() => {
        if(players.length === 0){
            dispatch({ type: "SET_PLAYERS", payload: buildPlayers(2) })
        }
    }, [])

    function handlePlayerCountChange(count: number) {
        dispatch({ type: "SET_PLAYERS", payload: buildPlayers(count) })
    }

    function handleNameChange(index: number, name: string) {
        const updatedPlayers = players.map((player, i) => 
            i === index ? { ...player, name} : player
        )

        dispatch({type: "SET_PLAYERS", payload: updatedPlayers})
    }

    const isValid = players.length >= 2 && players.every((player) => player.name.trim().length > 0)

    return (
        <div className="page players">
            <header className="players__topbar">
                <button type="button" className="players__back" onClick={() => navigate(-1)} aria-label="Voltar">←</button>
                <StepDots total={4} current={1}/>
                <div className="players__topbarSpacer" aria-hidden="true" />
            </header>

            <main className="players__content">
                <div className="players__header">
                    <h1 className="players__title">Jogadores</h1>
                    <p className="players__subtitle">Quantas pessoas vão jogar?</p>
                </div>

                <section className="players__count">
                    <SegmentedControl 
                        options={[
                            { label: "2", value: 2 },
                            { label: "3", value: 3 },
                            { label: "4", value: 4 }
                        ]}
                        value={playerCount}
                        onChange={handlePlayerCountChange}
                    />
                </section>

                <section className="players__inputs">
                    {players.map((player, index) => (
                        <TextInput 
                            key={player.id}
                            value={player.name}
                            placeholder={`Jogador ${index + 1}`}
                            onChange={(value) => handleNameChange(index, value)}
                        />
                    ))}
                </section>
            </main>

            <footer className="players__footer">
                <div className="players__footerInner">
                    <Button variant="hero" disabled={!isValid} onClick={() => navigate("/setup/timer")}>Continuar</Button>
                </div>
            </footer>
        </div>
    )
}
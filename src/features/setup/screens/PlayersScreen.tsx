import { useNavigate } from "react-router-dom";
import { useGame } from "../../../state/useGame";
import type { Player } from "../../../state/gameTypes";
import { SegmentedControl } from "../../../components/ui/SegmentedControl";
import { TextInput } from "../../../components/ui/TextInput";
import { Button } from "../../../components/ui/Button";

export default function PlayersScreen() {
    const navigate = useNavigate()
    const { state, dispatch } = useGame();

    const players = state.setup.players;

    const playerCount = players.length || 2;

    function handlePlayerCountChange(count: number) {
        const newPlayers: Player[] = Array.from({ length: count }).map(
            (_, index) => ({
                id: crypto.randomUUID(),
                name: players[index]?.name ?? "",
                wins: players[index]?.wins ?? 0
            })
        )

        dispatch({ type: "SET_PLAYERS", payload: newPlayers })
    }

    function handleNameChange(index: number, name: string) {
        const updatedPlayers = players.map((player, i) => 
            i === index ? { ...player, name} : player
        )

        dispatch({type: "SET_PLAYERS", payload: updatedPlayers})
    }

    const isValid = players.length >=2 && players.every((player) => player.name.trim().length > 0)

    return (
        <div className="page players">
            <h1 className="players__title">Jogadores</h1>

            <div className="players__count">
                <SegmentedControl 
                    options={[
                        { label: "2", value: 2 },
                        { label: "3", value: 3 },
                        { label: "4", value: 4 }
                    ]}
                    value={playerCount}
                    onChange={handlePlayerCountChange}
                />
            </div>

            <div className="players__inputs">
                {players.map((player, index) => (
                    <TextInput 
                        key={player.id}
                        value={player.name}
                        placeholder={`Jogador ${index + 1}`}
                        onChange={(value) => handleNameChange(index, value)}
                    />
                ))}
            </div>

            <div className="players__actions">
                <Button variant="secondary" onClick={() => navigate(-1)}>Voltar</Button>
                <Button disabled={!isValid} onClick={() => navigate("/setup/timer")}>Continuar</Button>
            </div>
        </div>
    )
}
import { useReducer } from "react";
import { gameReducer, initialState } from "./gameReducer";
import { GameContext } from "./GameContext";

export function GameProvider({
    children,
} : {
    children: React.ReactNode;
}) {
    const [state, dispatch] = useReducer(gameReducer, initialState);

    return (
        <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>
    )
}
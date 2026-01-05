import { createContext } from "react";
import type { Action } from "./gameReducer";
import type { GlobalState } from "./gameTypes"

export type GameContextType = {
    state: GlobalState;
    dispatch: React.Dispatch<Action>;
};

export const GameContext = createContext<GameContextType | undefined>(undefined);
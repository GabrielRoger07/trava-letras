import type { GlobalState, Player } from "./gameTypes";

export type Action =
    | { type: "SET_PLAYERS"; payload: Player[] }
    | { type: "SET_TIMER"; payload: number }
    | { type: "SET_THEMES"; payload: string[] }
    | { type: "START_GAME" }
    | { type: "PICK_LETTER"; payload: string }
    | { type: "LOSE_TURN" }
    | { type: "NEXT_THEME" }
    | { type: "RESET_GAME" }
    | { type: "FINISH_GAME" };

export const initialState: GlobalState = {
    setup: {
        players: [],
        secondsPerTurn: 10,
        themes: [],
    },
    game: {
        currentPlayerIndex: 0,
        currentThemeIndex: 0,
        themes: [],
        status: "setup",
        turn: 0,
    },
};

export function gameReducer(state: GlobalState, action: Action): GlobalState {
    switch (action.type) {
        case "SET_PLAYERS":
        return {
            ...state,
            setup: { ...state.setup, players: action.payload },
        };

        case "SET_TIMER":
        return {
            ...state,
            setup: { ...state.setup, secondsPerTurn: action.payload },
        };

        case "SET_THEMES":
        return {
            ...state,
            setup: { ...state.setup, themes: action.payload },
        };

        case "START_GAME": {
        if (state.setup.players.length < 2 || state.setup.themes.length < 1) {
            return state;
        }

        return {
            ...state,
            game: {
            status: "playing",
            currentPlayerIndex: 0,
            currentThemeIndex: 0,
            turn: 0,
            themes: state.setup.themes.map((name) => ({
                name,
                usedLetters: [],
            })),
            },
        };
        }

        case "PICK_LETTER": {
        if (state.game.status !== "playing") return state;

        const letter = action.payload.trim().toUpperCase();

        const theme = state.game.themes[state.game.currentThemeIndex];
        if (!theme) return state;

        if (theme.usedLetters.includes(letter)) return state;

        const themes = state.game.themes.map((t, index) => {
            if (index !== state.game.currentThemeIndex) return t;
            return {
            ...t,
            usedLetters: [...t.usedLetters, letter],
            };
        });

        return {
            ...state,
            game: {
            ...state.game,
            themes,
            turn: state.game.turn + 1,
            currentPlayerIndex:
                (state.game.currentPlayerIndex + 1) % state.setup.players.length,
            },
        };
        }

        case "LOSE_TURN": {
        if (state.game.status !== "playing") return state;

        const losingIndex = state.game.currentPlayerIndex;

        const players = state.setup.players.map((player, index) => {
            if (index === losingIndex) return player;
            return { ...player, wins: player.wins + 1 };
        });

        return {
            ...state,
            setup: { ...state.setup, players },
            game: {
            ...state.game,
            turn: state.game.turn + 1,
            currentPlayerIndex: (losingIndex + 1) % players.length,
            },
        };
        }

        case "NEXT_THEME": {
        const nextThemeIndex = state.game.currentThemeIndex + 1;
        const finished = nextThemeIndex >= state.game.themes.length;

        return {
            ...state,
            game: {
            ...state.game,
            currentThemeIndex: finished ? state.game.currentThemeIndex : nextThemeIndex,
            currentPlayerIndex: finished ? state.game.currentPlayerIndex : 0,
            status: finished ? "finished" : state.game.status,
            turn: finished ? state.game.turn : state.game.turn + 1,
            },
        };
        }

        case "RESET_GAME":
        return initialState;

        case "FINISH_GAME":
        return { ...state, game: { ...state.game, status: "finished" } };

        default:
        return state;
    }
}
import type { GlobalState, Player } from "./gameTypes";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export type Action =
    | { type: "SET_PLAYERS"; payload: Player[] }
    | { type: "SET_TIMER"; payload: number }
    | { type: "SET_THEMES"; payload: string[] }
    | { type: "SET_ACTIVE_LETTERS"; payload: string[] }
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
        activeLetters: ALPHABET
    },
    game: {
        currentPlayerIndex: 0,
        currentThemeIndex: 0,
        themes: [],
        status: "setup",
        turn: 0,
        lastThemeResult: null
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

        case "SET_ACTIVE_LETTERS":
        return {
            ...state,
            setup: { ...state.setup, activeLetters: action.payload },
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
            lastThemeResult: null
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

        const updatedTheme = themes[state.game.currentThemeIndex];
        const totalLetters = state.setup.activeLetters.length;

        const exhausted = totalLetters > 0 && updatedTheme.usedLetters.length >= totalLetters;

        if(exhausted){
            const players = state.setup.players.map((p) => ({ ...p, wins: p.wins + 1 }));
            const isLastTheme = state.game.currentThemeIndex >= state.game.themes.length - 1;

            return {
                ...state,
                setup: { ...state.setup, players },
                game: {
                    ...state.game,
                    themes,
                    status: isLastTheme ? "finished" : "theme_result",
                    lastThemeResult: { type: "tie"},
                    turn: state.game.turn + 1
                }
            };
        }

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

        const loserIndex = state.game.currentPlayerIndex;

        const winnerIndexes = state.setup.players
            .map((_, index) => index)
            .filter((index) => index !== loserIndex)

        const players = state.setup.players.map((player, index) => 
            index === loserIndex ? player : { ...player, wins: player.wins + 1 }
        );

        const isLastTheme = state.game.currentThemeIndex >= state.game.themes.length - 1;

        return {
            ...state,
            setup: { ...state.setup, players },
            game: {
            ...state.game,
            status: isLastTheme ? "finished" : "theme_result",
            lastThemeResult: { type: "loss", loserIndex, winnerIndexes },
            turn: state.game.turn + 1,
            },
        };
        }

        case "NEXT_THEME": {
            if(state.game.status !== "theme_result") return state

            const nextThemeIndex = state.game.currentThemeIndex + 1;
            const finished = nextThemeIndex >= state.game.themes.length;

            if(finished) {
                return {
                    ...state,
                    game: {
                        ...state.game,
                        status: "finished"
                    }
                }
            }

            return {
                ...state,
                game: {
                ...state.game,
                status: "playing",
                currentThemeIndex: nextThemeIndex,
                currentPlayerIndex: 0,
                lastThemeResult: null,
                turn: state.game.turn + 1,
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
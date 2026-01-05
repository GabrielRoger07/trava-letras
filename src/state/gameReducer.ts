import type { GlobalState, Player } from "./gameTypes";

export type Action = 
    | { type: "SET_PLAYERS"; payload: Player[] }
    | { type: "SET_TIMER"; payload: number }
    | { type: "SET_THEMES"; payload: string[] }
    | { type: "START_GAME" }
    | { type: "PICK_LETTER"; payload: string }
    | { type: "LOSE_TURN" }
    | { type: "NEXT_THEME" }
    | { type: "RESET_GAME" };

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
  },
};

export function gameReducer(state: GlobalState, action: Action): GlobalState {
    switch (action.type) {
        case "SET_PLAYERS":
            return {
                ...state,
                setup: { ...state.setup, players: action.payload},
            };
        
        case "SET_TIMER":
            return {
                ...state,
                setup: { ...state.setup, secondsPerTurn: action.payload},
            };
        
        case "SET_THEMES":
            return {
                ...state,
                setup: { ...state.setup, themes: action.payload},
            };
        
        case "START_GAME":
            return {
                ...state,
                game: { 
                    status: "playing", 
                    currentPlayerIndex: 0, 
                    currentThemeIndex: 0, 
                    themes: state.setup.themes.map((name) => ({
                        name,
                        usedLetters: []
                    })) 
                },
            };
        
        case "PICK_LETTER": {
            const themes = [...state.game.themes];
            const theme = themes[state.game.currentThemeIndex];

            if(theme.usedLetters.includes(action.payload)) {
                return state;
            }

            theme.usedLetters = [...theme.usedLetters, action.payload];

            return {
                ...state,
                game: {
                    ...state.game,
                    themes,
                    currentPlayerIndex:
                        (state.game.currentPlayerIndex + 1) % state.setup.players.length
                }
            }
        }

        case "LOSE_TURN": {
            const losingIndex = state.game.currentPlayerIndex;

            const players = state.setup.players.map((player, index) => {
                if(index === losingIndex) {
                    return player;
                }
                return {...player, wins: player.wins + 1};
            });

            return {
                ...state,
                setup: { ...state.setup, players },
                game: {
                    ...state.game, currentPlayerIndex: (losingIndex + 1) % players.length
                }
            }
        }

        case "NEXT_THEME":
            return {
                ...state,
                game: { ...state.game, currentThemeIndex: state.game.currentThemeIndex + 1},
            };

        case "RESET_GAME":
            return initialState;
        
            default:
                return state;
    }
}
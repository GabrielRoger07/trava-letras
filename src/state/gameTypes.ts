export type Player = {
    id: string;
    name: string;
    wins: number;
}

export type SetupState = {
    players: Player[];
    secondsPerTurn: number;
    themes: string[];
}

export type ThemeState = {
    name: string;
    usedLetters: string[];
}

export type GameState = {
    currentPlayerIndex: number;
    currentThemeIndex: number;
    themes: ThemeState[];
    status: "setup" | "playing" | "finished";
    turn: number;
}

export type GlobalState = {
    setup: SetupState;
    game: GameState;
}
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

export type LastThemeResult = {
    loserIndex: number,
    winnerIndexes: number[]
}

export type GameState = {
    currentPlayerIndex: number;
    currentThemeIndex: number;
    themes: ThemeState[];
    status: "setup" | "playing" | "theme_result" | "finished";
    turn: number;
    lastThemeResult: LastThemeResult | null;
}

export type GlobalState = {
    setup: SetupState;
    game: GameState;
}
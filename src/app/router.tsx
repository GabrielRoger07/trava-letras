import { Navigate, Route, Routes } from "react-router-dom";
import StartScreen from "../features/setup/screens/StartScreen";
import PlayersScreen from "../features/setup/screens/PlayersScreen";
import TimerScreen from "../features/setup/screens/TimerScreen";
import ThemesScreen from "../features/setup/screens/ThemesScreen";
import GameScreen from "../features/game/screens/GameScreen";
import LettersScreen from "../features/setup/screens/LettersScreen";

export function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<StartScreen />}/>
            <Route path="/setup/players" element={<PlayersScreen />}/>
            <Route path="/setup/timer" element={<TimerScreen />}/>
            <Route path="/setup/themes" element={<ThemesScreen />}/>
            <Route path="/setup/letters" element={<LettersScreen />}/>
            <Route path="/game" element={<GameScreen />}/>
            <Route path="*" element={<Navigate to="/" replace />}/>
        </Routes>
    )
}
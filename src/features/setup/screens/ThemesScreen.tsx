import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import { TextInput } from "../../../components/ui/TextInput";
import { useGame } from "../../../state/useGame";
import "./ThemesScreen.css"

const PRESET_THEMES = ["Países", "Animais", "Filmes", "Times de Futebol", "Comidas"]

function normalizeTheme(value: string) {
    return value.trim().replace(/\s+/g, " ")
}

export default function ThemesScreen() {
    const navigate = useNavigate()
    const {state, dispatch} = useGame()

    const [customTheme, setCustomTheme] = useState("")

    const selectedThemes = state.setup.themes

    const selectedSet = useMemo(
        () => new Set(selectedThemes),
        [selectedThemes]
    )

    const customSelectedThemes = useMemo(() => {
        const presetSet = new Set(PRESET_THEMES)
        return selectedThemes.filter((t) => !presetSet.has(t))
    }, [selectedThemes])

    function setThemes(next: string[]) {
        dispatch({ type: "SET_THEMES", payload: next })
    }

    function toggleTheme(theme: string) {
        const t = normalizeTheme(theme)
        if(!t) return

        if(selectedSet.has(t)) {
            setThemes(selectedThemes.filter((x) => x !== t))
            return
        }

        setThemes([...selectedThemes, t])
    }

    function addCustomTheme() {
        const t = normalizeTheme(customTheme)
        if(!t) return

        if(!selectedSet.has(t)) {
            setThemes([...selectedThemes, t])
        }
        setCustomTheme("")
    }

    function removeCustomTheme(theme: string) {
        setThemes(selectedThemes.filter((t) => t !== theme))
    }

    const canStart = selectedThemes.length >= 1

    function start() {
        if(!canStart) return
        dispatch({type: "START_GAME"})
        navigate("/game")
    }

    return (
        <div className="page themes">
            <h1 className="themes__title">Temas</h1>
            <p className="themes_subtitle">Escolha pelo menos 1 tema</p>

            <div className="themes__list">
                {PRESET_THEMES.map((theme) => {
                    const checked = selectedSet.has(theme)
                    return (
                        <button key={theme} type="button" className={`themes__row ${checked ? "themes__row--checked" : ""}`} onClick={() => toggleTheme(theme)}>
                            <span className={`themes__checkbox ${checked ? "is-on" : ""}`} />
                            <span className="themes__text">{theme}</span>
                        </button>
                    )
                })}
            </div>

            <div className="themes__custom">
                <TextInput 
                    value={customTheme}
                    onChange={setCustomTheme}
                    placeholder="Tema personalizado"
                />
                <button type="button" className="themes__add" onClick={addCustomTheme} aria-label="Adicionar tema">
                    +
                </button>
            </div>

            {customSelectedThemes.length > 0 && (
                <div className="themes__chips">
                    {customSelectedThemes.map((t) => (
                        <div key={t} className="themes__chip">
                            <span className="themes__chipNext">{t}</span>
                            <button type="button" className="themes__chipRemove" onClick={() => removeCustomTheme(t)} aria-label={`Remover ${t}`}>
                                x
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className="themes__count">
                {selectedThemes.length} tema{selectedThemes.length === 1 ? "" : "s"} selecionado{selectedThemes.length === 1 ? "" : "s"}
            </div>

            <div className="themes__actions">
                <Button variant="secondary" onClick={() => navigate(-1)}>Voltar</Button>
                <Button disabled={!canStart} onClick={start}>Iniciar Jogo</Button>
            </div>
        </div>
    )
}
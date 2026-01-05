import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import { TextInput } from "../../../components/ui/TextInput";
import { useGame } from "../../../state/useGame";
import "./ThemesScreen.css"

const PRESET_THEMES = ["Herói🦸🏻 ou vilão🦹", "Personagem histórico📚", "Algo de metal🎸", "Algo relacionado ao México", "Ator/Atriz", "Ingrediente🍲",
    "Algo que se encontra no cinema🎥", "⁠Bebida🧃", "Algo macio", "Palavras terminadas em vogal", "Algo peludo🐻", "Algo que se encontra na praia",
    "Algo assustador", "País", "Objeto", "Profissão", "Item de festa🎈", "Nome", "Algo que usa pilha"
]

function StepDots({total, current} : { total: number, current: number}) {
    return (
        <div className="step-dots" aria-label={`Etapa ${current} de ${total}`}>
            {Array.from({ length: total }).map((_, index) => (
                <span key={index} className={`step-dot ${index + 1 === current ? "active" : ""}`} aria-hidden="true" />
            ))}
        </div>
    )
}

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

    const canContinue = selectedThemes.length >= 1

    function next() {
        if(!canContinue) return
        navigate("/setup/letters")
    }

    return (
        <div className="page themes">
            <header className="themes__topbar">
                <button type="button" className="themes__back" onClick={() => navigate(-1)} aria-label="Voltar">←</button>
                <StepDots total={4} current={3}/>
                <div className="themes__topbarSpacer" aria-hidden="true" />
            </header>

            <main className="themes__content">
                <div className="themes__header">
                    <h1 className="themes__title">Temas do Jogo</h1>
                    <p className="themes__subtitle">Escolha pelo menos 1 tema</p>
                </div>

                <div className="themes__list">
                    {PRESET_THEMES.map((theme) => {
                        const checked = selectedSet.has(theme)
                        return (
                            <button key={theme} type="button" className={`themes__row ${checked ? "themes__row--checked" : ""}`} onClick={() => toggleTheme(theme)}>
                                <span className={`themes__checkbox ${checked ? "is-on" : ""}`} aria-hidden="true" />
                                <span className="themes__text">{theme}</span>
                            </button>
                        )
                    })}
                </div>

                <div className="themes__custom">
                    <TextInput 
                        value={customTheme}
                        onChange={setCustomTheme}
                        placeholder="Adicionar tema personalizado"
                    />
                    <button type="button" className="themes__add" onClick={addCustomTheme} aria-label="Adicionar tema" disabled={!normalizeTheme(customTheme)}>
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

                <div className="themes__countCard">
                    <strong className="themes__countNumber">{selectedThemes.length}</strong>{" "}
                    <span className="themes__countText">
                        tema{selectedThemes.length === 1 ? "" : "s"} selecionado{selectedThemes.length === 1 ? "" : "s"}
                    </span>
                </div>
            </main>

            <footer className="themes__footer">
                <div className="themes__footerInner">
                    <Button variant="hero" disabled={!canContinue} onClick={next}>Continuar</Button>
                </div>
            </footer>
        </div>
    )
}
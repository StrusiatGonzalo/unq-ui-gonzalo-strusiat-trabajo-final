import { useRef, useState } from "react";
import { validateWord, cleanWord } from "./../utils/validations.js";
import { checkInDictionary } from "./../service/api.js"
import { useTimer } from "../hooks/useTimer";

const MESSAGES = {
    empty: "Escribí una palabra",
    multiple_words: "Escribí una sola palabra",
    invalid_format: "Solo letras (sin números ni símbolos)",
    too_short: "Mínimo 2 letras",
    does_not_chain: "No encadena con la última palabra",
    repeated: "Esa palabra ya fue usada",
    not_found: "Esa palabra no existe",
    api_error: "No pudimos verificar la palabra",
};


function Game() {

    const [input, setInput] = useState("");
    const [words, setWords] = useState([]);
    const [message, setMessage] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [gameStatus, setGameStatus] = useState("waiting"); // "waiting", "playing", "finished"

    const inputRef = useRef(null);
    const score = words.reduce((acc, w) => acc + w.display.length, 0);
    const count = words.length;
    const nextLetter = words.length > 0
        ? words[words.length - 1].clean.at(-1)
        : null;

    const { secondsLeft, start, reset: resetTimer } = useTimer(15, () => {
        setGameStatus("finished");
        setMessage("¡Fin de la partida!");
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (gameStatus === "finished") return;

        if (isVerifying) return;

        const error = validateWord(input, words);
        if (error) {
            setMessage(MESSAGES[error]);
            return;
        }

        const display = input.trim().toLowerCase();
        const clean = cleanWord(input);

        setIsVerifying(true);
        setMessage("");

        try {
            const res = await checkInDictionary(clean);
            if (res.data.exists) {
                setWords((prev) => [...prev, { display, clean }]);
                setInput("");
                setMessage("Bien!");
                setGameStatus("playing");
                start();
            } else {
                setMessage(MESSAGES.not_found);
            }
        } catch {
            setMessage(MESSAGES.api_error);
        } finally {
            setIsVerifying(false);
            inputRef.current.focus();
        }

    };

    const handleRestart = () => {
        setWords([]);
        setMessage("");
        setInput("");
        setGameStatus("waiting");
        resetTimer();

        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    };

    return (
        <div>
            <h1 className="font-title text-center">Palabras Encadenadas</h1>

            <div>
                <span>Puntaje: {score}</span>
                {" . "}
                <span>Palabras: {count}</span>
                {" . "}
                <span>Letra: {nextLetter ?? "cualquiera"}</span>
            </div>
            <div>
                <span>Tiempo: {secondsLeft}s</span>
            </div>
            <form onSubmit={handleSubmit}>
                <input type="text"
                    autoFocus
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={
                        nextLetter ? `Empieza con ${nextLetter}…` : "Escribí una palabra"
                    }
                    disabled={gameStatus === "finished"}

                />
                <button type="submit" disabled={isVerifying || gameStatus === "finished"}>
                    {isVerifying ? "Verificando…" : "Enviar"}
                </button>
            </form>

            <p>{message}</p>

            <ul>
                {words.map((w) => (
                    <li key={w.clean}>{w.display}</li>
                ))}
            </ul>
            {gameStatus === "finished" && (
                <div style={{ border: "2px solid red", padding: "10px", marginTop: "20px" }}>
                    <h2>Fin de la partida</h2>
                    <p>Encadenaste {count} palabras.</p>
                    <p>Puntaje final: {score}</p>

                    <button onClick={handleRestart}>
                        Jugar de nuevo
                    </button>
                </div>
            )}
        </div>
    );
}

export default Game;
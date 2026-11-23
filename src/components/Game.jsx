import { useRef, useState } from "react";
import { validateWord, cleanWord } from "./../utils/validations.js";
import { checkInDictionary } from "./../service/api.js"
import { useTimer } from "../hooks/useTimer";
import { useFirstVisit } from "../hooks/useFirstVisit";
import HowToPlayModal from "./HowToPlayModal";

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

    const { isOpen, closeModal, openModal } = useFirstVisit();
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
        <div className="game-container">
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h1 className="fw-bold fs-3 m-0 text-uppercase">Palabras Encadenadas</h1>
                <button className="btn-retro rounded-circle px-3 py-1 fs-5" onClick={openModal}>?</button>
            </div>

            <div className="row mb-4 g-4">
                <div className="col-6">
                    <div className="box-border p-3">
                        <span className="text-muted fw-bold small d-block mb-1">TIEMPO</span>
                        <div className="fs-1 fw-bold lh-1">
                            0:{secondsLeft.toString().padStart(2, "0")}
                        </div>
                    </div>
                </div>
                <div className="col-6">
                    <div className="box-border p-3 text-end">
                        <span className="text-muted fw-bold small d-block mb-1">PUNTAJE</span>
                        <div className="fs-1 fw-bold lh-1">{score}</div>
                    </div>
                </div>
            </div>

            <div className="time-bar-bg mb-5">
                <div
                    className={`time-bar-fill time-${secondsLeft}`}
                ></div>
            </div>

            {gameStatus === "finished" ? (
                <div className="box-border p-5 text-center mb-4">
                    <h2 className="fw-bold text-uppercase mb-3">Fin de la partida</h2>
                    <h1 className="display-1 fw-bold lh-1 mb-2">{score} Puntos</h1>
                    <p className="text-muted fs-5 mb-4">{count} palabras encadenadas</p>

                    <button
                        className="btn-retro px-5 py-3 fs-5"
                        onClick={handleRestart}
                    >
                        Jugar de nuevo
                    </button>
                </div>
            ) : (
                <div className="word-chain-container mb-3 min-h-120">
                    <div className="d-flex flex-wrap gap-3">
                        {words.length === 0 ? (
                            <p className="empty-chain-text">Tu cadena va a aparecer acá.</p>
                        ) : (
                            words.map((w, index) => {
                                const isLast = index === words.length - 1;
                                return (
                                    <div
                                        key={w.clean}
                                        className="d-flex align-items-center gap-2"
                                    >
                                        {index > 0 && <span className="chain-arrow">→</span>}

                                        <div className={`word-block ${isLast ? "active" : ""}`}>
                                            {w.display}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}

            <div className="mb-3 fw-bold fs-5 min-h-30">
                {message && (
                    <span className={message === "Bien!" ? "text-success" : "text-danger"}>
                        {message}
                    </span>
                )}
            </div>

            <form onSubmit={handleSubmit} className="d-flex gap-3 mb-5">
                <input
                    type="text"
                    className="form-control input-retro"
                    autoFocus
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={
                        nextLetter
                            ? `La próxima empieza con «${nextLetter.toUpperCase()}»...`
                            : "Escribí una palabra..."
                    }
                    disabled={gameStatus === "finished"}
                />
                <button
                    className="btn-retro px-4"
                    type="submit"
                    disabled={isVerifying || gameStatus === "finished"}
                >
                    {isVerifying ? "..." : "Enviar"}
                </button>
            </form>
            <HowToPlayModal isOpen={isOpen} onClose={closeModal} />
        </div>
    );
}

export default Game;
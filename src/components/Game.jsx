import { useRef, useState } from "react";
import { validateWord, cleanWord } from "./../utils/validations.js";
import { checkInDictionary } from "./../service/api.js"
import { useTimer } from "../hooks/useTimer";
import { useFirstVisit } from "../hooks/useFirstVisit";
import HowToPlayModal from "./HowToPlayModal";
import MetricsBar from "./MetricsBar";
import WordChain from "./WordChain";
import GameMessage from "./GameMessage";
import { useRanking } from "../hooks/useRanking";
import GameOver from "./GameOver";
import RankingModal from "./RankingModal";

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
    const [gameStatus, setGameStatus] = useState("waiting");
    const [isRankingOpen, setIsRankingOpen] = useState(false);

    const { isOpen, closeModal, openModal } = useFirstVisit();
    const inputRef = useRef(null);
    const gameIdRef = useRef(0);
    const score = words.reduce((acc, w) => acc + w.display.length, 0);
    const count = words.length;
    const nextLetter = words.length > 0
        ? words[words.length - 1].clean.at(-1)
        : null;

    const { secondsLeft, start, reset: resetTimer } = useTimer(15, () => {
        gameIdRef.current += 1;
        setGameStatus("finished");
        setMessage("¡Fin de la partida!");
    });
    const { ranking, saveScore, isTopScore } = useRanking();

    
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

        const gameId = gameIdRef.current;
        setIsVerifying(true);
        setMessage("");

        try {
            const res = await checkInDictionary(clean);
            if (gameId !== gameIdRef.current) return;

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
            if (gameId !== gameIdRef.current) return;
            setMessage(MESSAGES.api_error);
        } finally {
            setIsVerifying(false);
            if (gameId === gameIdRef.current) inputRef.current?.focus();
        }
    };

    const handleRestart = () => {
        gameIdRef.current += 1;
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
                <div className="d-flex gap-2">
                    <button className="btn-retro px-3 py-1 fs-5" onClick={() => setIsRankingOpen(true)}>
                        🏆︎
                    </button>
                    <button className="btn-retro rounded-circle px-3 py-1 fs-5" onClick={openModal}>?</button>
                </div>
            </div>
            <MetricsBar secondsLeft={secondsLeft} score={score} />
            <div className="time-bar-bg mb-5">
                <div
                    className={`time-bar-fill time-${secondsLeft}`}
                ></div>
            </div>

            {gameStatus === "finished" ? (
                <GameOver
                    score={score}
                    count={count}
                    handleRestart={handleRestart}
                    saveScore={saveScore}
                    isTopScore={isTopScore}
                />
            ) : (
                <WordChain words={words} />
            )}

            <GameMessage message={message} />

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
            <RankingModal isOpen={isRankingOpen} onClose={() => setIsRankingOpen(false)} ranking={ranking} />
        </div>
    );
}

export default Game;
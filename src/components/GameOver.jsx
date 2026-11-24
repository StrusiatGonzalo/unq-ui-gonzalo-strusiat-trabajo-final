import { useState } from "react";

function GameOver({ score, count, handleRestart, saveScore, isTopScore }) {
    const [name, setName] = useState("");
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        if (name.trim() === "") {
            alert("Por favor, ingresá un nombre para guardar.");
            return;
        }
        saveScore(name, score, count);
        setSaved(true);
    };

    return (
        <div className="box-border p-4 mb-4 text-center">
            <h2 className="fw-bold text-uppercase mb-2 fs-4">Fin de la partida</h2>
            <h1 className="display-3 fw-bold lh-1 mb-1">{score} Puntos</h1>
            <p className="text-muted mb-3">{count} palabras encadenadas</p>

            {isTopScore(score) && !saved ? (
                <div className="border border-2 border-dark p-2 mb-3 text-center">
                    <p className="fw-bold mb-2 fs-6">¡Entraste en el Top 10!</p>
                    <div className="d-flex justify-content-center gap-2">
                        <input
                            type="text"
                            className="form-control input-retro w-50 py-2"
                            placeholder="Tu nombre (máx 15)"
                            maxLength={15}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <button className="btn-retro px-3 py-2" onClick={handleSave}>
                            Guardar
                        </button>
                    </div>
                </div>
            ) : null}

            <button className="btn-retro px-4 py-2 fs-5 mt-2" onClick={handleRestart}>
                Jugar de nuevo
            </button>
        </div>
    );
}

export default GameOver;
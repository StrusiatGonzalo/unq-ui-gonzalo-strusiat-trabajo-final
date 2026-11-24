import { useState, useEffect } from "react";

const STORAGE_KEY = "palabras-encadenadas-ranking";

export function useRanking() {
    const [ranking, setRanking] = useState([]);

    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) setRanking(JSON.parse(saved));
        } catch (error) {
            console.error("Error al leer el ranking", error);
        }
    }, []);

    const saveScore = (name, score, wordsCount) => {
        const newEntry = {
            id: Date.now(),
            name: name.trim().substring(0, 15),
            score,
            wordsCount,
            date: new Date().toLocaleDateString("es-AR"),
        };

        const newRanking = [...ranking, newEntry]
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);

        setRanking(newRanking);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newRanking));
        } catch (error) {
            console.error("Error al guardar el ranking", error);
        }
    };

    const isTopScore = (score) => {
        if (score === 0) return false;
        if (ranking.length < 10) return true;
        return score > ranking[ranking.length - 1].score;
    };

    return { ranking, saveScore, isTopScore };
}
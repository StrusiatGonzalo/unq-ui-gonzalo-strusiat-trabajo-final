export const cleanWord = (word) => {
    return word.trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u0302\u0304-\u036f]/g, "")
        .normalize("NFC");
};

const isRepeatedWord = (word, usedWords = []) => {
    const cleanedWord = cleanWord(word);

    return usedWords.some((u) => u.clean === cleanedWord);
};

const isSingleWord = (word) => !/\s/.test(word); // es para ver si el jugador escribio mas de una palabra

const chainsWithLast = (word, lastWord) => {
    if (!lastWord) return true;

    const clean = cleanWord(word);
    return clean[0] === lastWord.clean[lastWord.clean.length - 1];
};

export const validateWord = (word, usedWords = []) => {
    const trimmed = word.trim();
    const lastWord = usedWords[usedWords.length - 1] ?? null;

    if (trimmed === "") return "empty";

    if (!isSingleWord(trimmed)) return "multiple_words";

    if (!/^[a-záéíóúüñ]+$/i.test(trimmed)) return "invalid_format";

    if (trimmed.length < 2) return "too_short";

    if (!chainsWithLast(trimmed, lastWord)) return "does_not_chain";

    if (isRepeatedWord(trimmed, usedWords)) return "repeated";

    return null;
};
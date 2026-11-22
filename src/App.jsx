import { useRef, useState } from "react";
import { validateWord, cleanWord } from "./validations.js";
import { checkInDictionary } from "./service/api.js"

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

function App() {

  const [input, setInput] = useState("");
  const [words, setWords] = useState([]);
  const [message, setMessage] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const inputRef = useRef(null);
  const score = words.reduce((acc, w) => acc + w.display.length, 0);
  const count = words.length;
  const nextLetter = words.length > 0
    ? words[words.length - 1].clean.at(-1)
    : null;

  const handleSubmit = async (e) => {
    e.preventDefault();

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

      <form onSubmit={handleSubmit}>
        <input type="text"
          autoFocus
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            nextLetter ? `Empieza con ${nextLetter}…` : "Escribí una palabra"
          }
          
        />
        <button type="submit" disabled={isVerifying}>
          {isVerifying ? "Verificando…" : "Enviar"}
        </button>
      </form>

      <p>{message}</p>

      <ul>
        {words.map((w) => (
          <li key={w.clean}>{w.display}</li>
        ))}
      </ul>
    </div>
  );
}

export default App
function GameMessage({ message }) {
    return (
        <div className="mb-3 fw-bold fs-5 min-h-30">
            {message && (
                <span className={message === "Bien!" ? "text-success" : "text-danger"}>
                    {message}
                </span>
            )}
        </div>
    );
}

export default GameMessage;
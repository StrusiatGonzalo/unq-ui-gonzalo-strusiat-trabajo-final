import Modal from "./Modal";

function RankingModal({ isOpen, onClose, ranking }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Mejores Puntajes">
            {ranking.length === 0 ? (
                <p className="text-muted fst-italic text-center my-4">
                    Todavía no hay puntajes guardados. ¡Jugá una partida para entrar en el Top 10!
                </p>
            ) : (
                <ol className="list-group list-group-numbered mb-3">
                    {ranking.map((r) => (
                        <li key={r.id} className="list-group-item d-flex justify-content-between align-items-center border-dark border-2 mb-1">
                            <span className="fw-bold">{r.name}</span>
                            <span className="badge bg-dark rounded-0 fs-6">{r.score} pts</span>
                        </li>
                    ))}
                </ol>
            )}

            <div className="text-center mt-4">
                <button className="btn-retro px-5 fw-bold" onClick={onClose}>
                    Cerrar
                </button>
            </div>
        </Modal>
    );
}

export default RankingModal;
import Modal from "./Modal";

function HowToPlayModal({ isOpen, onClose }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Cómo se juega">
            <ol className="mb-4 fs-5">
                <li className="mb-2">Escribí una palabra y envíala. Tenés 15 segundos por turno.</li>
                <li className="mb-2">Cada palabra nueva empieza con la última letra de la anterior.</li>
                <li className="mb-2">No se pueden repetir palabras. Cada letra suma 1 punto.</li>
                <li className="mb-2">Las palabras tienen que tener un minimo de 2 letras.</li>
            </ol>
            <p className="text-muted small mb-4">Podés volver a ver las instrucciones con el boton «?».</p>

            <div className="text-center">
                <button className="btn btn-dark rounded-0 px-5 fw-bold" onClick={onClose}>
                    Entendido
                </button>
            </div>
        </Modal>
    );
}

export default HowToPlayModal;
import { useEffect } from "react";

function Modal({ isOpen, onClose, title, children }) {

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="modal d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
            onClick={onClose}
        >
            <div
                className="modal-dialog modal-dialog-centered"
                onClick={(e) => e.stopPropagation()} // Evita que se cierre al hacer clic adentro
            >
                <div className="modal-content rounded-0 border-2 border-dark">
                    <div className="modal-header border-bottom-2 border-dark">
                        <h5 className="modal-title fw-bold text-uppercase">{title}</h5>
                    </div>
                    <div className="modal-body">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Modal;
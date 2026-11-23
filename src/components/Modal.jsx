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
            className="modal d-block modal-overlay"
            onClick={onClose}
        >
            <div
                className="modal-dialog modal-dialog-centered"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-content modal-content-retro">
                    <div className="modal-header border-bottom-0 pb-0">
                        <h5 className="modal-title fw-bold text-uppercase fs-4">{title}</h5>
                    </div>
                    <div className="modal-body fs-5">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Modal;
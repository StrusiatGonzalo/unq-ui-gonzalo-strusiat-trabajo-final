import { useState } from "react";

export function useFirstVisit() {
    const [isOpen, setIsOpen] = useState(() => {
        try {
            return !localStorage.getItem("palabras-visited");
        } catch {
            return true;
        }
    });

    const closeModal = () => {
        setIsOpen(false);
        try {
            localStorage.setItem("palabras-visited", "true");
        } catch {}
    };

    const openModal = () => setIsOpen(true);

    return { isOpen, closeModal, openModal };
}
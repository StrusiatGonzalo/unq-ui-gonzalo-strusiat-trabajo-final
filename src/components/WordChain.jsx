import { useRef, useEffect } from "react";

function WordChain({ words }) {
    const containerRef = useRef(null);

    
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [words]);

    return (
        <div 
            className="word-chain-container mb-3 min-h-120" 
            ref={containerRef} 
        >
            <div className="d-flex flex-wrap gap-3">
                {words.length === 0 ? (
                    <p className="empty-chain-text">Tu cadena va a aparecer acá.</p>
                ) : (
                    words.map((w, index) => {
                        const isLast = index === words.length - 1;
                        return (
                            <div
                                key={w.clean}
                                className="d-flex align-items-center gap-2"
                            >
                                {index > 0 && <span className="chain-arrow">→</span>}

                                <div className={`word-block ${isLast ? "active" : ""}`}>
                                    {w.display}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

export default WordChain;
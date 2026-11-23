function MetricsBar({ secondsLeft, score }) {
    return (
        <div className="row mb-4 g-4">
            <div className="col-6">
                <div className="box-border p-3">
                    <span className="text-muted fw-bold small d-block mb-1">TIEMPO</span>
                    <div className="fs-1 fw-bold lh-1">
                        0:{secondsLeft.toString().padStart(2, "0")}
                    </div>
                </div>
            </div>
            <div className="col-6">
                <div className="box-border p-3 text-end">
                    <span className="text-muted fw-bold small d-block mb-1">PUNTAJE</span>
                    <div className="fs-1 fw-bold lh-1">{score}</div>
                </div>
            </div>
        </div>
    );
}

export default MetricsBar;
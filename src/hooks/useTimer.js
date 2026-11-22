import { useState, useRef, useEffect } from "react";

export function useTimer(initialSeconds, onTimeOut) {
    const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
    const [isRunning, setIsRunning] = useState(false);

    const endTimeRef = useRef(null);
    const onTimeOutRef = useRef(onTimeOut);

    useEffect(() => {
        onTimeOutRef.current = onTimeOut;
    }, [onTimeOut]);

    const start = () => {
        endTimeRef.current = Date.now() + initialSeconds * 1000;
        setSecondsLeft(initialSeconds);
        setIsRunning(true);
    };

    const stop = () => {
        setIsRunning(false);
    };

    const reset = () => {
        setIsRunning(false);
        setSecondsLeft(initialSeconds);
        endTimeRef.current = null;
    };

    useEffect(() => {
        if (!isRunning) return;

        const intervalId = setInterval(() => {
            const now = Date.now();
            const remaining = endTimeRef.current - now;

            if (remaining <= 0) {
                setSecondsLeft(0);
                setIsRunning(false);
                if (onTimeOutRef.current) onTimeOutRef.current();
            } else {
                const newSeconds = Math.ceil(remaining / 1000);
                setSecondsLeft((prev) => (prev !== newSeconds ? newSeconds : prev));
            }
        }, 200);

        return () => clearInterval(intervalId);
    }, [isRunning, initialSeconds]);

    return { secondsLeft, isRunning, start, stop, reset };
}
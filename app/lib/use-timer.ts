// External Dependencies
import { useEffect, useRef, useState } from "react";

interface UseTimerProps {
  time?: number;
}

export const useTimer = ({ time = 30 }: UseTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(time);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const start = () => {
    if (!isRunning) setIsRunning(true);
  };

  const pause = () => {
    setIsRunning(false);
  };

  const reset = () => {
    setIsRunning(false);
    setTimeLeft(30);
  };

  const clear = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }

    if (!isRunning || timeLeft === 0) {
      clear();
    }

    return () => clear();
  }, [isRunning, timeLeft]);

  return { timeLeft, isRunning, start, pause, reset };
};

import { useState, useEffect } from "react";

const ATTEMPTS_KEY = "login_attempts";
const LOCKED_UNTIL_KEY = "locked_until";

const useLoginAttempts = () => {
  const [attempts, setAttempts] = useState(() => {
    return parseInt(localStorage.getItem(ATTEMPTS_KEY)) || 0;
  });
  const [locked, setLocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const lockedUntil = parseInt(localStorage.getItem(LOCKED_UNTIL_KEY));
    if (lockedUntil && lockedUntil > Date.now()) {
      setLocked(true);
      setTimeLeft(Math.ceil((lockedUntil - Date.now()) / 1000)); // Convertir a segundos
    }
  }, []);

  useEffect(() => {
    let timer;
    if (locked && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            setLocked(false);
            setAttempts(0);
            localStorage.removeItem(ATTEMPTS_KEY);
            localStorage.removeItem(LOCKED_UNTIL_KEY);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [locked, timeLeft]);

  const incrementAttempts = () => {
    if (locked) return;

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    localStorage.setItem(ATTEMPTS_KEY, newAttempts);

    if (newAttempts >= 3) {
      const lockTime = 20 * 1000; // 60 segundos
      const unlockTime = Date.now() + lockTime;
      localStorage.setItem(LOCKED_UNTIL_KEY, unlockTime);

      setLocked(true);
      setTimeLeft(20);
    }
  };

  return { attempts, locked, timeLeft, incrementAttempts };
};

export default useLoginAttempts;

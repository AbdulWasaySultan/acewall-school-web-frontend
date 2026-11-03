import { useState, useEffect, useRef } from "react";

export const useLoginLimiter = (key = "login-limiter") => {
  const [attempts, setAttempts] = useState(() => {
    const saved = localStorage.getItem(`${key}_attempts`);
    return saved ? parseInt(saved, 10) : 0;
  });

  const [lockoutUntil, setLockoutUntil] = useState(() => {
    const saved = localStorage.getItem(`${key}_lockoutUntil`);
    return saved ? parseInt(saved, 10) : null;
  });

  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(`${key}_attempts`, attempts.toString());
  }, [attempts, key]);

  useEffect(() => {
    if (lockoutUntil) {
      localStorage.setItem(`${key}_lockoutUntil`, lockoutUntil.toString());
    } else {
      localStorage.removeItem(`${key}_lockoutUntil`);
    }
  }, [lockoutUntil, key]);

  useEffect(() => {
    if (!lockoutUntil) {
      setTimeLeft(0);
      return;
    }

    const calculateTimeLeft = () => {
      const now = Date.now();
      return Math.max(0, Math.ceil((lockoutUntil - now) / 1000));
    };

    const initialRemaining = calculateTimeLeft();
    if (initialRemaining <= 0) {
      setLockoutUntil(null);
      setAttempts(0);
      setTimeLeft(0);
      return;
    }

    setTimeLeft(initialRemaining);

    timerRef.current = setInterval(() => {
      const remaining = calculateTimeLeft();
      if (remaining <= 0) {
        clearInterval(timerRef.current);
        setLockoutUntil(null);
        setAttempts(0);
        setTimeLeft(0);
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [lockoutUntil]);

  const recordFailedAttempt = () => {
    setAttempts((prev) => {
      const nextAttempts = prev + 1;
      if (nextAttempts >= 6) {
        setLockoutUntil(Date.now() + 30000); // 30 seconds
      }
      return nextAttempts;
    });
  };

  const resetAttempts = () => {
    setAttempts(0);
    setLockoutUntil(null);
    setTimeLeft(0);
  };

  const isLocked = timeLeft > 0;

  return {
    attempts,
    isLocked,
    timeLeft,
    recordFailedAttempt,
    resetAttempts,
  };
};

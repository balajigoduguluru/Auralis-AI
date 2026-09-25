import { useState, useCallback, useRef } from 'react';
import type { LoginStep } from '../types';

export function useAuth(onNotify: (message: string, type: 'success' | 'info') => void) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginStep, setLoginStep] = useState<LoginStep>(0);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const startLoginSequence = useCallback(() => {
    setShowLoginModal(true);
    setLoginStep(0);
    clearTimers();

    timersRef.current = [
      setTimeout(() => setLoginStep(1), 500),
      setTimeout(() => setLoginStep(2), 2000),
      setTimeout(() => setLoginStep(3), 4000),
      setTimeout(() => {
        setLoginStep(4);
        timersRef.current.push(
          setTimeout(() => {
            setIsLoggedIn(true);
            setShowLoginModal(false);
            onNotify('Satellite session established: Node-Alpha7', 'success');
          }, 1500)
        );
      }, 6000),
    ];
  }, [clearTimers, onNotify]);

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    onNotify('Session terminated. Local node only.', 'info');
  }, [onNotify]);

  const abortLogin = useCallback(() => {
    clearTimers();
    setShowLoginModal(false);
    setLoginStep(0);
  }, [clearTimers]);

  return {
    isLoggedIn,
    showLoginModal,
    loginStep,
    startLoginSequence,
    handleLogout,
    abortLogin,
    setShowLoginModal,
  };
}

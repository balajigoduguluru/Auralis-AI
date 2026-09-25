import { useState, useCallback, useRef } from 'react';
import type { Notification, NotificationType } from '../types';

export function useNotifications() {
  const [notification, setNotification] = useState<Notification | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const showNotification = useCallback((message: string, type: NotificationType = 'success') => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setNotification({ message, type });
    timerRef.current = setTimeout(() => setNotification(null), 4000);
  }, []);

  const clearNotification = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setNotification(null);
  }, []);

  return { notification, showNotification, clearNotification };
}

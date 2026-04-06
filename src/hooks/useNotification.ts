import { useState, useEffect, useCallback } from 'react';
import { NotificationService } from '../services/NotificationService';

/**
 * Custom hook for managing browser notifications.
 * Provides functionality to request permission and show notifications.
 */
export const useNotification = () => {
  // Initialize the service once
  const [notificationService] = useState(() => new NotificationService());
  // State to track the current notification permission
  const [permission, setPermission] = useState<'granted' | 'denied' | 'default'>('default');

  // Effect to set the initial permission state when the component mounts
  useEffect(() => {
    if (notificationService.isSupported()) {
      setPermission(Notification.permission);
      // Note: In most modern browsers, Notification.permission updates automatically
      // when the user changes settings. No explicit event listener is typically needed here.
      // If more robust real-time tracking were needed, one might consider using
      // a MutationObserver on the document or a custom event, but it's often overkill.
    } else {
      console.warn('Notifications are not supported on this browser.');
    }
  }, [notificationService]);

  /**
   * Requests notification permission from the user.
   * Updates the component's permission state.
   * @returns A Promise resolving to the new permission state.
   */
  const requestPermission = useCallback(async (): Promise<'granted' | 'denied' | 'default'> => {
    if (!notificationService.isSupported()) {
      return 'default';
    }
    const newPermission = await notificationService.requestPermission();
    setPermission(newPermission);
    return newPermission;
  }, [notificationService]);

  /**
   * Shows a browser notification. If permission is not granted, it attempts to request it.
   * @param title - The title of the notification.
   * @param body - The main content of the notification. If not provided, a default from the spec will be used.
   */
  const showNotification = useCallback((title: string, body?: string) => {
    if (!notificationService.isSupported()) {
      console.warn('Notifications are not supported on this browser.');
      return;
    }

    const notificationOptions: NotificationOptions = { body: body || 'Time for a 20-second break! Look 20 feet away.' };

    if (Notification.permission === 'granted') {
      notificationService.showNotification(title, notificationOptions);
    } else if (Notification.permission === 'denied') {
      console.warn('Notification permission has been denied. Cannot show notification.');
      // Optionally, provide a UI hint to the user to enable notifications in browser settings.
    } else { // 'default' - permission has not been asked yet or was dismissed
      requestPermission().then((grantedPermission) => {
        if (grantedPermission === 'granted') {
          notificationService.showNotification(title, notificationOptions);
        } else {
          console.warn('Notification permission was not granted.');
        }
      });
    }
  }, [notificationService, requestPermission]);

  return {
    isSupported: notificationService.isSupported(),
    permission,
    requestPermission,
    showNotification,
  };
};

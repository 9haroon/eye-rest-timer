/**
 * Service for interacting with the browser's Notification API.
 */
export class NotificationService {
  /**
   * Checks if the browser supports the Notification API.
   * @returns True if the Notification API is supported, false otherwise.
   */
  isSupported(): boolean {
    return 'Notification' in window;
  }

  /**
   * Requests permission from the user to display notifications.
   * @returns A Promise resolving to the permission state ('granted', 'denied', 'default').
   */
  async requestPermission(): Promise<'granted' | 'denied' | 'default'> {
    if (!this.isSupported()) {
      console.warn('Notifications are not supported in this browser.');
      return 'default';
    }
    // If permission is already granted or denied, Notification.requestPermission() will return that state immediately without prompting.
    // If it's 'default', it will prompt the user.
    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return 'default'; // Fallback if an error occurs
    }
  }

  /**
   * Displays a notification to the user.
   * @param title - The title of the notification.
   * @param options - Optional configuration for the notification (e.g., body, icon).
   */
  showNotification(title: string, options?: NotificationOptions): void {
    if (!this.isSupported()) {
      console.warn('Notifications are not supported in this browser.');
      return;
    }
    if (Notification.permission !== 'granted') {
      console.warn('Notification permission not granted. Cannot show notification.');
      // Optionally, trigger a permission request here if not already handled by the caller.
      // For this service, we assume the caller handles permission checks or requests.
      return;
    }

    try {
      // Use the provided options or a default body if none is given
      const finalOptions = {
        body: 'Time for a 20-second break! Look 20 feet away.', // Default body as per spec
        ...options,
      };
      new Notification(title, finalOptions);
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }
}

/**
 * Requests permission from the user to display notifications.
 * If permission has already been granted or denied, it returns the current state.
 * @returns A Promise that resolves with the notification permission state ('granted', 'denied', or 'default').
 */
export const requestNotificationPermission = async (): Promise<'granted' | 'denied' | 'default'> => {
  // Check if the browser supports the Notifications API
  if (!('Notification' in window)) {
    console.warn('This browser does not support desktop notification.');
    // Return 'denied' if not supported, as we cannot grant permission.
    return 'denied';
  }

  const currentPermission = Notification.permission;

  // If permission is already granted or denied, return it immediately
  if (currentPermission === 'granted' || currentPermission === 'denied') {
    return currentPermission;
  }

  // Request permission from the user
  try {
    const permission = await Notification.requestPermission();
    // The 'permission' variable will be one of 'granted', 'denied', or 'default'
    return permission as 'granted' | 'denied' | 'default';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    // In case of an unexpected error, return 'default' or 'denied'
    return 'default';
  }
};

/**
 * Displays a notification to the user.
 * This function should only be called if notification permission has been granted.
 * @param title - The title of the notification.
 * @param options - Optional configuration for the notification (e.g., body, icon, tag).
 */
export const showBreakNotification = (title: string, options?: NotificationOptions) => {
  // Ensure Notifications are supported and permission is granted before attempting to show
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    console.warn('Cannot show notification: browser does not support notifications or permission is not granted.');
    return;
  }

  try {
    const notification = new Notification(title, options);

    // Optional: Add event listener for when the notification is clicked
    notification.onclick = (event) => {
      console.log('Notification clicked:', event);
      // For example, focus the application window when the notification is clicked.
      window.focus();
      // You might want to navigate to a specific part of your app, e.g.:
      // window.open('/#break-info', '_blank');
    };

    // Optional: Add event listener for when the notification is closed by the user
    notification.onclose = () => {
      console.log('Notification closed by user.');
    };

    // Optional: Automatically close the notification after a certain period if it's a simple alert.
    // setTimeout(notification.close.bind(notification), 10000); // e.g., close after 10 seconds

    return notification;
  } catch (error) {
    console.error('Error showing notification:', error);
    return null;
  }
};

// Helper function to get the current permission status without requesting it again.
export const getNotificationPermissionStatus = (): 'granted' | 'denied' | 'default' => {
  if (!('Notification' in window)) {
    return 'denied'; // Not supported
  }
  return Notification.permission as 'granted' | 'denied' | 'default';
};

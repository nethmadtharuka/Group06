import React, { useEffect, useMemo, useState } from 'react';
import { Bell, CheckCircle, Inbox } from 'lucide-react';

const NOTIFICATIONS_KEY = 'eventcraft_notifications';
const UNREAD_KEY = 'eventcraft_has_unread_notifications';

const readNotificationsFromStorage = () => {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

const writeUnreadFlag = (hasUnread) => {
  try {
    localStorage.setItem(UNREAD_KEY, hasUnread ? 'true' : 'false');
    window.dispatchEvent(new StorageEvent('storage', { key: UNREAD_KEY, newValue: hasUnread ? 'true' : 'false' }));
  } catch (e) {
    // ignore
  }
};

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState(() => readNotificationsFromStorage());

  useEffect(() => {
    // Mark notifications as read when visiting the page
    writeUnreadFlag(false);
  }, []);

  const hasItems = useMemo(() => notifications && notifications.length > 0, [notifications]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg mb-4">
            <Bell className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-2">Stay up to date with the latest updates.</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          {hasItems ? (
            <div className="space-y-4">
              {notifications.map((n, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors">
                  <div className="flex-shrink-0 mt-0.5">
                    <CheckCircle className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-semibold">{n.title || 'Notification'}</p>
                    <p className="text-gray-600 text-sm">{n.message || String(n)}</p>
                    {n.time && <p className="text-xs text-gray-400 mt-1">{n.time}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                <Inbox className="h-7 w-7 text-gray-400" />
              </div>
              <p className="text-gray-900 font-semibold">You’re all caught up</p>
              <p className="text-gray-600 text-sm mt-1">No new notifications right now.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;



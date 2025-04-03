import { useEffect, useState } from 'react';
import { Monitor, Smartphone, Trash2, Code } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { formatDistanceToNow } from 'date-fns';

export default function SessionsSettings() {
  const { activeSessions, getActiveSessions, revokeSession } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState('');
  const [error, setError] = useState('');
  const [localSessions, setLocalSessions] = useState(activeSessions || []);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        if (!activeSessions.length) {
          await getActiveSessions();
        }
      } catch (err) {
        setError('Failed to load active sessions');
        console.error('Error fetching sessions:', err);
      }
    };

    fetchSessions();
  }, [getActiveSessions]);

  useEffect(() => {
    if (activeSessions && activeSessions.length > 0) {
      setLocalSessions(activeSessions);
    }
  }, [activeSessions]);

  const handleRevoke = async (sessionId) => {
    setIsLoading(true);
    setCurrentSessionId(sessionId);
    try {
      await revokeSession(sessionId);
      setLocalSessions((prev) => prev.filter((session) => session._id !== sessionId));
    } catch (error) {
      console.error('Failed to revoke session:', error);
      setError('Failed to revoke session');
    } finally {
      setIsLoading(false);
      setCurrentSessionId('');
    }
  };

  const getDeviceIcon = (deviceInfo) => {
    if (!deviceInfo) return <Monitor className="h-5 w-5 text-gray-400" />;

    if (/mobile|android|iphone/i.test(deviceInfo)) {
      return <Smartphone className="h-5 w-5 text-gray-400" />;
    }

    if (/postman|runtime/i.test(deviceInfo)) {
      return <Code className="h-5 w-5 text-gray-400" />;
    }

    return <Monitor className="h-5 w-5 text-gray-400" />;
  };

  const getDeviceName = (deviceInfo) => {
    if (!deviceInfo) return 'Unknown device';

    if (/chrome/i.test(deviceInfo)) return 'Chrome Browser';
    if (/firefox/i.test(deviceInfo)) return 'Firefox Browser';
    if (/safari/i.test(deviceInfo) && !/chrome/i.test(deviceInfo)) return 'Safari Browser';
    if (/edge/i.test(deviceInfo)) return 'Edge Browser';
    if (/postman/i.test(deviceInfo)) return 'Postman API Client';

    return deviceInfo.split('/')[0] || 'Unknown device';
  };

  if (!localSessions.length && !activeSessions?.length && !error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Active Sessions</h2>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Active Sessions</h2>

      {error && (
        <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-200">
          {error}
        </div>
      )}

      {!error && localSessions.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          No active sessions found
        </p>
      ) : (
        <div className="space-y-4">
          {localSessions.map((session) => (
            <div
              key={session._id}
              className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700"
            >
              <div className="flex items-center space-x-4">
                {getDeviceIcon(session.deviceInfo)}
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{getDeviceName(session.deviceInfo)}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {session.ipAddress} • Last active {formatDistanceToNow(new Date(session.lastActive))} ago
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleRevoke(session._id)}
                disabled={isLoading && currentSessionId === session._id}
                className="p-2 text-gray-400 hover:text-red-500 disabled:opacity-50"
                title="Revoke session"
              >
                {isLoading && currentSessionId === session._id ? (
                  <div className="w-5 h-5 border-2 border-t-transparent border-red-500 rounded-full animate-spin"></div>
                ) : (
                  <Trash2 className="h-5 w-5" />
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

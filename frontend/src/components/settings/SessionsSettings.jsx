import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Monitor, Smartphone, Trash2, Code } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-hot-toast';

export default function SessionsSettings() {
  const { activeSessions, getActiveSessions, revokeSession } = useAuthStore();
  const { theme } = useThemeStore();
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
        toast.error('Failed to load active sessions');
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
      toast.success('Session revoked successfully');
    } catch (error) {
      console.error('Failed to revoke session:', error);
      setError('Failed to revoke session');
      toast.error('Failed to revoke session');
    } finally {
      setIsLoading(false);
      setCurrentSessionId('');
    }
  };

  const getDeviceIcon = (deviceInfo) => {
    if (!deviceInfo) return <Monitor className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />;

    if (/mobile|android|iphone/i.test(deviceInfo)) {
      return <Smartphone className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />;
    }

    if (/postman|runtime/i.test(deviceInfo)) {
      return <Code className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />;
    }

    return <Monitor className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />;
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

  const sessionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (!localSessions.length && !activeSessions?.length && !error) {
    return (
      <div className={`
        rounded-xl backdrop-filter backdrop-blur-md shadow-lg p-6
        ${theme === 'dark' 
          ? 'bg-gray-800/70 border border-gray-700/50 text-white' 
          : 'bg-white/70 border border-gray-200/50 text-gray-800'}
      `}>
        <h2 className={`text-lg font-medium mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Active Sessions
        </h2>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`
      rounded-xl backdrop-filter backdrop-blur-md shadow-lg p-6
      ${theme === 'dark' 
        ? 'bg-gray-800/70 border border-gray-700/50 text-white' 
        : 'bg-white/70 border border-gray-200/50 text-gray-800'}
    `}>
      <h2 className={`text-lg font-medium mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        Active Sessions
      </h2>

      {error && (
        <div className={`
          p-3 mb-4 text-sm rounded-lg
          ${theme === 'dark' ? 'bg-red-900/50 text-red-200 border border-red-800/50' : 'bg-red-100/80 text-red-700 border border-red-200/50'}
          backdrop-filter backdrop-blur-sm
        `}>
          {error}
        </div>
      )}

      {!error && localSessions.length === 0 ? (
        <p className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          No active sessions found
        </p>
      ) : (
        <motion.div 
          className="space-y-4"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {localSessions.map((session) => (
            <motion.div
              key={session._id}
              variants={sessionVariants}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className={`
                flex items-center justify-between p-4 rounded-lg
                ${theme === 'dark' 
                  ? 'bg-gray-900/30 border border-gray-700/50' 
                  : 'bg-white/50 border border-gray-200/50'}
                backdrop-filter backdrop-blur-sm shadow-sm transition-all duration-300
              `}
            >
              <div className="flex items-center space-x-4">
                {getDeviceIcon(session.deviceInfo)}
                <div>
                  <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {getDeviceName(session.deviceInfo)}
                  </p>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {session.ipAddress} • Last active {formatDistanceToNow(new Date(session.lastActive))} ago
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleRevoke(session._id)}
                disabled={isLoading && currentSessionId === session._id}
                className={`
                  p-2 rounded-full transition-all duration-200
                  ${theme === 'dark' 
                    ? 'hover:bg-red-900/30 text-gray-400 hover:text-red-400' 
                    : 'hover:bg-red-100/70 text-gray-500 hover:text-red-500'}
                  disabled:opacity-50
                `}
                title="Revoke session"
              >
                {isLoading && currentSessionId === session._id ? (
                  <div className="w-5 h-5 border-2 border-t-transparent border-red-500 rounded-full animate-spin"></div>
                ) : (
                  <Trash2 className="h-5 w-5" />
                )}
              </button>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
import { useAuthStore } from '../../store/authStore';
import { useEffect, useState } from 'react';
import { Monitor, Smartphone, Trash2, Clock, MapPin } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

export default function SessionsSettings() {
  const { getActiveSessions, revokeSession } = useAuthStore();
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSessionId, setCurrentSessionId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSessions = async () => {
      setIsLoading(true);
      try {
        // Using the getActiveSessions function to fetch data
        const data = await getActiveSessions();
        setSessions(data || []);
      } catch (err) {
        setError('Failed to load sessions');
        console.error('Error loading sessions:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, [getActiveSessions]);

  const handleRevoke = async (sessionId) => {
    setCurrentSessionId(sessionId);
    try {
      await revokeSession(sessionId);
      // Filter out the revoked session from local state
      setSessions(prev => prev.filter(session => session._id !== sessionId));
    } catch (err) {
      setError('Failed to revoke session');
      console.error('Error revoking session:', err);
    } finally {
      setCurrentSessionId('');
    }
  };

  const getDeviceIcon = (deviceInfo) => {
    if (deviceInfo?.toLowerCase().includes('mobile')) {
      return <Smartphone className="h-5 w-5 text-gray-400" />;
    }
    return <Monitor className="h-5 w-5 text-gray-400" />;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
    >
      <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-6">Active Sessions</h2>
      
      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900/30 dark:text-red-200">
          {error}
        </div>
      ) : sessions?.length === 0 ? (
        <div className="text-center p-8 text-gray-500 dark:text-gray-400">
          No active sessions found.
        </div>
      ) : (
        <AnimatePresence>
          <motion.div 
            layout 
            className="space-y-4"
          >
            {sessions?.map((session) => (
              <motion.div 
                key={session._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full">
                    {getDeviceIcon(session.deviceInfo)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {session.deviceInfo || 'Unknown device'}
                    </p>
                    <div className="flex items-center space-x-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <MapPin className="h-3.5 w-3.5 mr-1" />
                        <span>{session.ipAddress || 'Unknown location'}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        <span>
                          {session.lastActive 
                            ? `Last active ${formatDistanceToNow(new Date(session.lastActive))} ago` 
                            : 'Unknown time'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleRevoke(session._id)}
                  disabled={currentSessionId === session._id}
                  className="p-2 text-gray-400 hover:text-red-500 disabled:opacity-50 transition-colors"
                >
                  {currentSessionId === session._id ? (
                    <div className="animate-spin h-5 w-5 border-2 border-red-500 border-t-transparent rounded-full"></div>
                  ) : (
                    <Trash2 className="h-5 w-5" />
                  )}
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </motion.div>
  );
}
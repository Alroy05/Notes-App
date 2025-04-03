import { useEffect, useState } from 'react';
import { Monitor, Smartphone, Trash2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { formatDistanceToNow } from 'date-fns';

export default function SessionsSettings() {
  const { activeSessions, getActiveSessions, revokeSession } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState('');

  // useEffect(() => {
  //   getActiveSessions();
  // }, [getActiveSessions]);

  // const handleRevoke = async (sessionId) => {
  //   setIsLoading(true);
  //   setCurrentSessionId(sessionId);
  //   try {
  //     await revokeSession(sessionId);
  //   } catch (error) {
  //     console.error('Failed to revoke session:', error);
  //   } finally {
  //     setIsLoading(false);
  //     setCurrentSessionId('');
  //   }
  // };

  // const getDeviceIcon = (deviceInfo) => {
  //   if (deviceInfo?.toLowerCase().includes('mobile')) {
  //     return <Smartphone className="h-5 w-5 text-gray-400" />;
  //   }
  //   return <Monitor className="h-5 w-5 text-gray-400" />;
  // };

  // if (!activeSessions) {
  //   return (
  //     <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
  //       <div className="flex justify-center py-8">
  //         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
  //       </div>
  //     </div>
  //   );
  // }

  // if (activeSessions.length === 0) {
  //   return (
  //     <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
  //       <p className="text-gray-500 dark:text-gray-400 text-center py-8">
  //         No active sessions found
  //       </p>
  //     </div>
  //   );
  // }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Active Sessions</h2>
      <p className='text-white'>Future Updates</p>
      {/* <div className="space-y-4">
        {activeSessions.map((session) => (
          <div 
            key={session._id} 
            className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700"
          >
            <div className="flex items-center space-x-4">
              {getDeviceIcon(session.deviceInfo)}
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {session.deviceInfo || 'Unknown device'}
                </p>
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
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div> */}
    </div>
  );
}
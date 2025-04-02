import { useEffect } from 'react';
import { motion } from 'framer-motion';
import ProfileSettings from '../../components/settings/ProfileSettings';
import PasswordSettings from '../../components/settings/PasswordSettings';
import SessionsSettings from '../../components/settings/SessionsSettings';
import { useAuthStore } from '../../store/authStore';

export default function Settings() {
  const { checkAuth, isLoading } = useAuthStore();
  
  useEffect(() => {
    // Ensure authentication is checked when the settings page loads
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-6"
    >
      <motion.h1 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-bold text-gray-900 dark:text-white mb-8"
      >
        Settings
      </motion.h1>
      
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <ProfileSettings />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <PasswordSettings />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <SessionsSettings />
        </motion.div>
      </div>
    </motion.div>
  );
}
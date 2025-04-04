import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Monitor } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';
import ProfileSettings from '../../components/settings/ProfileSettings';
import PasswordSettings from '../../components/settings/PasswordSettings';
import SessionsSettings from '../../components/settings/SessionsSettings';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const { theme } = useThemeStore();

  const tabs = [
    { id: 'profile', icon: User, label: 'Profile', component: <ProfileSettings /> },
    { id: 'password', icon: Lock, label: 'Password', component: <PasswordSettings /> },
    { id: 'sessions', icon: Monitor, label: 'Sessions', component: <SessionsSettings /> }
  ];

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <h1 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        Settings
      </h1>
      
      {/* Tab Navigation */}
      <div className={`
        flex border-b mb-6 backdrop-filter backdrop-blur-sm
        ${theme === 'dark' ? 'border-gray-700/50' : 'border-gray-200/50'}
      `}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex items-center px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-all duration-200
              ${activeTab === tab.id
                ? theme === 'dark'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-blue-500 text-blue-600'
                : theme === 'dark'
                  ? 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Tab Content with Animation */}
      <motion.div
        key={activeTab}
        initial="hidden"
        animate="visible"
        variants={tabVariants}
      >
        {tabs.find(tab => tab.id === activeTab)?.component}
      </motion.div>
    </div>
  );
}
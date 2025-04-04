import { useThemeStore } from '../../store/themeStore';
import { NotebookText } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AuthLayout({ children, title, subtitle }) {
  const { theme } = useThemeStore();
  
  return (
    <div className={`
      min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8
      ${theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
        : 'bg-gradient-to-br from-blue-50 to-indigo-50'}
    `}>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="flex justify-center">
          <motion.div
            whileHover={{ rotate: 5, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`
              p-3 rounded-full
              ${theme === 'dark' 
                ? 'bg-blue-600/20 backdrop-filter backdrop-blur-sm' 
                : 'bg-blue-500/10 backdrop-filter backdrop-blur-sm'}
            `}
          >
            <NotebookText className={`
              h-12 w-12
              ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} 
            />
          </motion.div>
        </div>
        
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className={`
            mt-6 text-center text-3xl font-extrabold
            ${theme === 'dark' ? 'text-white' : 'text-gray-800'}
          `}
        >
          {title}
        </motion.h2>
        
        {subtitle && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className={`
              mt-2 text-center text-sm
              ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}
            `}
          >
            {subtitle}
          </motion.p>
        )}
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className={`
          transition-all duration-300
        `}>
          {children}
        </div>
      </motion.div>
    </div>
  );
}
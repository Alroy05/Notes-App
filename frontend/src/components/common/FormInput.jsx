import React from 'react';
import { useThemeStore } from '../../store/themeStore';

const FormInput = React.forwardRef(({ label, icon, error, ...props }, ref) => {
  const { theme } = useThemeStore();
  const Icon = icon;
  
  return (
    <div>
      {label && (
        <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
          {label}
        </label>
      )}
      <div className="relative rounded-md shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
          </div>
        )}
        <input
          ref={ref}
          className={`
            block w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2 border rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
            transition-all duration-200 sm:text-sm
            ${theme === 'dark' 
              ? 'bg-gray-900/50 border-gray-700 text-white placeholder-gray-400' 
              : 'bg-white/50 border-gray-300 text-gray-900 placeholder-gray-500'}
            ${error 
              ? theme === 'dark' 
                ? 'border-red-700 focus:ring-red-500 focus:border-red-500 text-red-400' 
                : 'border-red-300 focus:ring-red-500 focus:border-red-500 text-red-900'
              : ''}
            backdrop-filter backdrop-blur-sm
          `}
          {...props}
        />
      </div>
      {error && (
        <p className={`mt-2 text-sm ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{error}</p>
      )}
    </div>
  );
});

export default FormInput;
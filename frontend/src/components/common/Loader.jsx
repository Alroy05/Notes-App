import { useThemeStore } from '../../store/themeStore';

export default function Loader({ fullScreen = false }) {
  const { theme } = useThemeStore();
  
  if (fullScreen) {
    return (
      <div className={`
        fixed inset-0 flex items-center justify-center z-50
        ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}
      `}>
        <div className={`
          p-8 rounded-xl flex flex-col items-center justify-center
          ${theme === 'dark' 
            ? 'bg-gray-800/70 border border-gray-700/50' 
            : 'bg-white/70 border border-gray-200/50'}
          backdrop-filter backdrop-blur-lg shadow-xl
        `}>
          <div className="flex space-x-2">
            <div className={`w-3 h-3 rounded-full ${theme === 'dark' ? 'bg-blue-500' : 'bg-blue-600'} animate-bounce`} style={{ animationDelay: '0ms' }}></div>
            <div className={`w-3 h-3 rounded-full ${theme === 'dark' ? 'bg-blue-500' : 'bg-blue-600'} animate-bounce`} style={{ animationDelay: '150ms' }}></div>
            <div className={`w-3 h-3 rounded-full ${theme === 'dark' ? 'bg-blue-500' : 'bg-blue-600'} animate-bounce`} style={{ animationDelay: '300ms' }}></div>
          </div>
          <p className={`mt-4 font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center p-4">
      <div className="flex space-x-2">
        <div className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-blue-500' : 'bg-blue-600'} animate-bounce`} style={{ animationDelay: '0ms' }}></div>
        <div className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-blue-500' : 'bg-blue-600'} animate-bounce`} style={{ animationDelay: '150ms' }}></div>
        <div className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-blue-500' : 'bg-blue-600'} animate-bounce`} style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );
}
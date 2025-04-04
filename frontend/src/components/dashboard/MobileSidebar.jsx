import { XCircle, Home, NotebookPen, Settings, LogOut, Plus, Moon, Sun } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { useSidebar } from '../../hooks/useSidebar';
import { toast } from 'react-hot-toast';

export default function MobileSidebar() {
  const { isOpen, closeSidebar } = useSidebar();
  const { logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();

  const navItems = [
    { to: '/', icon: Home, label: 'Dashboard' },
    { to: '/notes/new', icon: Plus, label: 'New Note' },
    { to: '/settings', icon: Settings, label: 'Settings' }
  ];

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="md:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={closeSidebar}
      ></div>
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 max-w-xs w-full z-50
        ${theme === 'dark' 
          ? 'bg-gray-900/90 border-r border-gray-700/50' 
          : 'bg-white/90 border-r border-gray-200/50'}
        backdrop-filter backdrop-blur-xl
        transition-all duration-300 shadow-xl
        flex flex-col
      `}>
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <NotebookPen className="h-7 w-7 text-blue-500" strokeWidth={2} />
            <h1 className={`ml-3 text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              Notes App
            </h1>
          </div>
          <button 
            onClick={closeSidebar}
            className={`p-2 rounded-full ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <XCircle size={24} />
          </button>
        </div>
        
        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-4">
          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={closeSidebar}
                className={({ isActive }) => `
                  flex items-center px-4 py-3 text-sm font-medium rounded-xl
                  transition-all duration-200 my-1
                  ${isActive 
                    ? theme === 'dark'
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                    : theme === 'dark'
                      ? 'text-gray-300 hover:bg-gray-800/70 hover:text-white'
                      : 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-900'
                  }
                  backdrop-filter backdrop-blur-sm
                `}
              >
                <item.icon className="mr-3 h-5 w-5 text-blue-500" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
        
        {/* Footer */}
        <div className={`
          p-4 flex items-center justify-between border-t
          ${theme === 'dark' ? 'border-gray-700/50' : 'border-gray-200/50'}
        `}>
          <button
            onClick={toggleTheme}
            className={`
              p-2 rounded-full
              ${theme === 'dark' 
                ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}
              transition-all duration-200
            `}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
          
          <button
            onClick={handleLogout}
            className={`
              flex items-center px-4 py-2 rounded-lg text-sm font-medium
              ${theme === 'dark'
                ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' 
                : 'bg-red-50 text-red-600 hover:bg-red-100'}
              transition-all duration-200
            `}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
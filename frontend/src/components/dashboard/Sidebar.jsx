import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, 
  NotebookPen, 
  Settings, 
  LogOut,
  Moon,
  Sun,
  Plus
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { toast } from 'react-hot-toast';

export default function Sidebar() {
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

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className={`
        flex flex-col w-64 
        ${theme === 'dark' 
          ? 'bg-gray-900/70 border-gray-600 text-white' 
          : 'bg-white/80 border-gray-200 text-gray-800'
        }
        backdrop-filter backdrop-blur-lg
        border-r transition-all duration-300
      `}>
        <div className="h-0 flex-1 flex flex-col pt-6 pb-4 overflow-y-auto">
          {/* Logo/Brand */}
          <div className="flex items-center flex-shrink-0 px-6 mb-6">
            <NotebookPen className="h-8 w-8 text-blue-500" strokeWidth={2} />
            <h1 className="ml-3 text-xl font-bold">Notes App</h1>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) => `
                  group flex items-center px-4 py-3 text-sm font-medium rounded-xl
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
                <item.icon
                  className={`mr-3 flex-shrink-0 h-5 w-5 
                    ${({ isActive }) => isActive
                      ? 'text-blue-500'
                      : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }
                  `}
                />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
        
        {/* Bottom section */}
        <div className={`
          flex-shrink-0 flex p-4 border-t
          ${theme === 'dark' ? 'border-gray-600' : 'border-gray-200'}
        `}>
          <button
            onClick={toggleTheme}
            className={`
              p-2 rounded-full flex items-center justify-center
              ${theme === 'dark' 
                ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }
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
              ml-auto flex items-center px-3 py-2 text-sm font-medium rounded-lg
              ${theme === 'dark'
                ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' 
                : 'bg-red-50 text-red-600 hover:bg-red-100'
              }
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
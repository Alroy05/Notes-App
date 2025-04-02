import { NavLink,useNavigate } from 'react-router-dom';
import { 
  Home, 
  NotebookPen, 
  Settings, 
  LogOut,
  Moon,
  Sun
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useTheme } from '../../hooks/useTheme';

export default function Sidebar() {
  const { logout } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const navItems = [
    { to: '/', icon: Home, label: 'Dashboard' },
    { to: '/settings', icon: Settings, label: 'Settings' }
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="h-0 flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          {/* Logo/Brand */}
          <div className="flex items-center flex-shrink-0 px-4">
            <NotebookPen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <h1 className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
              Notes App
            </h1>
          </div>
          
          {/* Navigation */}
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end
                className={({ isActive }) => `
                  group flex items-center px-2 py-2 text-sm font-medium rounded-md
                  ${isActive 
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                  }
                `}
              >
                <item.icon
                  className={`mr-3 flex-shrink-0 h-5 w-5 
                    ${item.to === '/dashboard' ? 'text-blue-500' : 'text-gray-400'}
                  `}
                />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
        
        {/* Bottom section */}
        <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center w-full">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-yellow-400" />
              ) : (
                <Moon className="h-5 w-5 text-gray-500" />
              )}
            </button>
            <button
              onClick={handleLogout}
              className="ml-auto flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              <LogOut className="mr-2 h-5 w-5" />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
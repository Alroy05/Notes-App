import { X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
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
import { useSidebar } from '../../hooks/useSidebar';

export default function MobileSidebar() {
  const { logout } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const { sidebarOpen, toggleSidebar } = useSidebar();

  const navItems = [
    { to: '/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/dashboard/notes', icon: NotebookPen, label: 'Notes' },
    { to: '/dashboard/settings', icon: Settings, label: 'Settings' }
  ];

  if (!sidebarOpen) return null;

  return (
    <div className="md:hidden">
      <div className="fixed inset-0 flex z-40">
        <div className="fixed inset-0">
          <div 
            className="absolute inset-0 bg-gray-600 opacity-75"
            onClick={toggleSidebar}
          />
        </div>
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800">
          <div className="absolute top-0 right-0 -mr-14 p-1">
            <button
              className="flex items-center justify-center h-12 w-12 rounded-full focus:outline-none focus:ring-2 focus:ring-white"
              onClick={toggleSidebar}
            >
              <X className="h-6 w-6 text-white" />
              <span className="sr-only">Close sidebar</span>
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <NotebookPen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <h1 className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                Notes App
              </h1>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end
                  className={({ isActive }) => `
                    group flex items-center px-2 py-2 text-base font-medium rounded-md
                    ${isActive 
                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                    }
                  `}
                  onClick={toggleSidebar}
                >
                  <item.icon
                    className={`mr-4 flex-shrink-0 h-6 w-6 
                      ${item.to === '/dashboard' ? 'text-blue-500' : 'text-gray-400'}
                    `}
                  />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center">
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
                onClick={logout}
                className="ml-auto flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                <LogOut className="mr-2 h-5 w-5" />
                Sign out
              </button>
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 w-14">
          {/* Force sidebar to shrink to fit close icon */}
        </div>
      </div>
    </div>
  );
}
import { Menu, Search, Bell, User } from 'lucide-react';
import { useSidebar } from '../../hooks/useSidebar';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const { toggleSidebar } = useSidebar();
  const { user } = useAuthStore();
  const { theme } = useThemeStore();
  const navigate = useNavigate();

  return (
    <div className={`
      relative z-10 flex-shrink-0 flex h-16
      ${theme === 'dark'
        ? 'bg-gray-900/60 border-b border-gray-700/50'
        : 'bg-white/60 border-b border-gray-200/50'}
      backdrop-filter backdrop-blur-lg
    `}>
      {/* Mobile sidebar toggle */}
      <button
        type="button"
        className={`
          px-4 border-r focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden
          ${theme === 'dark'
            ? 'border-gray-700/50 text-gray-300 hover:text-white'
            : 'border-gray-200/50 text-gray-500 hover:text-gray-900'}
        `}
        onClick={toggleSidebar}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" />
      </button>
      
      {/* Search bar */}
      <div className="flex-1 px-4 flex justify-between">
        <div className="flex-1 flex items-center max-w-md mx-auto md:mx-0">
          <div className="w-full">
            <label htmlFor="search" className="sr-only">
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
              <input
                id="search"
                name="search"
                className={`
                  block w-full pl-10 pr-3 py-2 rounded-lg leading-5 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 
                  ${theme === 'dark'
                    ? 'bg-gray-800/70 placeholder-gray-400 text-white border-gray-600'
                    : 'bg-gray-100/70 border-gray-200 placeholder-gray-500 text-gray-900'}
                  backdrop-filter backdrop-blur-sm
                  transition-all duration-200
                `}
                placeholder="Search..."
                type="search"
              />
            </div>
          </div>
        </div>
        
        {/* Right side icons */}
        <div className="ml-4 flex items-center md:ml-6">
          <button
            type="button"
            className={`
              p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500
              ${theme === 'dark'
                ? 'text-gray-400 hover:text-gray-200 bg-gray-800/50'
                : 'text-gray-500 hover:text-gray-700 bg-gray-100/50'}
              transition-all duration-200
            `}
          >
            <span className="sr-only">View notifications</span>
            <Bell className="h-5 w-5" />
          </button>
          
          {/* Profile dropdown */}
          <div className="ml-3 relative">
            <button 
            onClick={() => {navigate('/settings')}}
            type="button"
            className={`
              flex items-center p-1 rounded-full cursor-pointer
              ${theme === 'dark' ? 'bg-gray-800/70' : 'bg-gray-100/70'}
              backdrop-filter backdrop-blur-sm
            `}>
              <div className={`h-8 w-8 rounded-full ${user?.profilePic ?"bg-transparent": "bg-blue-500"} flex items-center justify-center text-white font-medium shadow-md`}>
                {user?.profilePic ? 
                <div>
                  <img 
                    src={user.profilePic} 
                    alt={user.fullName} 
                    className={`rounded-full object-cover border-2 shadow-md
                      ${theme === 'dark' ? 'border-gray-700/70' : 'border-gray-200/70'}
                    `}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/80?text=User";
                    }}
                  />
              </div> 
              :user?.fullName?.charAt(0)}
              </div>
              <span className={`
                ml-2 mr-2 text-sm font-medium hidden md:block
                ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}
              `}>
                {user?.fullName || 'User'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
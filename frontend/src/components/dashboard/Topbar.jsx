import { Menu, Search, Bell, User } from 'lucide-react';
import { useSidebar } from '../../hooks/useSidebar';
import { useAuthStore } from '../../store/authStore';

export default function Topbar() {
  const { toggleSidebar } = useSidebar();
  const { user } = useAuthStore();

  return (
    <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow dark:bg-gray-800 dark:border-b dark:border-gray-700">
      {/* Mobile sidebar toggle */}
      <button
        type="button"
        className="px-4 border-r border-gray-200 dark:border-gray-700 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden"
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
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="search"
                name="search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="Search"
                type="search"
              />
            </div>
          </div>
        </div>
        
        {/* Right side icons */}
        <div className="ml-4 flex items-center md:ml-6">
          <button
            type="button"
            className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:hover:text-gray-300"
          >
            <span className="sr-only">View notifications</span>
            <Bell className="h-6 w-6" />
          </button>
          
          {/* Profile dropdown */}
          <div className="ml-3 relative">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                {user?.fullName?.charAt(0) || <User size={16} />}
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 hidden md:block">
                {user?.fullName || 'User'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
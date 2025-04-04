import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import MobileSidebar from './MobileSidebar';
import { useThemeStore } from '../../store/themeStore';

export default function DashboardLayout() {
  const { theme } = useThemeStore();

  return (
    <>
      <MobileSidebar />
      <div className={`
        flex h-screen overflow-hidden
        ${theme === 'dark' 
          ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
          : 'bg-gradient-to-br from-blue-50 to-indigo-50'}
      `}>
        <Sidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Topbar />
          
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className={`
              h-fit rounded-xl
              ${theme === 'dark' 
                ? 'bg-gray-900/30' 
                : 'bg-white/40'}
              backdrop-filter backdrop-blur-md
              border
              ${theme === 'dark' ? 'border-gray-700/50' : 'border-gray-200/50'}
              shadow-lg
            `}>
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
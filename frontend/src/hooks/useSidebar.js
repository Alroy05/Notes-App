import { useState } from 'react';

export function useSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return { sidebarOpen, toggleSidebar };
}
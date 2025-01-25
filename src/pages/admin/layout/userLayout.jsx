import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { UserSidebar } from '../../../components/user/components/UserSidebar';
import { Menu } from 'lucide-react';

export function UserLayout() {
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <UserSidebar show={showSidebar} onClose={() => setShowSidebar(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-md h-16 flex items-center px-4">
          <button
            onClick={toggleSidebar}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-semibold text-gray-800 ml-4">User Dashboard</h1>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-4 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}


import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { LayoutDashboard, Music, Calendar, Image, MessageSquare, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout, isLoading } = useAuth();

  const handleLogout = () => {
    logout();
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-circus-dark">
        <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-gray-800"></div>
      </div>
    );
  }

  const NavItem = ({ to, icon: Icon, label }) => (
    <Link
      to={to}
      className="flex items-center gap-3 px-4 py-3 text-circus-cream hover:bg-circus-dark/30 rounded-md transition-colors"
      onClick={() => setIsSidebarOpen(false)}
    >
      <Icon size={20} className="text-circus-cream" />
      <span>{label}</span>
    </Link>
  );

  return (
    <div className="flex h-screen bg-gradient-to-b from-circus-cream to-white">
      {/* Mobile Sidebar Toggle */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-circus-dark text-gray-300 rounded-md"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed md:static md:block z-40 h-full w-64 bg-circus-dark p-4 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center mb-8 pt-2">
            <h1 className="font-circus text-2xl text-circus-cream">Admin Panel</h1>
          </div>

          <div className="flex-1 flex flex-col gap-1">
            <NavItem to="/admin/dashboard" icon={LayoutDashboard} label="Dashboard" />
            <NavItem to="/admin/tracks" icon={Music} label="Music Tracks" />
            <NavItem to="/admin/events" icon={Calendar} label="Events" />
            {/* Band Members removed */}
            <NavItem to="/admin/gallery" icon={Image} label="Gallery" />
            <NavItem to="/admin/messages" icon={MessageSquare} label="Contact Messages" />
          </div>

          <div className="mt-auto pt-4 border-t border-circus-dark/30">
            <div className="px-4 py-2 text-circus-cream">
              <p className="text-sm">Logged in as:</p>
              <p className="font-bold text-circus-cream">{user?.username}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 w-full text-left text-circus-cream hover:bg-circus-dark/30 rounded-md transition-colors"
            >
              <LogOut size={20} className="text-circus-red" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-circus-cream to-white text-gray-900 admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 
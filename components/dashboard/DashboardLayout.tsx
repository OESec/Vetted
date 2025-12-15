import React, { useState } from 'react';
import { LayoutDashboard, FileText, Settings, LogOut, Plus, ShieldCheck, ChartPie } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
  activeTab: 'overview' | 'reports' | 'upload' | 'settings';
  onTabChange: (tab: 'overview' | 'reports' | 'upload' | 'settings') => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  onLogout, 
  activeTab, 
  onTabChange 
}) => {
  return (
    <div className="flex h-screen bg-neutralLight overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-neutralDark text-white hidden md:flex flex-col border-r border-gray-800">
        <div className="p-6 flex items-center space-x-2 border-b border-gray-800">
          <ShieldCheck className="text-primary" size={24} />
          <span className="text-xl font-serif font-bold">Vetted</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => onTabChange('upload')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'upload' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
          >
            <Plus size={20} />
            <span className="font-medium">New Audit</span>
          </button>

          <div className="pt-4 pb-2 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Management
          </div>

          <button 
            onClick={() => onTabChange('overview')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </button>

          <button 
            onClick={() => onTabChange('reports')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'reports' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
          >
            <FileText size={20} />
            <span className="font-medium">Reports</span>
          </button>
          
          <button 
            onClick={() => onTabChange('settings')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'settings' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
          >
            <Settings size={20} />
            <span className="font-medium">Settings</span>
          </button>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center space-x-3 px-4 py-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">JD</div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">John Doe</p>
              <p className="text-xs text-gray-400 truncate">Acme Inc.</p>
            </div>
            <button onClick={onLogout} className="text-gray-400 hover:text-white">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm z-10">
          <h1 className="text-xl font-bold text-neutralDark capitalize">
            {activeTab === 'overview' && 'Review Sets Overview'}
            {activeTab === 'reports' && 'All Reports'}
            {activeTab === 'upload' && 'New Audit Analysis'}
            {activeTab === 'settings' && 'Platform Settings'}
          </h1>
          <div className="flex items-center space-x-4">
             <button className="md:hidden p-2 text-neutralDark">
                <LayoutDashboard />
             </button>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
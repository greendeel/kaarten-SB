import React from 'react';
import { EventStatus, SyncStatus } from '../types';
import { Users, Play, Trophy, ChevronLeft, Cloud, CloudOff, CloudSync } from 'lucide-react';

interface NavigationProps {
  currentStatus: EventStatus;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onExit: () => void;
  title: string;
  syncStatus: SyncStatus;
}

const Navigation: React.FC<NavigationProps> = ({ 
  currentStatus, 
  activeTab, 
  onTabChange, 
  onExit, 
  title,
  syncStatus 
}) => {
  const tabs = [
    { id: 'REGISTRATION', label: 'Deelnemers', icon: Users },
    { id: 'ROUND1', label: 'Ronde 1', icon: Play },
    { id: 'ROUND2', label: 'Ronde 2', icon: Play },
    { id: 'RESULTS', label: 'Uitslag', icon: Trophy },
  ];

  const isLocked = (status: string) => {
    const order = ['REGISTRATION', 'ROUND1', 'ROUND2', 'RESULTS'];
    const currentOrder = order.indexOf(currentStatus);
    const tabOrder = order.indexOf(status);
    return tabOrder > currentOrder;
  };

  const getSyncIcon = () => {
    switch (syncStatus) {
      case 'online': return <Cloud size={22} className="text-green-400" title="Verbonden met cloud" />;
      case 'syncing': return <CloudSync size={22} className="text-yellow-400 animate-pulse" title="Synchroniseren..." />;
      case 'error': return <CloudOff size={22} className="text-red-400" title="Verbindingsfout" />;
      default: return <CloudOff size={22} className="text-slate-500" title="Lokaal (Geen cloud)" />;
    }
  };

  return (
    <nav className="sticky top-0 z-[999] bg-slate-900 text-white shadow-xl print:hidden">
      
      {/* Bovenbalk iets compacter */}
      <div className="flex items-center justify-between px-4 py-1 border-b-2 border-slate-950">
        <button 
          onClick={onExit}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-xl border-2 border-slate-600 font-black transition-all active:scale-95 text-yellow-400 group cursor-pointer"
        >
          <ChevronLeft size={18} />
          <span className="text-lg uppercase tracking-wider">Menu</span>
        </button>

        <h1 className="text-lg font-black uppercase tracking-tight truncate px-3 text-white max-w-[50%]">
          {title || "Kaartavond"}
        </h1>

        <div className="flex items-center justify-center w-10 h-8">
          {getSyncIcon()}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-800 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const locked = isLocked(tab.id);
          const active = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              disabled={locked}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 min-w-[120px] py-3 flex flex-col items-center gap-1 border-b-4 transition-all ${
                active 
                ? 'border-blue-500 bg-slate-700 text-blue-400'   // 🔵 Actieve tab nu blauw
                : locked 
                  ? 'border-transparent text-slate-600 opacity-50 cursor-not-allowed' 
                  : 'border-transparent text-slate-400 hover:bg-slate-700'
              }`}
            >
              <Icon size={22} />
              <span className="text-sm font-black uppercase tracking-tighter">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;


import React from 'react';
import { EventStatus } from '../types';
import { Users, Play, Trophy, ChevronLeft } from 'lucide-react';

interface NavigationProps {
  currentStatus: EventStatus;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onExit: () => void;
  title: string;
}

const Navigation: React.FC<NavigationProps> = ({ currentStatus, activeTab, onTabChange, onExit, title }) => {
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

  return (
    <nav className="sticky top-0 z-[999] bg-slate-900 text-white shadow-xl print:hidden">
      {/* Bovenste bar */}
      <div className="flex items-center justify-between px-4 py-1.5 border-b-2 border-slate-950">
        <button 
          onClick={onExit}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-1 rounded-xl border-2 border-slate-600 font-black transition-all active:scale-95 text-yellow-400 group cursor-pointer"
        >
          <ChevronLeft size={20} />
          <span className="text-xl uppercase tracking-wider">Menu</span>
        </button>
        <h1 className="text-xl font-black uppercase tracking-tight truncate px-3 text-white max-w-[50%]">
          {title || "Kaartavond"}
        </h1>
        {/* Ruimte voor sync-indicator */}
        <div className="w-12" />
      </div>
      
      {/* Tab bar */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-slate-950">
        {tabs.map((tab) => {
          const locked = isLocked(tab.id);
          const active = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              disabled={locked}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex flex-col items-center justify-center py-1.5 px-1 rounded-xl border-b-4 transition-all
                ${locked ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer'}
                ${active ? 'bg-blue-600 border-yellow-400 scale-105 z-10' : 'bg-slate-800 border-slate-700'}
              `}
            >
              <Icon size={24} className={active ? 'text-white' : 'text-slate-400'} />
              <span className={`text-sm font-black uppercase mt-0.5 text-center leading-tight ${active ? 'text-white' : 'text-slate-400'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;

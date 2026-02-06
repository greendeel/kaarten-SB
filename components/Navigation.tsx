import React from 'react';

interface NavigationProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export default function Navigation({ currentView, onNavigate }: NavigationProps) {
  return (
    <div className="w-full bg-gray-800 text-white">

      {/* 🔽 BOVENSTE BALK — 25% MINDER HOOG (alleen padding aangepast) */}
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={() => onNavigate('dashboard')}
          className="text-xl font-bold"
        >
          ☰ Menu
        </button>

        <div className="text-lg font-semibold">
          Kaartmiddag
        </div>

        <div className="w-10" /> {/* spacer zodat titel gecentreerd blijft */}
      </div>

      {/* ONDERSTE TAB-NAVIGATIE (ONGEWIJZIGD) */}
      <div className="flex justify-around bg-gray-700 py-2 text-sm">
        <button
          onClick={() => onNavigate('registration')}
          className={`px-3 py-2 rounded ${
            currentView === 'registration' ? 'bg-green-600' : 'bg-gray-600'
          }`}
        >
          Deelnemers
        </button>

        <button
          onClick={() => onNavigate('tables')}
          className={`px-3 py-2 rounded ${
            currentView === 'tables' ? 'bg-green-600' : 'bg-gray-600'
          }`}
        >
          Tafels
        </button>

        <button
          onClick={() => onNavigate('rounds')}
          className={`px-3 py-2 rounded ${
            currentView === 'rounds' ? 'bg-green-600' : 'bg-gray-600'
          }`}
        >
          Scores
        </button>

        <button
          onClick={() => onNavigate('results')}
          className={`px-3 py-2 rounded ${
            currentView === 'results' ? 'bg-green-600' : 'bg-gray-600'
          }`}
        >
          Uitslag
        </button>
      </div>
    </div>
  );
}

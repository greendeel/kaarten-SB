import React, { useState } from 'react';
import { CardEvent } from '../types';
import { PlusCircle, Calendar, Trash2, Play } from 'lucide-react';

interface DashboardViewProps {
  events: CardEvent[];
  onSelectEvent: (id: string) => void;
  onCreateEvent: (name: string) => void;
  onDeleteEvent: (id: string) => void;
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({
  events,
  onSelectEvent,
  onCreateEvent,
  onDeleteEvent
}) => {
  const [newName, setNewName] = useState('');

  const handleCreate = () => {
    if (newName.trim()) {
      onCreateEvent(newName.trim());
      setNewName('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newName.trim()) {
      handleCreate();
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-10 pb-20">

      {/* NIEUWE KAARTMIDDAG */}
      <div className="bg-white p-8 rounded-[3rem] border-4 border-blue-200 shadow-xl space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex p-4 bg-blue-100 rounded-full text-blue-600">
            <PlusCircle size={48} />
          </div>
          <h2 className="text-4xl font-black text-slate-800 uppercase">
            Nieuwe Kaartmiddag
          </h2>
          <p className="text-2xl text-slate-500 font-bold">
            Hoe noemen we deze middag?
          </p>
        </div>

        <div className="space-y-6 max-w-2xl mx-auto">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Bijv: 15 Februari"
            className="w-full text-4xl p-6 border-4 border-slate-100 rounded-3xl outline-none focus:border-blue-500 text-center font-black bg-slate-50 text-slate-900 shadow-inner"
          />

          <button
            onClick={handleCreate}
            disabled={!newName.trim()}
            className={`w-full py-6 rounded-3xl text-4xl font-black shadow-2xl border-b-[10px] flex items-center justify-center gap-5 transition-all ${
              !newName.trim()
                ? 'bg-slate-200 text-slate-400 border-slate-300'
                : 'bg-green-600 text-white border-green-800 hover:bg-green-700 active:translate-y-1 active:border-b-4'
            }`}
          >
            <Play size={36} fill="currentColor" className="shrink-0" />
            <span>STARTEN</span>
          </button>
        </div>
      </div>

      {/* EERDERE MIDDAGEN */}
      <div className="space-y-6">
        <h3 className="text-2xl font-black text-slate-600 uppercase tracking-widest text-center">
          Eerdere Middagen
        </h3>

        {events.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-[3rem] border-4 border-dashed border-slate-200">
            <p className="text-slate-400 font-bold text-2xl">
              Nog geen middagen opgeslagen.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-5">
            {events.slice().reverse().map(event => (
              <div
                key={event.id}
                className="bg-white border-4 border-slate-200 rounded-[2.5rem] p-6 shadow-lg hover:border-blue-400 transition-all"
              >
                <button
                  onClick={() => onSelectEvent(event.id)}
                  className="text-left w-full"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="text-blue-500 shrink-0" size={24} />
                    <p className="text-2xl font-black text-slate-800 truncate">
                      {event.title || event.date}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-slate-500">
                      {event.participants.length} spelers
                    </span>
                    <span className={`text-xs font-black px-3 py-1 rounded-full uppercase ${
                      event.status === 'RESULTS'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                      {event.status === 'RESULTS' ? 'Klaar' : 'Bezig'}
                    </span>
                  </div>
                </button>

                <div className="mt-4 text-right border-t pt-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Zeker weten verwijderen?')) {
                        onDeleteEvent(event.id);
                      }
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={24} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardView;

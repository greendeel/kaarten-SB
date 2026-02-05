
import React, { useState, useMemo } from 'react';
import { Participant, GameType } from '../types';
import { LIST_A, LIST_B } from '../constants';
import { Trash2, Zap, Users, Lock, ArrowLeftRight } from 'lucide-react';

interface RegistrationViewProps {
  participants: Participant[];
  customNames: { Jokeren: string[], Rikken: string[] };
  onAddParticipant: (name: string, game: GameType) => void;
  onRemoveParticipant: (id: string) => void;
  onUpdateParticipantGame: (id: string, newGame: GameType) => void;
  onStartRound: () => void;
  isLocked: boolean;
}

const RegistrationView: React.FC<RegistrationViewProps> = ({ 
  participants,
  customNames,
  onAddParticipant, 
  onRemoveParticipant, 
  onUpdateParticipantGame,
  onStartRound,
  isLocked
}) => {
  const [activeGame, setActiveGame] = useState<GameType>('Jokeren');
  const [nameInput, setNameInput] = useState('');

  const jokerenCount = participants.filter(p => p.game === 'Jokeren').length;
  const rikkenCount = participants.filter(p => p.game === 'Rikken').length;

  const availableNames = useMemo(() => {
    const staticList = activeGame === 'Jokeren' ? LIST_A : LIST_B;
    const masterList = activeGame === 'Jokeren' ? customNames.Jokeren : customNames.Rikken;
    const nameMap = new Map<string, string>();
    [...staticList, ...masterList].forEach(name => {
      const lower = name.toLowerCase().trim();
      if (!nameMap.has(lower)) nameMap.set(lower, name.trim());
    });
    return Array.from(nameMap.values()).sort((a, b) => a.localeCompare(b));
  }, [activeGame, customNames]);

  const handleAdd = (name: string) => {
    if (isLocked) return;
    const trimmed = name.trim();
    if (!trimmed) return;
    const exists = participants.find(p => p.name.toLowerCase() === trimmed.toLowerCase());
    if (exists) return;
    
    onAddParticipant(trimmed, activeGame);
    setNameInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd(nameInput);
    }
  };

  const handleSwitchGame = (participant: Participant) => {
    const nextGame = participant.game === 'Jokeren' ? 'Rikken' : 'Jokeren';
    onUpdateParticipantGame(participant.id, nextGame);
  };

  return (
    <div className="pb-48 select-none">
      {isLocked && (
        <div className="bg-amber-100 border-b-4 border-amber-400 p-4 flex items-center justify-center gap-4">
          <Lock className="text-amber-600" size={24} />
          <span className="text-xl font-black text-amber-800 uppercase tracking-widest">Aanmelding gesloten voor deze middag</span>
        </div>
      )}

      {!isLocked && (
        <div className="bg-slate-200 p-4 flex flex-col items-center gap-3 border-b-4 border-slate-300">
          <h2 className="text-xl font-black text-slate-700 uppercase tracking-widest">STAP 1: KIES HET SPEL</h2>
          <div className="grid grid-cols-2 gap-4 w-full max-w-xl">
            <button 
              onClick={() => setActiveGame('Jokeren')}
              className={`py-3 px-6 rounded-[2rem] border-4 transition-all flex flex-col items-center gap-1 ${activeGame === 'Jokeren' ? 'bg-purple-700 text-white border-purple-950 shadow-xl scale-105' : 'bg-white text-purple-700 border-slate-300 opacity-60'}`}
            >
              <Zap size={32} fill={activeGame === 'Jokeren' ? 'white' : 'none'} />
              <span className="text-2xl font-black uppercase">JOKEREN</span>
              <span className="text-lg font-bold">{jokerenCount} Spelers</span>
            </button>
            <button 
              onClick={() => setActiveGame('Rikken')}
              className={`py-3 px-6 rounded-[2rem] border-4 transition-all flex flex-col items-center gap-1 ${activeGame === 'Rikken' ? 'bg-orange-600 text-white border-orange-900 shadow-xl scale-105' : 'bg-white text-orange-600 border-slate-300 opacity-60'}`}
            >
              <Zap size={32} fill={activeGame === 'Rikken' ? 'white' : 'none'} />
              <span className="text-2xl font-black uppercase">RIKKEN</span>
              <span className="text-lg font-bold">{rikkenCount} Spelers</span>
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto p-4 space-y-8">
        {!isLocked && (
          <>
            <div className="text-center space-y-1">
               <h2 className="text-xl font-black text-slate-500 uppercase tracking-widest">STAP 2: KLIK OP DE NAMEN</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {availableNames.map(name => {
                const p = participants.find(p => p.name.toLowerCase() === name.toLowerCase());
                const isAdded = !!p;
                return (
                  <button
                    key={name}
                    disabled={isAdded}
                    onClick={() => handleAdd(name)}
                    className={`p-4 rounded-2xl border-2 font-black text-xl transition-all h-24 flex items-center justify-center text-center shadow-sm ${
                      isAdded 
                      ? 'bg-slate-100 border-slate-200 text-slate-300' 
                      : `bg-white border-slate-200 text-slate-800 hover:border-${activeGame === 'Jokeren' ? 'purple' : 'orange'}-500 active:scale-95`
                    }`}
                  >
                    {name}
                  </button>
                );
              })}
              <div className="col-span-full mt-4 bg-white p-6 rounded-[2rem] border-2 border-blue-100 shadow-md space-y-3">
                <h3 className="text-xl font-black text-blue-800 uppercase text-center">Nieuwe naam toevoegen?</h3>
                <div className="flex gap-3 max-w-3xl mx-auto">
                  <input 
                    type="text"
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Typ hier de naam..."
                    className="flex-1 p-4 text-2xl border-4 border-slate-100 rounded-2xl font-black text-slate-900 outline-none focus:border-blue-500 bg-slate-50"
                  />
                  <button 
                    onClick={() => handleAdd(nameInput)}
                    disabled={!nameInput.trim()}
                    className="bg-blue-600 text-white px-8 rounded-2xl text-4xl font-black border-b-[6px] border-blue-800 active:border-b-0 active:translate-y-1"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="space-y-4 pt-6">
          <h2 className="text-2xl font-black text-slate-800 uppercase flex items-center gap-3">
            <Users size={32} className="text-blue-600" /> Deelnemers ({participants.length})
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
             <div className="bg-purple-50 p-4 rounded-[2rem] border-2 border-purple-200">
               <h3 className="text-xl font-black text-purple-700 uppercase mb-3">Jokeren ({jokerenCount})</h3>
               <div className="space-y-2">
                 {participants.filter(p => p.game === 'Jokeren').map(p => (
                   <div key={p.id} className="bg-white p-3 rounded-xl flex justify-between items-center shadow-sm border border-purple-100">
                     <span className="text-2xl font-black text-slate-700">{p.name}</span>
                     {!isLocked && (
                       <div className="flex items-center gap-1">
                         <button 
                           onClick={() => handleSwitchGame(p)}
                           className="text-purple-600 hover:bg-purple-100 p-2 rounded-xl transition-colors"
                         >
                           <ArrowLeftRight size={24}/>
                         </button>
                         <button onClick={() => onRemoveParticipant(p.id)} className="text-red-400 p-2 hover:bg-red-50 rounded-xl transition-colors"><Trash2 size={24}/></button>
                       </div>
                     )}
                   </div>
                 ))}
               </div>
             </div>
             <div className="bg-orange-50 p-4 rounded-[2rem] border-2 border-orange-200">
               <h3 className="text-xl font-black text-orange-700 uppercase mb-3">Rikken ({rikkenCount})</h3>
               <div className="space-y-2">
                 {participants.filter(p => p.game === 'Rikken').map(p => (
                   <div key={p.id} className="bg-white p-3 rounded-xl flex justify-between items-center shadow-sm border border-orange-100">
                     <span className="text-2xl font-black text-slate-700">{p.name}</span>
                     {!isLocked && (
                       <div className="flex items-center gap-1">
                         <button 
                           onClick={() => handleSwitchGame(p)}
                           className="text-orange-600 hover:bg-orange-100 p-2 rounded-xl transition-colors"
                         >
                           <ArrowLeftRight size={24}/>
                         </button>
                         <button onClick={() => onRemoveParticipant(p.id)} className="text-red-400 p-2 hover:bg-red-50 rounded-xl transition-colors"><Trash2 size={24}/></button>
                       </div>
                     )}
                   </div>
                 ))}
               </div>
             </div>
          </div>
        </div>
      </div>

      {!isLocked && (
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-100 to-transparent pointer-events-none">
          <div className="max-w-md mx-auto pointer-events-auto">
            <button
              onClick={onStartRound}
              disabled={participants.length === 0}
              className={`w-full py-6 rounded-[2rem] text-3xl font-black border-b-[10px] shadow-xl transition-all uppercase ${participants.length > 0 ? 'bg-green-600 border-green-900 text-white hover:bg-green-700 active:translate-y-2 active:border-b-4' : 'bg-slate-300 border-slate-400 text-slate-500 opacity-50'}`}
            >
              OPSLAAN & START
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationView;

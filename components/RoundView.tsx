// Alleen het aangepaste stuk laten zien is niet genoeg, dus hier volledig bestand

import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Participant, GameType, Round, Table } from '../types';
import { AlertCircle, CheckCircle2, Calculator, ArrowLeftRight, RefreshCw } from 'lucide-react';

interface RoundViewProps {
  round: Round;
  participants: Participant[];
  onScoreChange: (pid: string, score: number) => void;
  onFinishRound: () => void;
  onResetTables: () => void;
  onUpdateParticipantTable: (pid: string, newTableNum: number) => void;
  isScoring: boolean;
  setIsScoring: (val: boolean) => void;
  isEventFinished: boolean;
}

const RoundView: React.FC<RoundViewProps> = ({
  round,
  participants,
  onScoreChange,
  onFinishRound,
  onResetTables,
  onUpdateParticipantTable,
  isScoring,
  setIsScoring,
  isEventFinished
}) => {
  const [localScores, setLocalScores] = useState<Record<string, string>>({});
  const tablesContainerRef = useRef<HTMLDivElement>(null);

  const jokerenTables = useMemo(() => round.tables.filter(t => t.game === 'Jokeren'), [round.tables]);
  const rikkenTables = useMemo(() => round.tables.filter(t => t.game === 'Rikken'), [round.tables]);
  const isSideBySide = jokerenTables.length === 1 && rikkenTables.length === 1;

  const getTableSum = (table: Table) =>
    table.participantIds.reduce((sum, pid) => sum + (round.scores[pid] || 0), 0);

  const handleInputChange = (pid: string, value: string) => {
    setLocalScores(prev => ({ ...prev, [pid]: value }));
    const parsed = parseInt(value);
    onScoreChange(pid, isNaN(parsed) ? 0 : parsed);
  };

  const renderGameSection = (game: GameType) => {
    const gameTables = game === 'Jokeren' ? jokerenTables : rikkenTables;
    if (gameTables.length === 0) return null;

    return (
      <div className="space-y-6">
        <h3 className={`text-2xl font-black px-8 py-3 rounded-2xl text-white inline-block shadow-md ${game === 'Jokeren' ? 'bg-purple-700' : 'bg-orange-600'}`}>
          {game}
        </h3>

        <div className={`grid grid-cols-1 ${isSideBySide ? '' : 'xl:grid-cols-2'} gap-8`}>
          {gameTables.map((table, idx) => (
            <div key={table.id} className="bg-white border-4 rounded-[2.5rem] overflow-hidden shadow-xl border-slate-200">
              <div className="bg-slate-50 px-8 py-4 border-b-2 border-slate-200 flex justify-between items-center">
                <h4 className="font-black text-3xl uppercase text-slate-700">Tafel {idx + 1}</h4>
              </div>

              <div className="divide-y-2 divide-slate-100">
                {table.participantIds.map(pid => {
                  const player = participants.find(p => p.id === pid);
                  const score = round.scores[pid];
                  const localValue = localScores[pid] ?? (score?.toString() || '');
                  if (!player) return null;

                  return (
                    <div key={pid} className={`flex items-center justify-between ${isScoring ? 'py-2' : 'py-4'} px-6 bg-white hover:bg-slate-50 transition-all gap-4`}>
                      <p className="font-black text-2xl text-slate-800 flex-1">{player.name}</p>

                      {isScoring ? (
                        <input
                          type="number"
                          value={localValue}
                          onChange={(e) => handleInputChange(pid, e.target.value)}
                          className="w-24 h-16 text-3xl font-black text-center border-4 rounded-2xl border-slate-100 focus:border-blue-400 bg-slate-50"
                        />
                      ) : (
                        <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center border-2 border-blue-100">
                          <span className="text-2xl font-black">{score || 0}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 max-w-[1400px] mx-auto space-y-10 pb-48">
      <div ref={tablesContainerRef} className={isSideBySide ? "grid grid-cols-1 lg:grid-cols-2 gap-10" : "space-y-12"}>
        {renderGameSection('Jokeren')}
        {renderGameSection('Rikken')}
      </div>
    </div>
  );
};

export default RoundView;


import React, { useState, useEffect, useRef } from 'react';
import { CardEvent, Participant, EventStatus, GameType, Round, Table } from './types';
import { generateId } from './services/storage';
import { LIST_A, LIST_B } from './constants';
import DashboardView from './components/DashboardView';
import RegistrationView from './components/RegistrationView';
import RoundView from './components/RoundView';
import ResultsView from './components/ResultsView';
import Navigation from './components/Navigation';
import TableAssignmentView from './components/TableAssignmentView';
import LoginView from './components/LoginView';

const CLUB_CODE = '26091976';
const LOCAL_STORAGE_KEY = 'kaarten_sb_v9_local';

const App: React.FC = () => {
  const [events, setEvents] = useState<CardEvent[]>([]);
  const [customNames, setCustomNames] = useState<{ Jokeren: string[], Rikken: string[] }>({ Jokeren: [], Rikken: [] });
  const [lastModified, setLastModified] = useState<number>(0);
  
  const [activeEventId, setActiveEventId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('REGISTRATION');
  const [isScoring, setIsScoring] = useState(false);
  const [editingRound, setEditingRound] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => localStorage.getItem('kajuit_auth') === 'true');
  
  const isInitialized = useRef(false);

  // Initialisatie: Laad opgeslagen data
  useEffect(() => {
    if (isInitialized.current) return;
    const local = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (local) {
      try {
        const parsed = JSON.parse(local);
        setEvents(parsed.events || []);
        setCustomNames(parsed.customNames || { Jokeren: [], Rikken: [] });
        setLastModified(parsed.lastModified || 0);
      } catch (e) { 
        console.error("Lokaal laden mislukt, we starten met een schone lei."); 
      }
    }
    isInitialized.current = true;
  }, []);

  // Sla data op
  const persist = (newEvents: CardEvent[], newNames: { Jokeren: string[], Rikken: string[] }) => {
    const newTimestamp = Date.now();
    const data = { events: newEvents, customNames: newNames, lastModified: newTimestamp };
    
    setEvents(newEvents);
    setCustomNames(newNames);
    setLastModified(newTimestamp);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  };

  // --- Export / Import Handlers ---
  const handleExport = () => {
    const data = { events, customNames, lastModified };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kaartavond_gegevens_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (json && (json.events || json.customNames)) {
          if (confirm('Weet u zeker dat u dit bestand wilt inladen? Dit vervangt alle huidige gegevens op dit apparaat.')) {
            persist(json.events || [], json.customNames || { Jokeren: [], Rikken: [] });
            alert('Gegevens succesvol geïmporteerd!');
          }
        } else {
          alert('Het geselecteerde bestand bevat geen geldige kaartavond gegevens.');
        }
      } catch (err) {
        alert('Er is een fout opgetreden bij het lezen van het bestand.');
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset input
  };

  // --- Handlers ---
  const formatName = (name: string) => {
    if (!name) return "";
    return name.trim().split(/\s+/).map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  };

  const createEvent = (title: string) => {
    const newEvent: CardEvent = {
      id: generateId(),
      title: formatName(title),
      date: new Date().toLocaleDateString('nl-NL'),
      status: EventStatus.REGISTRATION,
      participants: [],
      rounds: []
    };
    persist([...events, newEvent], customNames);
    setActiveEventId(newEvent.id);
    setActiveTab('REGISTRATION');
  };

  const deleteEvent = (id: string) => {
    if (!confirm('Wilt u deze middag definitief verwijderen?')) return;
    const updated = events.filter(e => e.id !== id);
    persist(updated, customNames);
    if (activeEventId === id) setActiveEventId(null);
  };

  const addParticipant = (name: string, game: GameType) => {
    const ev = events.find(e => e.id === activeEventId);
    if (!ev) return;
    const formattedName = formatName(name);
    if (ev.participants.some(p => p.name.toLowerCase() === formattedName.toLowerCase())) return;

    const newParticipant = { id: generateId(), name: formattedName, game };
    const updatedEvents = events.map(e => e.id === activeEventId ? { ...e, participants: [...e.participants, newParticipant] } : e);
    
    let updatedNames = { ...customNames };
    const staticList = game === 'Jokeren' ? LIST_A : LIST_B;
    if (!staticList.some(n => n.toLowerCase() === formattedName.toLowerCase())) {
      if (!customNames[game].some(n => n.toLowerCase() === formattedName.toLowerCase())) {
        updatedNames = { ...customNames, [game]: [...customNames[game], formattedName] };
      }
    }
    persist(updatedEvents, updatedNames);
  };

  const removeParticipant = (id: string) => {
    const updatedEvents = events.map(e => e.id === activeEventId ? { ...e, participants: e.participants.filter(p => p.id !== id) } : e);
    persist(updatedEvents, customNames);
  };

  const updateParticipantGame = (id: string, newGame: GameType) => {
    const updatedEvents = events.map(e => e.id === activeEventId ? { ...e, participants: e.participants.map(p => p.id === id ? { ...p, game: newGame } : p) } : e);
    persist(updatedEvents, customNames);
  };

  const startRound1 = () => {
    const updatedEvents = events.map(e => e.id === activeEventId ? { ...e, status: EventStatus.ROUND1, rounds: [{ number: 1, tables: [], scores: {} }] } : e);
    persist(updatedEvents, customNames);
    setActiveTab('ROUND1');
    setIsScoring(false);
  };

  const setRoundTables = (roundIdx: number, tables: Table[]) => {
    const updatedEvents = events.map(e => {
      if (e.id === activeEventId) {
        const newRounds = [...e.rounds];
        if (newRounds[roundIdx]) newRounds[roundIdx] = { ...newRounds[roundIdx], tables };
        return { ...e, rounds: newRounds };
      }
      return e;
    });
    persist(updatedEvents, customNames);
    setEditingRound(null);
  };

  const updateParticipantTable = (pid: string, newTableNum: number) => {
    const roundIdx = activeTab === 'ROUND1' ? 0 : 1;
    const updatedEvents = events.map(e => {
      if (e.id === activeEventId) {
        const round = e.rounds[roundIdx];
        if (!round) return e;
        const participant = e.participants.find(p => p.id === pid);
        if (!participant) return e;

        const newTables = round.tables.map(table => ({
          ...table,
          participantIds: table.participantIds.filter(id => id !== pid)
        })).filter(table => table.participantIds.length > 0);

        let targetTable = newTables.find((t, idx) => t.game === participant.game && (idx + 1) === newTableNum);
        if (targetTable) targetTable.participantIds.push(pid);
        else newTables.push({ id: generateId(), game: participant.game, participantIds: [pid] });

        const newRounds = [...e.rounds];
        newRounds[roundIdx] = { ...round, tables: newTables };
        return { ...e, rounds: newRounds };
      }
      return e;
    });
    persist(updatedEvents, customNames);
  };

  const updateScore = (pid: string, score: number) => {
    const roundIdx = activeTab === 'ROUND1' ? 0 : 1;
    const updatedEvents = events.map(e => {
      if (e.id === activeEventId) {
        const newRounds = [...e.rounds];
        if (newRounds[roundIdx]) {
          newRounds[roundIdx] = { ...newRounds[roundIdx], scores: { ...newRounds[roundIdx].scores, [pid]: score } };
        }
        return { ...e, rounds: newRounds };
      }
      return e;
    });
    persist(updatedEvents, customNames);
  };

  const finishRound1 = () => {
    const updatedEvents = events.map(e => e.id === activeEventId ? { ...e, status: EventStatus.ROUND2, rounds: [...e.rounds, { number: 2, tables: [], scores: {} }] } : e);
    persist(updatedEvents, customNames);
    setActiveTab('ROUND2');
    setIsScoring(false);
  };

  const finishRound2 = () => {
    const updatedEvents = events.map(e => e.id === activeEventId ? { ...e, status: EventStatus.RESULTS } : e);
    persist(updatedEvents, customNames);
    setActiveTab('RESULTS');
  };

  const handleUnlock = (code: string) => {
    if (code.trim() === CLUB_CODE) {
      setIsAuthenticated(true);
      localStorage.setItem('kajuit_auth', 'true');
    } else alert('Onjuiste clubcode.');
  };

  const activeEvent = events.find(e => e.id === activeEventId);

  if (!isAuthenticated) return <LoginView onUnlock={handleUnlock} />;

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 select-none print:bg-white print:h-auto overflow-x-hidden">
      {!activeEventId ? (
        <DashboardView 
          events={events} onCreateEvent={createEvent} 
          onSelectEvent={(id) => {
            const ev = events.find(e => e.id === id);
            if (ev) { setActiveEventId(id); setActiveTab(ev.status); setIsScoring(false); setEditingRound(null); }
          }} 
          onDeleteEvent={deleteEvent}
          onExport={handleExport}
          onImport={handleImport}
        />
      ) : (
        <>
          <Navigation 
            currentStatus={activeEvent.status} activeTab={activeTab}
            onTabChange={(tab) => { setActiveTab(tab); setIsScoring(false); setEditingRound(null); }}
            onExit={() => setActiveEventId(null)} title={activeEvent.title}
          />
          
          <main className="flex-1 overflow-y-auto print:overflow-visible print:block relative">
            {activeTab === 'REGISTRATION' && (
              <RegistrationView 
                participants={activeEvent.participants} customNames={customNames}
                onAddParticipant={addParticipant} onRemoveParticipant={removeParticipant}
                onUpdateParticipantGame={updateParticipantGame} onStartRound={startRound1}
                isLocked={activeEvent.status !== EventStatus.REGISTRATION}
              />
            )}
            {(activeTab === 'ROUND1' || activeTab === 'ROUND2') && (
              <div className="pb-24">
                {activeTab === 'ROUND1' && activeEvent.rounds[0] && (
                  (activeEvent.rounds[0].tables.length === 0 || editingRound === 0) ? (
                    <TableAssignmentView 
                      participants={activeEvent.participants}
                      initialTables={activeEvent.rounds[0].tables}
                      onConfirm={(tables) => setRoundTables(0, tables)}
                      onUpdateParticipantGame={updateParticipantGame}
                      roundNumber={1}
                    />
                  ) : (
                    <RoundView 
                      round={activeEvent.rounds[0]} participants={activeEvent.participants}
                      onScoreChange={updateScore} onFinishRound={finishRound1}
                      onResetTables={() => setEditingRound(0)} onUpdateParticipantTable={updateParticipantTable}
                      isScoring={isScoring} setIsScoring={setIsScoring}
                      isEventFinished={activeEvent.status === EventStatus.RESULTS}
                    />
                  )
                )}
                {activeTab === 'ROUND2' && activeEvent.rounds[1] && (
                  (activeEvent.rounds[1].tables.length === 0 || editingRound === 1) ? (
                    <TableAssignmentView 
                      participants={activeEvent.participants}
                      initialTables={activeEvent.rounds[1].tables}
                      onConfirm={(tables) => setRoundTables(1, tables)}
                      onUpdateParticipantGame={updateParticipantGame}
                      roundNumber={2}
                    />
                  ) : (
                    <RoundView 
                      round={activeEvent.rounds[1]} participants={activeEvent.participants}
                      onScoreChange={updateScore} onFinishRound={finishRound2}
                      onResetTables={() => setEditingRound(1)} onUpdateParticipantTable={updateParticipantTable}
                      isScoring={isScoring} setIsScoring={setIsScoring}
                      isEventFinished={activeEvent.status === EventStatus.RESULTS}
                    />
                  )
                )}
              </div>
            )}
            {activeTab === 'RESULTS' && (
              <ResultsView 
                participants={activeEvent.participants} rounds={activeEvent.rounds}
                title={activeEvent.title} onClose={() => setActiveEventId(null)} 
              />
            )}
          </main>
        </>
      )}
    </div>
  );
};

export default App;

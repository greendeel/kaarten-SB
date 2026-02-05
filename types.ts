
export type GameType = 'Jokeren' | 'Rikken';

export enum EventStatus {
  REGISTRATION = 'REGISTRATION',
  ROUND1 = 'ROUND1',
  ROUND2 = 'ROUND2',
  RESULTS = 'RESULTS'
}

export interface Participant {
  id: string;
  name: string;
  game: GameType;
  isNew?: boolean;
}

export interface Table {
  id: string;
  game: GameType;
  participantIds: string[];
}

export interface Round {
  number: number;
  tables: Table[];
  scores: Record<string, number>; // participantId -> score
}

export interface CardEvent {
  id: string;
  title: string;
  date: string;
  status: EventStatus;
  participants: Participant[];
  rounds: Round[];
}

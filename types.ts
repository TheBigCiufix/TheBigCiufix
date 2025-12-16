export interface User {
  id: string;
  name: string;
  avatar: string;
}

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  MAYBE = 'MAYBE',
  ABSENT = 'ABSENT',
}

export interface Attendance {
  userId: string;
  status: AttendanceStatus;
  note?: string; // e.g., "Arrivo dopo cena", "Porto il dolce"
}

export interface FaellinoEvent {
  id: string;
  date: string; // ISO Date string YYYY-MM-DD
  title: string;
  type: 'DINNER' | 'MAGIC' | 'PS5' | 'CHILL';
  attendees: Attendance[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isLoading?: boolean;
}

export interface MTGPlayer {
  id: number;
  name: string;
  life: number;
  commanderDamage: number;
  poison: number;
  color: string;
}
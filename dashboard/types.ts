
export enum BotStatus {
  RUNNING = 'RUNNING',
  STOPPED = 'STOPPED',
  STARTING = 'STARTING',
  RESTARTING = 'RESTARTING',
  ERROR = 'ERROR'
}

export interface User {
  id: string;
  name: string;
  profilePic: string;
  coverVideo: string;
}

export interface BotFeature {
  id: string;
  name: string;
  enabled: boolean;
  description: string;
}

export interface GroupControl {
  id: string;
  name: string;
  active: boolean;
  memberCount: number;
}

export interface ApiEntry {
  id: string;
  name: string;
  key: string;
  status: 'active' | 'inactive';
}

export interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
}

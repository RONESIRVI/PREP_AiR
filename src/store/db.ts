import Dexie, { type EntityTable } from 'dexie';

export interface FocusSession {
  id?: number;
  start_time: number;
  end_time: number;
  duration_min: number;
  mode: 'TIMER' | 'POMODORO';
  tag_id: number;
  completed: boolean;
}

export interface AppLimit {
  id?: number;
  package_name: string;
  app_name: string;
  daily_limit_min: number;
  strict_until: number;
  is_blocked_shorts: boolean;
}

export interface Tag {
  id?: number;
  name: string;
  color_hex: string;
  goal_min: number;
  icon: string;
}

export interface Schedule {
  id?: number;
  tag_id: number;
  start_epoch: number;
  end_epoch: number;
  block_apps: string; // JSON string of packages
}

class PrepAirDB extends Dexie {
  focus_sessions!: EntityTable<FocusSession, 'id'>;
  app_limits!: EntityTable<AppLimit, 'id'>;
  tags!: EntityTable<Tag, 'id'>;
  schedules!: EntityTable<Schedule, 'id'>;

  constructor() {
    super('PrepAirDB');
    this.version(1).stores({
      focus_sessions: '++id, start_time, end_time, tag_id, completed',
      app_limits: '++id, package_name',
      tags: '++id, name',
      schedules: '++id, tag_id, start_epoch, end_epoch'
    });
  }
}

export const db = new PrepAirDB();

export async function seedDatabase() {
  const tagsCount = await db.tags.count();
  if (tagsCount === 0) {
    await db.tags.bulkAdd([
      { name: 'Physics', color_hex: 'bg-amber', goal_min: 120, icon: '⚛️' },
      { name: 'Maths', color_hex: 'bg-blue', goal_min: 90, icon: '📐' },
      { name: 'Chemistry', color_hex: 'bg-rose', goal_min: 60, icon: '🧪' },
      { name: 'Revision', color_hex: 'bg-lime', goal_min: 45, icon: '📚' },
    ]);
    console.log('Database seeded with default tags.');
  }
}

// Call seed on initialization
seedDatabase().catch(console.error);

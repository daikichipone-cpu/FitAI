export enum Gender {
  Male = '男性',
  Female = '女性',
  Other = 'その他'
}

export enum PersonaType {
  FatBurn = 'FAT_BURN',
  Hypertrophy = 'HYPERTROPHY',
  Wellness = 'WELLNESS'
}

export interface UserProfile {
  gender: Gender;
  age: number;
  height: number;
  weight: number;
  cravings: string;
  mood: string;
}

export interface WorkoutItem {
  exerciseName: string;
  details: string; // Sets / Reps / Rest
  reason: string; // Point
}

export interface AIResponse {
  trainerMessage: string;
  menuList: WorkoutItem[];
  dietAndMentalAdvice: string;
}

export const PERSONA_CONFIG = {
  [PersonaType.FatBurn]: {
    id: PersonaType.FatBurn,
    name: 'ダイエット重視 (Fat Burn)',
    description: 'カロリー消費最大化。少しスパルタな励まし。',
    color: 'red',
    icon: 'flame',
    themeClass: 'from-orange-500 to-red-600'
  },
  [PersonaType.Hypertrophy]: {
    id: PersonaType.Hypertrophy,
    name: '筋力アップ (Hypertrophy)',
    description: '高負荷・低回数。熱血体育会系。',
    color: 'blue',
    icon: 'dumbbell',
    themeClass: 'from-blue-600 to-indigo-700'
  },
  [PersonaType.Wellness]: {
    id: PersonaType.Wellness,
    name: 'バランス・健康 (Wellness)',
    description: '無理のない強度で健康維持。親切丁寧。',
    color: 'emerald',
    icon: 'leaf',
    themeClass: 'from-emerald-400 to-teal-600'
  }
};
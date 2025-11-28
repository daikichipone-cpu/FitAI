import React from 'react';
import { UserProfile, Gender } from '../types';
import { User, Cake, Smile } from 'lucide-react';

interface InputFormProps {
  user: UserProfile;
  onChange: (field: keyof UserProfile, value: string | number) => void;
}

const InputForm: React.FC<InputFormProps> = ({ user, onChange }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
      <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
        <User className="w-5 h-5 text-indigo-500" />
        プロフィール
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">性別</label>
          <select
            value={user.gender}
            onChange={(e) => onChange('gender', e.target.value as Gender)}
            className="w-full rounded-lg border-slate-200 border p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          >
            <option value={Gender.Male}>男性</option>
            <option value={Gender.Female}>女性</option>
            <option value={Gender.Other}>その他</option>
          </select>
        </div>

        {/* Age */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">年齢</label>
          <input
            type="number"
            value={user.age}
            onChange={(e) => onChange('age', parseInt(e.target.value) || 0)}
            className="w-full rounded-lg border-slate-200 border p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          />
        </div>

        {/* Height */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">身長 (cm)</label>
          <input
            type="number"
            value={user.height}
            onChange={(e) => onChange('height', parseInt(e.target.value) || 0)}
            className="w-full rounded-lg border-slate-200 border p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          />
        </div>

        {/* Weight */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">体重 (kg)</label>
          <input
            type="number"
            value={user.weight}
            onChange={(e) => onChange('weight', parseInt(e.target.value) || 0)}
            className="w-full rounded-lg border-slate-200 border p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          />
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* Dynamic Inputs */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1 flex items-center gap-2">
            <Cake className="w-4 h-4 text-pink-500" />
            今日食べたい物
          </label>
          <input
            type="text"
            value={user.cravings}
            onChange={(e) => onChange('cravings', e.target.value)}
            placeholder="例: ラーメン、ステーキ、サラダ..."
            className="w-full rounded-lg border-slate-200 border p-3 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1 flex items-center gap-2">
            <Smile className="w-4 h-4 text-yellow-500" />
            今の気分
          </label>
          <input
            type="text"
            value={user.mood}
            onChange={(e) => onChange('mood', e.target.value)}
            placeholder="例: やる気満々、少し疲れている、ストレス発散したい..."
            className="w-full rounded-lg border-slate-200 border p-3 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all"
          />
        </div>
      </div>
    </div>
  );
};

export default InputForm;
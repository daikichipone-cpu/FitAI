import React from 'react';
import { AIResponse, PersonaType, PERSONA_CONFIG } from '../types';
import { MessageSquareQuote, CheckSquare, Utensils, Zap, PlayCircle, RefreshCw } from 'lucide-react';

interface ResultCardProps {
  result: AIResponse;
  persona: PersonaType;
  onReset: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ result, persona, onReset }) => {
  const config = PERSONA_CONFIG[persona];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header / Trainer Message */}
      <div className={`rounded-2xl bg-gradient-to-r ${config.themeClass} p-1 shadow-lg`}>
        <div className="bg-white rounded-xl p-6 md:p-8">
          <div className="flex items-start gap-4">
             <div className={`p-3 rounded-full bg-${config.color}-100 text-${config.color}-600 shrink-0`}>
                <MessageSquareQuote className="w-8 h-8" />
             </div>
             <div>
                <h3 className={`text-lg font-bold text-${config.color}-700 mb-2`}>トレーナーからのメッセージ</h3>
                <p className="text-slate-700 text-lg leading-relaxed whitespace-pre-wrap">
                  {result.trainerMessage}
                </p>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Workout Menu */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Zap className={`w-6 h-6 text-${config.color}-500 fill-current`} />
            本日のメニュー
          </h3>
          
          <div className="space-y-4">
            {result.menuList.map((item, index) => (
              <div key={index} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start gap-4 mb-2">
                  <h4 className="text-lg font-bold text-slate-800">{item.exerciseName}</h4>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold bg-${config.color}-50 text-${config.color}-700 border border-${config.color}-100`}>
                    #{index + 1}
                  </span>
                </div>
                
                <div className="bg-slate-50 rounded-lg p-3 mb-3 flex items-center gap-3">
                  <PlayCircle className="w-5 h-5 text-slate-400" />
                  <span className="font-mono font-semibold text-slate-700">{item.details}</span>
                </div>

                <div className="flex items-start gap-2 text-sm text-slate-600">
                  <CheckSquare className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <p>{item.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Side Advice */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Utensils className="w-6 h-6 text-orange-500" />
            食事・メンタル
          </h3>

          <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
              {result.dietAndMentalAdvice}
            </p>
          </div>
          
           <button
            onClick={onReset}
            className="w-full py-4 rounded-xl border-2 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 hover:border-slate-300 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            設定を変更して再生成
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
import React, { useState } from 'react';
import { Dumbbell, Sparkles, Loader2 } from 'lucide-react';
import InputForm from './components/InputForm';
import PersonaSelector from './components/PersonaSelector';
import ResultCard from './components/ResultCard';
import { UserProfile, Gender, PersonaType, AIResponse } from './types';
import { generateTrainerPlan } from './services/geminiService';

const App: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    gender: Gender.Male,
    age: 25,
    height: 170,
    weight: 65,
    cravings: '',
    mood: ''
  });

  const [selectedPersona, setSelectedPersona] = useState<PersonaType>(PersonaType.FatBurn);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AIResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUserChange = (field: keyof UserProfile, value: string | number) => {
    setUserProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!userProfile.cravings || !userProfile.mood) {
        setError("「食べたい物」と「今の気分」を入力してください");
        return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await generateTrainerPlan(userProfile, selectedPersona);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "予期せぬエラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Dumbbell className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">FitGenius AI</h1>
          </div>
          <div className="hidden sm:flex text-sm font-medium text-slate-500 items-center gap-1">
             Powered by Gemini <Sparkles className="w-4 h-4 text-indigo-500" />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        
        {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-2">
                <span className="font-bold">Error:</span> {error}
            </div>
        )}

        {!result ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-800 mb-2">本日のトレーニングを作成</h2>
                <p className="text-slate-500">
                    あなたの体調や気分、食べたいものに合わせて<br className="hidden sm:block"/>
                    AIトレーナーが最適なメニューを提案します。
                </p>
            </div>

            <InputForm user={userProfile} onChange={handleUserChange} />
            
            <PersonaSelector selectedPersona={selectedPersona} onSelect={setSelectedPersona} />

            <div className="pt-4">
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg shadow-indigo-200 transition-all transform hover:scale-[1.01] active:scale-[0.99]
                    ${isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}
                `}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    メニューを作成中...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    トレーニングプランを生成
                  </span>
                )}
              </button>
            </div>
          </div>
        ) : (
          <ResultCard 
            result={result} 
            persona={selectedPersona} 
            onReset={handleReset} 
          />
        )}
      </main>
    </div>
  );
};

export default App;
import React from 'react';
import { PersonaType, PERSONA_CONFIG } from '../types';
import { Flame, Dumbbell, Leaf, CheckCircle2 } from 'lucide-react';

interface PersonaSelectorProps {
  selectedPersona: PersonaType;
  onSelect: (persona: PersonaType) => void;
}

const PersonaSelector: React.FC<PersonaSelectorProps> = ({ selectedPersona, onSelect }) => {
  const getIcon = (persona: PersonaType) => {
    switch (persona) {
      case PersonaType.FatBurn: return <Flame className="w-8 h-8" />;
      case PersonaType.Hypertrophy: return <Dumbbell className="w-8 h-8" />;
      case PersonaType.Wellness: return <Leaf className="w-8 h-8" />;
    }
  };

  return (
    <div className="space-y-4">
       <h2 className="text-xl font-bold text-slate-800">トレーナーを選択</h2>
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.values(PERSONA_CONFIG).map((config) => {
          const isSelected = selectedPersona === config.id;
          return (
            <button
              key={config.id}
              onClick={() => onSelect(config.id as PersonaType)}
              className={`relative overflow-hidden rounded-2xl border-2 p-6 text-left transition-all duration-200 group
                ${isSelected 
                  ? `border-${config.color}-500 bg-${config.color}-50 ring-2 ring-${config.color}-200 ring-offset-1` 
                  : 'border-slate-100 bg-white hover:border-slate-300 hover:shadow-md'
                }
              `}
            >
              {isSelected && (
                <div className={`absolute top-3 right-3 text-${config.color}-600`}>
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              )}
              
              <div className={`mb-4 inline-flex items-center justify-center rounded-full p-3 
                ${isSelected ? `bg-${config.color}-100 text-${config.color}-600` : 'bg-slate-100 text-slate-500'}
              `}>
                {getIcon(config.id as PersonaType)}
              </div>

              <h3 className={`font-bold text-lg mb-2 ${isSelected ? `text-${config.color}-900` : 'text-slate-800'}`}>
                {config.name}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                {config.description}
              </p>
            </button>
          );
        })}
       </div>
    </div>
  );
};

export default PersonaSelector;
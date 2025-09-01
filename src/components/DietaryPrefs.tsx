/**
 * DietaryPrefs Component
 * Allows users to select their dietary preferences/restrictions
 */

import React from 'react';
import { Leaf, Heart, Wheat, Milk } from 'lucide-react';
import { DietaryPreferences } from '../lib/ai';

interface DietaryPrefsProps {
  preferences: DietaryPreferences;
  onChange: (preferences: DietaryPreferences) => void;
}

export function DietaryPrefs({ preferences, onChange }: DietaryPrefsProps) {
  const handleToggle = (key: keyof DietaryPreferences) => {
    onChange({
      ...preferences,
      [key]: !preferences[key]
    });
  };

  const dietaryOptions = [
    {
      key: 'vegetarian' as const,
      label: 'Vegetarian',
      description: 'No meat or fish',
      icon: Leaf,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      key: 'vegan' as const,
      label: 'Vegan',
      description: 'No animal products',
      icon: Heart,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200'
    },
    {
      key: 'glutenFree' as const,
      label: 'Gluten-Free',
      description: 'No wheat, barley, rye',
      icon: Wheat,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200'
    },
    {
      key: 'dairyFree' as const,
      label: 'Dairy-Free',
      description: 'No milk products',
      icon: Milk,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
        Dietary Preferences (Optional)
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {dietaryOptions.map((option) => {
          const isSelected = preferences[option.key];
          const Icon = option.icon;
          
          return (
            <button
              key={option.key}
              onClick={() => handleToggle(option.key)}
              className={`
                relative p-4 rounded-lg border-2 transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
                ${isSelected 
                  ? `${option.bgColor} ${option.borderColor} shadow-sm` 
                  : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }
              `}
              type="button"
              role="checkbox"
              aria-checked={isSelected}
              aria-label={`Toggle ${option.label} preference`}
            >
              <div className="flex items-start space-x-3">
                <Icon 
                  className={`
                    w-6 h-6 mt-0.5 transition-colors
                    ${isSelected ? option.color : 'text-gray-400'}
                  `} 
                />
                
                <div className="flex-1 text-left">
                  <h4 className={`
                    font-medium transition-colors
                    ${isSelected ? 'text-gray-800' : 'text-gray-600'}
                  `}>
                    {option.label}
                  </h4>
                  <p className={`
                    text-sm transition-colors
                    ${isSelected ? 'text-gray-600' : 'text-gray-500'}
                  `}>
                    {option.description}
                  </p>
                </div>
                
                {/* Checkmark indicator */}
                <div className={`
                  w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                  ${isSelected 
                    ? 'bg-primary border-primary' 
                    : 'border-gray-300'
                  }
                `}>
                  {isSelected && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path 
                        fillRule="evenodd" 
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      
      {/* Help text */}
      <p className="text-sm text-gray-500 text-center mt-4">
        Select any dietary restrictions to filter recipe suggestions
      </p>
    </div>
  );
}

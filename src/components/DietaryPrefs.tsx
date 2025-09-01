/**
 * DietaryPrefs Component
 * Allows users to select their dietary preferences/restrictions
 */

import React from 'react';
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
      key: 'none' as const,
      label: 'None',
      isSelected: !preferences.vegetarian && !preferences.vegan && !preferences.glutenFree && !preferences.dairyFree
    },
    {
      key: 'vegetarian' as const,
      label: 'Vegetarian',
      isSelected: preferences.vegetarian
    },
    {
      key: 'vegan' as const,
      label: 'Vegan', 
      isSelected: preferences.vegan
    },
    {
      key: 'glutenFree' as const,
      label: 'Gluten-Free',
      isSelected: preferences.glutenFree
    },
    {
      key: 'dairyFree' as const,
      label: 'Dairy-Free',
      isSelected: preferences.dairyFree
    }
  ];

  const handleNoneClick = () => {
    onChange({
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      dairyFree: false
    });
  };

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {dietaryOptions.map((option) => {
        const isSelected = option.key === 'none' ? option.isSelected : preferences[option.key as keyof DietaryPreferences];
        
        return (
          <button
            key={option.key}
            onClick={() => option.key === 'none' ? handleNoneClick() : handleToggle(option.key as keyof DietaryPreferences)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
              ${isSelected 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
              }
            `}
            type="button"
            role="checkbox"
            aria-checked={isSelected}
            aria-label={`Select ${option.label} preference`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

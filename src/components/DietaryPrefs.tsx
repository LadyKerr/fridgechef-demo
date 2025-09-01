/**
 * DietaryPrefs Component
 * Allows users to select their dietary preferences/restrictions
 */

import { type DietaryPreferences } from '../lib/ai';

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
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
              ${isSelected 
                ? 'bg-orange-100 text-primary border border-orange-200' 
                : 'bg-white text-warmGray border border-orange-200 hover:border-orange-300'
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

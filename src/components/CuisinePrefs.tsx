/**
 * CuisinePrefs Component
 * Allows users to select their preferred cuisine type with warm, interactive design
 */

import { useState } from 'react';

export interface CuisinePreferences {
  selectedCuisine: string;
  customCuisine: string;
}

interface CuisinePrefsProps {
  preferences: CuisinePreferences;
  onChange: (preferences: CuisinePreferences) => void;
}

export function CuisinePrefs({ preferences, onChange }: CuisinePrefsProps) {
  const [showCustomInput, setShowCustomInput] = useState(false);

  const cuisineOptions = [
    'Any Cuisine',
    'Italian',
    'Chinese',
    'Japanese',
    'Greek',
    'Mexican',
    'Indian',
    'Thai',
    'French',
    'Jamaican',
    'Korean',
    'Mediterranean'
  ];

  const handleCuisineSelect = (cuisine: string) => {
    if (cuisine === 'Other') {
      setShowCustomInput(true);
      onChange({
        ...preferences,
        selectedCuisine: 'Other'
      });
    } else {
      setShowCustomInput(false);
      onChange({
        ...preferences,
        selectedCuisine: cuisine,
        customCuisine: ''
      });
    }
  };

  const handleCustomCuisineChange = (value: string) => {
    onChange({
      ...preferences,
      customCuisine: value
    });
  };

  return (
    <div className="w-full space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-gray-800">
          Cuisine Preference (Optional)
        </h3>
        <p className="text-gray-600">
          Choose a cuisine style for your recipes
        </p>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
        {cuisineOptions.map((cuisine) => {
          const isSelected = preferences.selectedCuisine === cuisine;
          
          return (
            <button
              key={cuisine}
              onClick={() => handleCuisineSelect(cuisine)}
              className={`
                px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-sm sm:text-base font-medium transition-all duration-200 relative overflow-hidden
                focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2
                active:scale-95 transform
                ${isSelected 
                  ? 'bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-lg -translate-y-1' 
                  : 'bg-orange-50 text-orange-700 border-2 border-orange-200 hover:bg-orange-100 hover:border-orange-300 hover:-translate-y-0.5 hover:shadow-md'
                }
              `}
              type="button"
            >
              {/* Animated background for selected state */}
              {isSelected && (
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-500 opacity-0 hover:opacity-100 transition-opacity duration-200" />
              )}
              <span className="relative z-10">{cuisine}</span>
            </button>
          );
        })}
        
        <button
          onClick={() => handleCuisineSelect('Other')}
          className={`
            px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-sm sm:text-base font-medium transition-all duration-200 relative overflow-hidden
            focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2
            active:scale-95 transform
            ${preferences.selectedCuisine === 'Other'
              ? 'bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-lg -translate-y-1' 
              : 'bg-orange-50 text-orange-700 border-2 border-orange-200 hover:bg-orange-100 hover:border-orange-300 hover:-translate-y-0.5 hover:shadow-md'
            }
          `}
          type="button"
        >
          {/* Animated background for selected state */}
          {preferences.selectedCuisine === 'Other' && (
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-500 opacity-0 hover:opacity-100 transition-opacity duration-200" />
          )}
          <span className="relative z-10">Other</span>
        </button>
      </div>

      {/* Custom cuisine input with animation */}
      {showCustomInput && (
        <div className="max-w-sm mx-auto animate-fade-in">
          <input
            type="text"
            placeholder="Enter cuisine type..."
            value={preferences.customCuisine}
            onChange={(e) => handleCustomCuisineChange(e.target.value)}
            className="w-full px-4 py-3 border-2 border-orange-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 bg-white text-gray-800"
            autoFocus
          />
        </div>
      )}
    </div>
  );
}

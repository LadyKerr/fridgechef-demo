/**
 * CuisinePrefs Component
 * Allows users to select their preferred cuisine type
 */

import React, { useState } from 'react';

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
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-gray-800">
          Cuisine Preference (Optional)
        </h3>
        <p className="text-sm text-gray-600">
          Choose a cuisine style for your recipes
        </p>
      </div>
      
      <div className="flex flex-wrap justify-center gap-3">
        {cuisineOptions.map((cuisine) => {
          const isSelected = preferences.selectedCuisine === cuisine;
          
          return (
            <button
              key={cuisine}
              onClick={() => handleCuisineSelect(cuisine)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                ${isSelected 
                  ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                }
              `}
              type="button"
            >
              {cuisine}
            </button>
          );
        })}
        
        <button
          onClick={() => handleCuisineSelect('Other')}
          className={`
            px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
            ${preferences.selectedCuisine === 'Other'
              ? 'bg-blue-100 text-blue-800 border border-blue-200' 
              : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
            }
          `}
          type="button"
        >
          Other
        </button>
      </div>

      {/* Custom cuisine input */}
      {showCustomInput && (
        <div className="max-w-sm mx-auto">
          <input
            type="text"
            placeholder="Enter cuisine type..."
            value={preferences.customCuisine}
            onChange={(e) => handleCustomCuisineChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus
          />
        </div>
      )}
    </div>
  );
}

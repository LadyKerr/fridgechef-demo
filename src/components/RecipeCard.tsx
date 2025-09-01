/**
 * RecipeCard Component
 * Displays individual recipe information with save functionality and warm design
 */

import React, { useState, useEffect } from 'react';
import { Clock, ChefHat, Heart, ArrowRight } from 'lucide-react';
import { type Recipe } from '../lib/ai';
import { saveRecipe, unsaveRecipe, isRecipeSaved } from '../lib/storage';

interface RecipeCardProps {
  recipe: Recipe;
  onSaveToggle?: (saved: boolean) => void;
}

export function RecipeCard({ recipe, onSaveToggle }: RecipeCardProps) {
  const [isSaved, setIsSaved] = useState(false);

  // Check saved status when recipe changes
  useEffect(() => {
    setIsSaved(isRecipeSaved(recipe.id));
  }, [recipe.id]);

  const handleSaveToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card click
    const newSavedState = !isSaved;
    
    if (newSavedState) {
      const success = saveRecipe(recipe);
      if (success) {
        setIsSaved(true);
        onSaveToggle?.(true);
      }
    } else {
      const success = unsaveRecipe(recipe.id);
      if (success) {
        setIsSaved(false);
        onSaveToggle?.(false);
      }
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'text-green-700 bg-green-100 border-green-200';
      case 'medium': return 'text-orange-700 bg-orange-100 border-orange-200';
      case 'hard': return 'text-red-700 bg-red-100 border-red-200';
      default: return 'text-orange-700 bg-orange-100 border-orange-200';
    }
  };

  const getDietaryBadges = () => {
    if (!recipe.dietary || recipe.dietary.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-2 mt-3">
        {recipe.dietary.map((diet) => (
          <span
            key={diet}
            className="px-3 py-1 bg-orange-50 text-orange-600 text-sm font-medium rounded-full border border-orange-200 hover:bg-orange-100 transition-colors duration-200"
          >
            {diet}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden border-t-4 border-orange-400 hover:border-orange-500">
      {/* Warm gradient top border effect */}
      <div className="h-1 bg-gradient-to-r from-orange-400 to-orange-500"></div>
      
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-orange-600 group-hover:text-orange-700 transition-colors duration-200 leading-tight">
            {recipe.title}
          </h3>
          
          <button
            onClick={handleSaveToggle}
            className={`
              p-2 rounded-full transition-all duration-200 flex items-center justify-center transform hover:scale-110 active:scale-95
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400
              ${isSaved 
                ? 'bg-orange-100 text-orange-600 hover:bg-orange-200' 
                : 'bg-gray-100 text-gray-400 hover:bg-orange-100 hover:text-orange-600'
              }
            `}
            aria-label={isSaved ? 'Remove from favorites' : 'Add to favorites'}
            title={isSaved ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart 
              className={`w-5 h-5 transition-all duration-200 ${isSaved ? 'fill-current scale-110' : ''}`} 
            />
          </button>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
          {recipe.description}
        </p>

        {/* Meta information */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-orange-600">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">{recipe.cookTime}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <ChefHat className="w-4 h-4 text-orange-600" />
              <span className={`
                text-xs font-medium px-2 py-1 rounded-full border
                ${getDifficultyColor(recipe.difficulty)}
              `}>
                {recipe.difficulty}
              </span>
            </div>
          </div>
        </div>

        {/* Dietary badges */}
        {getDietaryBadges()}

        {/* Click hint with animated arrow */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm text-orange-600 group-hover:text-orange-700 transition-colors duration-200">
            <span className="font-medium">Click to view full recipe</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * RecipeCard Component
 * Displays individual recipe information with save functionality
 */

import React, { useState, useEffect } from 'react';
import { Clock, ChefHat, Heart } from 'lucide-react';
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
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-orange-600 bg-orange-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-warm-700 bg-warm-100';
    }
  };

  const getDietaryBadges = () => {
    if (!recipe.dietary || recipe.dietary.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {recipe.dietary.map((diet) => (
          <span
            key={diet}
            className="recipe-meta-tag dietary"
          >
            {diet}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="card-warm group hover-lift">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold text-warm-700 group-hover:text-warm-800 transition-colors">
          {recipe.title}
        </h3>
        
        <button
          onClick={handleSaveToggle}
          className={`
            p-2 rounded-full transition-all duration-200 flex items-center justify-center
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-warm-500
            ${isSaved 
              ? 'bg-red-100 text-red-600 hover:bg-red-200' 
              : 'bg-warm-100 text-warm-500 hover:bg-warm-200 hover:text-red-500'
            }
          `}
          aria-label={isSaved ? 'Remove from favorites' : 'Add to favorites'}
          title={isSaved ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart 
            className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} 
          />
        </button>
      </div>

      {/* Description */}
      <p className="text-warm-600 mb-4 leading-relaxed line-clamp-2">
        {recipe.description}
      </p>

      {/* Meta information */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 text-warm-600">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">{recipe.cookTime}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <ChefHat className="w-4 h-4 text-warm-600" />
            <span className={`
              text-sm font-medium px-2 py-1 rounded-full
              ${getDifficultyColor(recipe.difficulty)}
            `}>
              {recipe.difficulty}
            </span>
          </div>
        </div>
      </div>

      {/* Dietary badges */}
      {getDietaryBadges()}

      {/* Click hint */}
      <div className="mt-4 pt-4 border-t border-warm-100">
        <p className="text-sm text-warm-600 group-hover:text-warm-700 transition-colors">
          Click to view full recipe →
        </p>
      </div>
    </div>
  );
}

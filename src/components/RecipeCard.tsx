/**
 * RecipeCard Component
 * Displays individual recipe information with save functionality
 */

import React, { useState } from 'react';
import { Clock, ChefHat, Heart } from 'lucide-react';
import { Recipe } from '../lib/ai';
import { saveRecipe, unsaveRecipe, isRecipeSaved } from '../lib/storage';

interface RecipeCardProps {
  recipe: Recipe;
  onSaveToggle?: (saved: boolean) => void;
}

export function RecipeCard({ recipe, onSaveToggle }: RecipeCardProps) {
  const [isSaved, setIsSaved] = useState(isRecipeSaved(recipe.id));
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSaveToggle = () => {
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
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDietaryBadges = () => {
    if (!recipe.dietary || recipe.dietary.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {recipe.dietary.map((diet) => (
          <span
            key={diet}
            className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
          >
            {diet}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="card group">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold text-gray-800 group-hover:text-primary transition-colors">
          {recipe.title}
        </h3>
        
        <button
          onClick={handleSaveToggle}
          className={`
            p-2 rounded-full transition-all duration-200 flex items-center justify-center
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
            ${isSaved 
              ? 'bg-red-100 text-red-600 hover:bg-red-200' 
              : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-red-500'
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
      <p className="text-gray-600 mb-4 leading-relaxed">
        {recipe.description}
      </p>

      {/* Meta information */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 text-gray-500">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">{recipe.cookTime}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <ChefHat className="w-4 h-4 text-gray-500" />
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

      {/* Expandable content */}
      <div className="mt-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full text-left text-primary font-medium hover:text-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
          aria-expanded={isExpanded}
        >
          {isExpanded ? 'Hide Details' : 'Show Details'}
        </button>

        {isExpanded && (
          <div className="mt-4 space-y-4 border-t pt-4">
            {/* Ingredients */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                Ingredients
              </h4>
              <ul className="space-y-1">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="text-gray-600 text-sm flex items-start">
                    <span className="text-gray-400 mr-2">•</span>
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructions */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                <span className="w-2 h-2 bg-secondary rounded-full mr-2"></span>
                Instructions
              </h4>
              <ol className="space-y-2">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="text-gray-600 text-sm flex">
                    <span className="bg-secondary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mr-3 mt-0.5 flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="leading-relaxed">{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

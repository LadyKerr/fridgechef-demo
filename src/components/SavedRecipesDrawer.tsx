/**
 * SavedRecipesDrawer Component
 * Displays saved/favorite recipes in a sliding drawer
 */

import React, { useEffect, useState } from 'react';
import { X, Heart, Clock, ChefHat } from 'lucide-react';
import { type Recipe } from '../lib/ai';
import { getSavedRecipes, unsaveRecipe } from '../lib/storage';

interface SavedRecipesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onRecipeClick?: (recipe: Recipe) => void;
}

export function SavedRecipesDrawer({ isOpen, onClose, onRecipeClick }: SavedRecipesDrawerProps) {
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [removingRecipeId, setRemovingRecipeId] = useState<string | null>(null);

  // Load saved recipes when drawer opens
  useEffect(() => {
    if (isOpen) {
      setSavedRecipes(getSavedRecipes());
    }
  }, [isOpen]);

  const handleRemoveRecipe = async (recipeId: string) => {
    setRemovingRecipeId(recipeId);
    
    // Wait for animation before removing
    setTimeout(() => {
      const success = unsaveRecipe(recipeId);
      if (success) {
        setSavedRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
      }
      setRemovingRecipeId(null);
    }, 300);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100 border-green-200';
      case 'medium': return 'text-warm-700 bg-warm-100 border-warm-200';
      case 'hard': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-warm-700 bg-warm-100 border-warm-200';
    }
  };

  // Overlay click handler
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when drawer is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop with blur effect */}
      <div
        className={`
          fixed inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300 z-40
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={`
          fixed right-0 top-0 h-full max-w-full bg-white shadow-2xl 
          transform transition-transform duration-300 ease-out z-50 flex flex-col
          w-full sm:w-[450px]
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        {/* Header with warm gradient and text shadow */}
        <div className="bg-gradient-to-r from-warm-600 to-warm-800 text-white p-6 relative">
          {/* Gradient fade at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-b from-warm-800/20 to-transparent"></div>
          
          <div className="flex justify-between items-center">
            <h2 
              id="drawer-title" 
              className="text-xl font-semibold text-white"
              style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)' }}
            >
              My Saved Recipes
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-warm-700"
              aria-label="Close saved recipes"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
        {/* Content area with white background */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          {savedRecipes.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-warm-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-warm-700 mb-2">
                No saved recipes yet
              </h3>
              <p className="text-warm-600">
                Save recipes by clicking the heart icon on any recipe card
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {savedRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className={`
                    relative bg-gradient-to-br from-warm-50 to-warm-100 rounded-xl p-4 border-t-3 border-warm-600 
                    shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer
                    ${removingRecipeId === recipe.id ? 'animate-slide-out-right opacity-0' : ''}
                  `}
                  onClick={() => onRecipeClick?.(recipe)}
                >
                  {/* Recipe header */}
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-warm-700 leading-tight flex-1 pr-2">
                      {recipe.title}
                    </h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveRecipe(recipe.id);
                      }}
                      className="p-1.5 rounded-full hover:bg-red-100 hover:scale-110 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 group"
                      aria-label={`Remove ${recipe.title} from favorites`}
                      title="Remove from favorites"
                    >
                      <X className="w-4 h-4 text-gray-400 group-hover:text-red-500" />
                    </button>
                  </div>

                  {/* Recipe description */}
                  <p className="text-sm text-warm-600 mb-3 line-clamp-2 leading-relaxed">
                    {recipe.description}
                  </p>

                  {/* Recipe meta info with warm accents */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1 text-warm-600">
                        <Clock className="w-4 h-4" />
                        <span className="text-xs font-medium">{recipe.cookTime}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <ChefHat className="w-4 h-4 text-warm-600" />
                        <span className={`
                          text-xs font-medium px-2 py-1 rounded-full border
                          ${getDifficultyColor(recipe.difficulty)}
                        `}>
                          {recipe.difficulty}
                        </span>
                      </div>
                    </div>

                    {/* Dietary badges with orange accents */}
                    {recipe.dietary && recipe.dietary.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {recipe.dietary.slice(0, 2).map((diet) => (
                          <span
                            key={diet}
                            className="text-xs px-2 py-1 rounded-full bg-warm-200 text-warm-800 border border-warm-300"
                          >
                            {diet}
                          </span>
                        ))}
                        {recipe.dietary.length > 2 && (
                          <span className="text-xs text-warm-600 px-1">
                            +{recipe.dietary.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Bottom section with counts and action */}
                  <div className="flex justify-between items-center pt-2 border-t border-warm-200">
                    <div className="text-xs text-warm-600 font-medium">
                      {recipe.ingredients.length} ingredients • {recipe.instructions.length} steps
                    </div>
                    <div className="flex items-center space-x-1 text-warm-700 font-medium text-xs group-hover:text-warm-800 transition-colors">
                      <span>View recipe</span>
                      <div className="transform group-hover:translate-x-1 transition-transform duration-200">
                        →
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with warm accents and dynamic count */}
        {savedRecipes.length > 0 && (
          <div className="p-6 border-t border-warm-200 bg-gradient-to-r from-warm-50 to-warm-100">
            <p className="text-sm text-warm-700 text-center font-medium">
              {savedRecipes.length} recipe{savedRecipes.length === 1 ? '' : 's'} saved
            </p>
          </div>
        )}
      </div>
    </>
  );
}

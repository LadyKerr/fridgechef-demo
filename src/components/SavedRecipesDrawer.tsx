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

  // Load saved recipes when drawer opens
  useEffect(() => {
    if (isOpen) {
      setSavedRecipes(getSavedRecipes());
    }
  }, [isOpen]);

  const handleRemoveRecipe = (recipeId: string) => {
    const success = unsaveRecipe(recipeId);
    if (success) {
      setSavedRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
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
      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 bg-black/50 transition-opacity duration-300 z-40
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={`
          fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl 
          transform transition-transform duration-300 ease-in-out z-50
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        {/* Header */}
        <div className="modal-header">
          <h2 id="drawer-title" className="text-xl font-semibold text-white">
            My Saved Recipes
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
            aria-label="Close saved recipes"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
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
                  className="card-warm hover-lift cursor-pointer"
                  onClick={() => onRecipeClick?.(recipe)}
                >
                  {/* Recipe header */}
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-warm-800 leading-tight">
                      {recipe.title}
                    </h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering the card click
                        handleRemoveRecipe(recipe.id);
                      }}
                      className="p-1 rounded-full hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      aria-label={`Remove ${recipe.title} from favorites`}
                      title="Remove from favorites"
                    >
                      <Heart className="w-4 h-4 text-red-500 fill-current" />
                    </button>
                  </div>

                  {/* Recipe description */}
                  <p className="text-sm text-warm-600 mb-3 line-clamp-2">
                    {recipe.description}
                  </p>

                  {/* Recipe meta */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1 text-warm-600">
                        <Clock className="w-3 h-3" />
                        <span className="text-xs font-medium">{recipe.cookTime}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <ChefHat className="w-3 h-3 text-warm-600" />
                        <span className={`
                          text-xs font-medium px-2 py-0.5 rounded-full
                          ${getDifficultyColor(recipe.difficulty)}
                        `}>
                          {recipe.difficulty}
                        </span>
                      </div>
                    </div>

                    {/* Dietary badges */}
                    {recipe.dietary && recipe.dietary.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {recipe.dietary.slice(0, 2).map((diet) => (
                          <span
                            key={diet}
                            className="recipe-meta-tag dietary"
                          >
                            {diet}
                          </span>
                        ))}
                        {recipe.dietary.length > 2 && (
                          <span className="text-xs text-warm-600">
                            +{recipe.dietary.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Quick ingredient count */}
                  <div className="mt-2 flex justify-between items-center">
                    <div className="text-xs text-warm-600">
                      {recipe.ingredients.length} ingredients • {recipe.instructions.length} steps
                    </div>
                    <div className="text-xs text-warm-700 font-medium">
                      Click to view recipe →
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {savedRecipes.length > 0 && (
          <div className="p-6 border-t border-warm-200 bg-warm-50">
            <p className="text-sm text-warm-600 text-center">
              {savedRecipes.length} recipe{savedRecipes.length === 1 ? '' : 's'} saved
            </p>
          </div>
        )}
      </div>
    </>
  );
}

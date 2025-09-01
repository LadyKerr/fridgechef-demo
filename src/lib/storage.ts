/**
 * Local storage utilities for FridgeChef
 * Manages saved recipes and user preferences
 */

import { type Recipe } from './ai';

const STORAGE_KEY = 'fc:saved';

/**
 * Get all saved recipes from localStorage
 */
export function getSavedRecipes(): Recipe[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error loading saved recipes:', error);
    return [];
  }
}

/**
 * Save a recipe to favorites
 */
export function saveRecipe(recipe: Recipe): boolean {
  try {
    const saved = getSavedRecipes();
    
    // Check if recipe is already saved
    if (saved.find(r => r.id === recipe.id)) {
      return false; // Already saved
    }
    
    saved.push(recipe);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    return true;
  } catch (error) {
    console.error('Error saving recipe:', error);
    return false;
  }
}

/**
 * Remove a recipe from favorites
 */
export function unsaveRecipe(recipeId: string): boolean {
  try {
    const saved = getSavedRecipes();
    const filtered = saved.filter(r => r.id !== recipeId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error removing recipe:', error);
    return false;
  }
}

/**
 * Check if a recipe is saved
 */
export function isRecipeSaved(recipeId: string): boolean {
  const saved = getSavedRecipes();
  return saved.some(r => r.id === recipeId);
}

/**
 * Clear all saved recipes
 */
export function clearSavedRecipes(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing saved recipes:', error);
  }
}

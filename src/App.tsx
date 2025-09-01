/**
 * FridgeChef - Main Application Component
 * A smart recipe generator that analyzes your fridge contents
 */

import React, { useState } from 'react';
import { ChefHat, BookOpen, Loader2 } from 'lucide-react';
import { UploadBox } from './components/UploadBox';
import { DietaryPrefs } from './components/DietaryPrefs';
import { RecipeCard } from './components/RecipeCard';
import { SavedRecipesDrawer } from './components/SavedRecipesDrawer';
import { detectIngredientsFromImage, generateRecipes, Recipe, DietaryPreferences } from './lib/ai';

// Application states
type AppState = 'landing' | 'uploading' | 'preferences' | 'generating' | 'results';

function App() {
  // State management
  const [currentState, setCurrentState] = useState<AppState>('landing');
  const [detectedIngredients, setDetectedIngredients] = useState<string[]>([]);
  const [dietaryPreferences, setDietaryPreferences] = useState<DietaryPreferences>({
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    dairyFree: false
  });
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle image upload and ingredient detection
  const handleImageUpload = async (file: File) => {
    setCurrentState('uploading');
    setError(null);

    try {
      const ingredients = await detectIngredientsFromImage(file);
      setDetectedIngredients(ingredients);
      setCurrentState('preferences');
    } catch (err) {
      setError('Failed to analyze the image. Please try again.');
      setCurrentState('landing');
      console.error('Image analysis error:', err);
    }
  };

  // Generate recipes based on ingredients and preferences
  const handleGenerateRecipes = async () => {
    if (detectedIngredients.length === 0) return;

    setCurrentState('generating');
    setError(null);

    try {
      const generatedRecipes = await generateRecipes(detectedIngredients, dietaryPreferences);
      setRecipes(generatedRecipes);
      setCurrentState('results');
    } catch (err) {
      setError('Failed to generate recipes. Please try again.');
      setCurrentState('preferences');
      console.error('Recipe generation error:', err);
    }
  };

  // Reset to start over
  const handleStartOver = () => {
    setCurrentState('landing');
    setDetectedIngredients([]);
    setRecipes([]);
    setError(null);
    setDietaryPreferences({
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      dairyFree: false
    });
  };

  // Render different views based on current state
  const renderContent = () => {
    switch (currentState) {
      case 'landing':
        return (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="bg-primary bg-opacity-10 p-6 rounded-full">
                  <ChefHat className="w-16 h-16 text-primary" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
                Fridge<span className="text-primary">Chef</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-md mx-auto">
                Turn your fridge contents into delicious recipes with AI magic ✨
              </p>
            </div>

            <UploadBox onImageUpload={handleImageUpload} />
            
            {error && (
              <div className="max-w-md mx-auto p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <p className="text-sm text-gray-500">
              Currently in demo mode - using mock data for ingredient detection
            </p>
          </div>
        );

      case 'uploading':
        return (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="bg-primary bg-opacity-10 p-6 rounded-full">
                <Loader2 className="w-16 h-16 text-primary animate-spin" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Analyzing Your Fridge
              </h2>
              <p className="text-gray-600">
                Our AI is identifying ingredients from your photo...
              </p>
            </div>
          </div>
        );

      case 'preferences':
        return (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Great! We found these ingredients:
              </h2>
              
              {/* Detected ingredients */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
                <div className="flex flex-wrap gap-2 justify-center">
                  {detectedIngredients.map((ingredient, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white border border-green-300 rounded-full text-sm font-medium text-gray-700"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <DietaryPrefs 
              preferences={dietaryPreferences}
              onChange={setDietaryPreferences}
            />

            <div className="flex justify-center space-x-4">
              <button
                onClick={handleStartOver}
                className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Start Over
              </button>
              <button
                onClick={handleGenerateRecipes}
                className="btn-primary"
              >
                Generate Recipes
              </button>
            </div>
          </div>
        );

      case 'generating':
        return (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="bg-secondary bg-opacity-10 p-6 rounded-full">
                <ChefHat className="w-16 h-16 text-secondary animate-pulse" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Cooking Up Recipes
              </h2>
              <p className="text-gray-600">
                Our AI chef is creating personalized recipes for you...
              </p>
            </div>
          </div>
        );

      case 'results':
        return (
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Here are your personalized recipes!
              </h2>
              <p className="text-gray-600 mb-6">
                Based on your ingredients and dietary preferences
              </p>
              
              <button
                onClick={handleStartOver}
                className="btn-secondary mb-8"
              >
                Create New Recipes
              </button>
            </div>

            {recipes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No recipes found. Try adjusting your preferences or uploading a different image.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onSaveToggle={() => {
                      // Optional: Could trigger a notification here
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <button 
              onClick={handleStartOver}
              className="flex items-center space-x-2 text-xl font-bold text-gray-800 hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            >
              <ChefHat className="w-8 h-8 text-primary" />
              <span>FridgeChef</span>
            </button>

            {/* Navigation */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="Open saved recipes"
            >
              <BookOpen className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-700">My Recipes</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      {/* Saved recipes drawer */}
      <SavedRecipesDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">
              Made with ❤️ for better cooking experiences
            </p>
            <p className="text-sm">
              Demo mode active - Switch to production by adding your OpenAI API key
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

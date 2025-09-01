/**
 * FridgeChef - Main Application Component
 * A smart recipe generator that analyzes your fridge contents
 */

import { useState } from 'react';
import { ChefHat, BookOpen, Loader2, ArrowLeft, Lightbulb } from 'lucide-react';
import { UploadBox } from './components/UploadBox';
import { DietaryPrefs } from './components/DietaryPrefs';
import { CuisinePrefs, type CuisinePreferences } from './components/CuisinePrefs';
import { RecipeCard } from './components/RecipeCard';
import { SavedRecipesDrawer } from './components/SavedRecipesDrawer';
import { detectIngredientsFromImage, generateRecipes, type Recipe, type DietaryPreferences } from './lib/ai';

// Application states
type AppState = 'landing' | 'uploading' | 'cuisine-preferences' | 'generating' | 'results' | 'recipe-detail';

function App() {
  // State management
  const [currentState, setCurrentState] = useState<AppState>('landing');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [detectedIngredients, setDetectedIngredients] = useState<string[]>([]);
  const [dietaryPreferences, setDietaryPreferences] = useState<DietaryPreferences>({
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    dairyFree: false
  });
  const [cuisinePreferences, setCuisinePreferences] = useState<CuisinePreferences>({
    selectedCuisine: 'Any Cuisine',
    customCuisine: ''
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
      setCurrentState('cuisine-preferences');
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
      const generatedRecipes = await generateRecipes(detectedIngredients, dietaryPreferences, cuisinePreferences);
      setRecipes(generatedRecipes);
      setCurrentState('results');
    } catch (err) {
      setError('Failed to generate recipes. Please try again.');
      setCurrentState('cuisine-preferences');
      console.error('Recipe generation error:', err);
    }
  };

  // Reset to start over
  const handleStartOver = () => {
    setCurrentState('landing');
    setDetectedIngredients([]);
    setRecipes([]);
    setSelectedRecipe(null);
    setError(null);
    setDietaryPreferences({
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      dairyFree: false
    });
    setCuisinePreferences({
      selectedCuisine: 'Any Cuisine',
      customCuisine: ''
    });
  };

  // Handle viewing a specific recipe
  const handleViewRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setCurrentState('recipe-detail');
  };

  // Handle viewing a saved recipe (from drawer)
  const handleViewSavedRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setCurrentState('recipe-detail');
    setIsDrawerOpen(false); // Close the drawer
  };

  // Handle going back from recipe detail
  const handleBackFromRecipe = () => {
    setSelectedRecipe(null);
    setCurrentState('results');
  };

  // Render different views based on current state
  const renderContent = () => {
    switch (currentState) {
      case 'landing':
        return (
          <div className="max-w-md mx-auto text-center space-y-8">
            {/* Header */}
            <div className="space-y-3">
              <h1 className="title-warm">
                FridgeChef
              </h1>
              <p className="subtitle-warm">
                Turn your fridge into inspiration 🔍
              </p>
            </div>

            {/* Dietary Preferences */}
            <div className="space-y-4">
              <p className="text-sm font-medium text-warm-700">Dietary Preference:</p>
              <DietaryPrefs 
                preferences={dietaryPreferences}
                onChange={setDietaryPreferences}
              />
            </div>

            {/* Upload Area */}
            <UploadBox onImageUpload={handleImageUpload} />

            {/* Generate Button */}
            <button 
              onClick={() => {
                // For demo purposes, skip directly to cuisine preferences with mock ingredients
                setDetectedIngredients(['eggs', 'spinach', 'cheese', 'milk', 'bread']);
                setCurrentState('cuisine-preferences');
              }}
              className="btn-warm-primary w-full"
            >
              Generate Recipes
            </button>
            
            <p className="text-sm text-white/80">
              No recipes yet. Upload a fridge photo and click generate to get started.
            </p>
            
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}
          </div>
        );

      case 'uploading':
        return (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="bg-warm-600/10 p-6 rounded-full">
                <Loader2 className="w-16 h-16 text-warm-600 animate-spin" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-primary mb-2">
                Analyzing Your Fridge
              </h2>
              <p className="text-warmGray">
                Our AI is identifying ingredients from your photo...
              </p>
            </div>
          </div>
        );

      case 'cuisine-preferences':
        return (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-primary mb-4">
                Great! We found these ingredients:
              </h2>
              
              {/* Detected ingredients */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8">
                <div className="flex flex-wrap gap-2 justify-center">
                  {detectedIngredients.map((ingredient, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white border border-orange-300 rounded-full text-sm font-medium text-primary"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <CuisinePrefs 
              preferences={cuisinePreferences}
              onChange={setCuisinePreferences}
            />

            <div className="flex justify-center space-x-4">
              <button
                onClick={handleStartOver}
                className="px-6 py-3 border border-orange-300 rounded-lg font-medium text-primary hover:bg-orange-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
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
              <div className="bg-warm-700/10 p-6 rounded-full">
                <ChefHat className="w-16 h-16 text-warm-700 animate-pulse" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-primary mb-2">
                Cooking Up Recipes
              </h2>
              <p className="text-warmGray">
                Our AI chef is creating personalized recipes for you...
              </p>
            </div>
          </div>
        );

      case 'results':
        return (
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-primary mb-4">
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
                  <div 
                    key={recipe.id} 
                    onClick={() => handleViewRecipe(recipe)}
                    className="cursor-pointer"
                  >
                    <RecipeCard
                      recipe={recipe}
                      onSaveToggle={() => {
                        // Optional: Could trigger a notification here
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'recipe-detail':
        if (!selectedRecipe) return null;
        
        return (
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Back button */}
            <button
              onClick={handleBackFromRecipe}
              className="flex items-center space-x-2 text-warmGray hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to recipes</span>
            </button>

            {/* Recipe header */}
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <h1 className="text-3xl font-semibold text-primary">
                  {selectedRecipe.title}
                </h1>
                <button
                  className="p-2 bg-orange-100 hover:bg-orange-200 rounded-lg transition-colors"
                >
                  Save
                </button>
              </div>
              
              <p className="text-warmGray">
                {selectedRecipe.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {selectedRecipe.dietary?.map((diet) => (
                  <span
                    key={diet}
                    className="px-3 py-1 bg-orange-100 text-primary text-sm font-medium rounded-full"
                  >
                    {diet}
                  </span>
                ))}
                <span className="px-3 py-1 bg-orange-100 text-primary text-sm font-medium rounded-full">
                  {selectedRecipe.cookTime}
                </span>
                <span className="px-3 py-1 bg-orange-100 text-primary text-sm font-medium rounded-full">
                  {selectedRecipe.difficulty}
                </span>
              </div>
            </div>

            {/* Recipe image placeholder */}
            <div className="w-full h-48 bg-orange-50 rounded-lg flex items-center justify-center border-2 border-dashed border-orange-300">
              <p className="text-primary font-medium">Recipe image placeholder</p>
            </div>

            {/* Ingredients and Steps */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Ingredients */}
              <div>
                <h2 className="text-xl font-semibold text-primary mb-4">Ingredients</h2>
                <ul className="space-y-2">
                  {selectedRecipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-orange-400 mr-2">•</span>
                      <span className="text-warmGray">{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Steps */}
              <div>
                <h2 className="text-xl font-semibold text-primary mb-4">Steps</h2>
                <ol className="space-y-3">
                  {selectedRecipe.instructions.map((instruction, index) => (
                    <li key={index} className="flex">
                      <span className="bg-orange-200 text-primary rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5 flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-warmGray">{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Tip section */}
            <div className="bg-yellow-25 border border-yellow-100 rounded-lg p-4" style={{ backgroundColor: '#fefce8' }}>
              <div className="flex items-start space-x-2">
                <Lightbulb className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <p className="text-yellow-800">
                  <span className="font-medium">Tip:</span> No cheddar? Use feta or mozzarella.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-warm-gradient flex flex-col">
      {/* Header - hide on recipe detail page */}
      {currentState !== 'recipe-detail' && (
        <header className="glassmorphism shadow-warm border-b border-warm-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <button 
                onClick={handleStartOver}
                className="flex items-center space-x-2 text-xl font-bold text-primary hover:text-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
              >
                <ChefHat className="w-8 h-8 text-primary" />
                <span>FridgeChef</span>
              </button>

              {/* Navigation */}
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-orange-100 hover:bg-orange-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label="Open saved recipes"
              >
                <BookOpen className="w-5 h-5 text-primary" />
                <span className="font-medium text-primary">My Recipes</span>
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Main content */}
      <main className={`flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${currentState === 'recipe-detail' ? 'pt-8' : ''}`}>
        {renderContent()}
      </main>

      {/* Saved recipes drawer */}
      <SavedRecipesDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onRecipeClick={handleViewSavedRecipe}
      />

      {/* Footer - hide on recipe detail page */}
      {currentState !== 'recipe-detail' && (
        <footer className="bg-white border-t border-orange-200 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-warmGray">
              <p className="mb-2">
                Made with ❤️ for better cooking experiences
              </p>
              {import.meta.env.VITE_MOCK === 'true' && (
                <p className="text-sm">
                  Demo mode active - Switch to production by adding your OpenAI API key
                </p>
              )}
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;

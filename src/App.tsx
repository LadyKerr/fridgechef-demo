/**
 * FridgeChef - Main Application Component
 * A smart recipe generator that analyzes your fridge contents
 */

import { useState } from 'react';
import { ChefHat, Loader2, ArrowLeft, Lightbulb } from 'lucide-react';
import { Header } from './components/Header';
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
          <div className="min-h-screen bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center px-4 pt-5">
            <div className="w-full max-w-lg">
              {/* Hero Section */}
              <div className="text-center mb-12">
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-4" 
                    style={{ textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)' }}>
                  Turn your fridge into inspiration
                </h1>
                <p className="text-xl text-white/90 mb-8" 
                   style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)' }}>
                  AI-powered recipe suggestions from whatever you have at home
                </p>
                
                {/* Social Proof Stats */}
                <div className="flex justify-center space-x-8 mb-12">
                  <div className="text-center animate-float" style={{ animationDelay: '0s' }}>
                    <div className="text-3xl font-bold text-white" 
                         style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)' }}>50K+</div>
                    <div className="text-white/80 text-sm">Recipe Generated</div>
                  </div>
                  <div className="text-center animate-float" style={{ animationDelay: '0.5s' }}>
                    <div className="text-3xl font-bold text-white" 
                         style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)' }}>12K+</div>
                    <div className="text-white/80 text-sm">Happy Users</div>
                  </div>
                  <div className="text-center animate-float" style={{ animationDelay: '1s' }}>
                    <div className="text-3xl font-bold text-white flex items-center justify-center" 
                         style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)' }}>
                      4.8★
                    </div>
                    <div className="text-white/80 text-sm">User Rating</div>
                  </div>
                </div>
              </div>

              {/* Main App Card */}
              <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20">
                {/* Dietary Preferences */}
                <div className="mb-8">
                  <p className="text-gray-700 font-medium mb-4">Dietary Preferences:</p>
                  <DietaryPrefs 
                    preferences={dietaryPreferences}
                    onChange={setDietaryPreferences}
                  />
                </div>

                {/* Upload Area */}
                <div className="mb-8">
                  <UploadBox onImageUpload={handleImageUpload} />
                </div>

                {/* Generate Button */}
                <button 
                  onClick={() => {
                    // For demo purposes, skip directly to cuisine preferences with mock ingredients
                    setDetectedIngredients(['eggs', 'spinach', 'cheese', 'milk', 'bread']);
                    setCurrentState('cuisine-preferences');
                  }}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-400 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transform transition-all duration-300"
                >
                  Generate Recipes
                </button>

                {/* Example Recipe Previews */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <p className="text-gray-600 text-sm mb-4 flex items-center">
                    💡 What you could create:
                  </p>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-700 font-medium">Mediterranean Pasta Bowl</span>
                      <span className="text-gray-500">Tomatoes, basil, cheese, pasta</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-700 font-medium">Quick Veggie Stir-Fry</span>
                      <span className="text-gray-500">Bell peppers, onions, soy sauce</span>
                    </div>
                  </div>
                  <p className="text-gray-500 text-xs mt-4 text-center">
                    Upload a photo of your fridge contents and we'll suggest delicious recipes you can make right now!
                  </p>
                </div>
                
                {error && (
                  <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                )}
              </div>
            </div>
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
    <>
      {currentState === 'landing' ? (
        // Full-screen landing page
        <div className="min-h-screen">
          <Header 
            onLogoClick={handleStartOver}
            onMyRecipesClick={() => setIsDrawerOpen(true)}
            isMyRecipesActive={isDrawerOpen}
          />
          {renderContent()}
        </div>
      ) : (
        // App layout for other pages
        <div className="min-h-screen bg-warm-gradient flex flex-col">
          {/* Header for all pages */}
          <Header 
            onLogoClick={handleStartOver}
            onMyRecipesClick={() => setIsDrawerOpen(true)}
            isMyRecipesActive={isDrawerOpen}
          />

          {/* Main content */}
          <main className={`flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${currentState === 'recipe-detail' ? 'pt-8' : ''}`}>
            {renderContent()}
          </main>

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
      )}

      {/* Saved recipes drawer */}
      <SavedRecipesDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onRecipeClick={handleViewSavedRecipe}
      />
    </>
  );
}

export default App;

/**
 * FridgeChef - Main Application Component
 * A smart recipe generator that analyzes your fridge contents
 */

import { useState } from 'react';
import { ArrowLeft, Lightbulb } from 'lucide-react';
import { Header } from './components/Header';
import { UploadBox } from './components/UploadBox';
import { DietaryPrefs } from './components/DietaryPrefs';
import { CuisinePrefs, type CuisinePreferences } from './components/CuisinePrefs';
import { RecipeCard } from './components/RecipeCard';
import { SavedRecipesDrawer } from './components/SavedRecipesDrawer';
import { AnalysisLoadingScreen } from './components/AnalysisLoadingScreen';
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
          <div className="min-h-screen flex items-center justify-center px-4">
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
                    // Show the loading screen first, then proceed to cuisine preferences
                    setDetectedIngredients(['eggs', 'spinach', 'cheese', 'milk', 'bread']);
                    setCurrentState('uploading');
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
          <AnalysisLoadingScreen 
            onComplete={() => setCurrentState('cuisine-preferences')}
          />
        );

      case 'cuisine-preferences':
        return (
          <div className="min-h-screen bg-gradient-to-br flex items-center justify-center px-4 pt-5">
            <div className="w-full max-w-3xl">
              {/* Success Header with animated icon */}
              <div className="text-center mb-8">
                <div className="text-6xl mb-4 animate-celebration-bounce">
                  🎉
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" 
                    style={{ textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)' }}>
                  Great! We found these ingredients:
                </h1>
              </div>

              {/* White card with ingredients */}
              <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20 mb-8">
                {/* Ingredients Display */}
                <div className="mb-8">
                  <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
                    {detectedIngredients.map((ingredient, index) => {
                      // Add emojis to common ingredients
                      const getIngredientEmoji = (ing: string) => {
                        const lowerIng = ing.toLowerCase();
                        if (lowerIng.includes('apple')) return '🍎';
                        if (lowerIng.includes('carrot')) return '🥕';
                        if (lowerIng.includes('chicken') || lowerIng.includes('meat')) return '🍗';
                        if (lowerIng.includes('cheese')) return '🧀';
                        if (lowerIng.includes('egg')) return '🥚';
                        if (lowerIng.includes('spinach') || lowerIng.includes('lettuce') || lowerIng.includes('salad')) return '🥬';
                        if (lowerIng.includes('milk')) return '🥛';
                        if (lowerIng.includes('bread')) return '🍞';
                        if (lowerIng.includes('tomato')) return '🍅';
                        if (lowerIng.includes('onion')) return '🧅';
                        if (lowerIng.includes('garlic')) return '🧄';
                        if (lowerIng.includes('bell pepper') || lowerIng.includes('pepper')) return '🫑';
                        if (lowerIng.includes('mushroom')) return '🍄';
                        if (lowerIng.includes('potato')) return '🥔';
                        if (lowerIng.includes('rice')) return '🍚';
                        if (lowerIng.includes('pasta')) return '🍝';
                        if (lowerIng.includes('fish') || lowerIng.includes('salmon') || lowerIng.includes('tuna')) return '🐟';
                        if (lowerIng.includes('beef') || lowerIng.includes('steak')) return '🥩';
                        if (lowerIng.includes('broccoli')) return '🥦';
                        if (lowerIng.includes('corn')) return '🌽';
                        if (lowerIng.includes('cucumber')) return '🥒';
                        if (lowerIng.includes('avocado')) return '🥑';
                        if (lowerIng.includes('banana')) return '🍌';
                        if (lowerIng.includes('orange')) return '🍊';
                        if (lowerIng.includes('lemon')) return '🍋';
                        if (lowerIng.includes('strawberry') || lowerIng.includes('berry')) return '🍓';
                        if (lowerIng.includes('grapes')) return '🍇';
                        if (lowerIng.includes('pineapple')) return '🍍';
                        if (lowerIng.includes('watermelon')) return '🍉';
                        if (lowerIng.includes('peach')) return '🍑';
                        if (lowerIng.includes('flour') || lowerIng.includes('wheat')) return '🌾';
                        if (lowerIng.includes('honey')) return '🍯';
                        if (lowerIng.includes('oil') || lowerIng.includes('olive')) return '🫒';
                        return '🥄'; // default ingredient icon
                      };

                      return (
                        <button
                          key={index}
                          className="group px-4 py-3 bg-orange-50 border-2 border-orange-300 rounded-full text-sm font-medium text-orange-800 hover:bg-gradient-to-r hover:from-orange-400 hover:to-orange-500 hover:text-white hover:border-orange-400 transform hover:-translate-y-1 active:scale-95 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-lg"
                          onClick={() => {
                            // Add click animation feedback
                            const button = document.activeElement as HTMLButtonElement;
                            if (button) {
                              button.style.transform = 'scale(0.95) translateY(-2px)';
                              setTimeout(() => {
                                button.style.transform = '';
                              }, 150);
                            }
                          }}
                        >
                          <span className="mr-2">{getIngredientEmoji(ingredient)}</span>
                          {ingredient}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Cuisine Selection */}
                <CuisinePrefs 
                  preferences={cuisinePreferences}
                  onChange={setCuisinePreferences}
                />

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-8">
                  <button
                    onClick={handleStartOver}
                    className="w-full sm:w-auto px-6 sm:px-8 py-4 bg-white border-2 border-orange-400 rounded-xl font-semibold text-orange-600 hover:bg-orange-50 hover:border-orange-500 hover:-translate-y-1 hover:shadow-lg active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
                  >
                    Start Over
                  </button>
                  <button
                    onClick={handleGenerateRecipes}
                    className="w-full sm:w-auto px-6 sm:px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 hover:from-orange-600 hover:to-orange-500 active:scale-95 transform transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
                  >
                    Generate Recipes
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'generating':
        return (
          <AnalysisLoadingScreen 
            mode="generating"
            onComplete={() => setCurrentState('results')}
          />
        );

      case 'results':
        return (
          <div className="min-h-screen py-8 px-4">
            <div className="max-w-6xl mx-auto">
              {/* Header Section */}
              <div className="text-center mb-12">
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 animate-fade-in" 
                    style={{ textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)' }}>
                  Here are your personalized recipes!
                </h1>
                <p className="text-xl text-white/90 mb-8" 
                   style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)' }}>
                  Based on your ingredients and dietary preferences
                </p>
                
                <button
                  onClick={handleStartOver}
                  className="group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95 transition-all duration-200 border-2 border-white/20 hover:border-white/30"
                >
                  <span className="relative z-10">Create New Recipes</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                </button>
              </div>

              {recipes.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-md mx-auto">
                    <p className="text-white text-lg">No recipes found. Try adjusting your preferences or uploading a different image.</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recipes.map((recipe, index) => (
                    <div 
                      key={recipe.id} 
                      onClick={() => handleViewRecipe(recipe)}
                      className="cursor-pointer animate-fade-in-up"
                      style={{ animationDelay: `${index * 100}ms` }}
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
      {currentState === 'landing' || currentState === 'uploading' || currentState === 'generating' ? (
        // Full-screen pages (landing, loading screens)
        <div className="min-h-screen">
          {currentState === 'landing' && (
            <Header 
              onLogoClick={handleStartOver}
              onMyRecipesClick={() => setIsDrawerOpen(true)}
              isMyRecipesActive={isDrawerOpen}
            />
          )}
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

/**
 * AI utilities for FridgeChef
 * Handles ingredient detection from images and recipe generation
 */

// Types for our application
export interface Recipe {
  id: string;
  title: string;
  description: string;
  cookTime: string;
  difficulty: 'easy' | 'medium' | 'hard';
  ingredients: string[];
  instructions: string[];
  dietary?: string[]; // vegetarian, vegan, gluten-free, dairy-free
}

export interface DietaryPreferences {
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  dairyFree: boolean;
}

// Mock data for demonstrations and fallback
const MOCK_INGREDIENTS = [
  'chicken breast', 'broccoli', 'carrots', 'onion', 'garlic',
  'olive oil', 'salt', 'pepper', 'rice', 'cheese', 'eggs', 'milk'
];

const MOCK_RECIPES: Recipe[] = [
  {
    id: '1',
    title: 'One-Pan Chicken and Vegetables',
    description: 'A healthy and delicious meal with tender chicken and fresh vegetables.',
    cookTime: '25 mins',
    difficulty: 'easy',
    ingredients: [
      '2 chicken breasts, sliced',
      '1 cup broccoli florets',
      '2 carrots, sliced',
      '1 onion, diced',
      '2 cloves garlic, minced',
      '2 tbsp olive oil',
      'Salt and pepper to taste'
    ],
    instructions: [
      'Heat olive oil in a large pan over medium-high heat.',
      'Season chicken with salt and pepper, then cook for 5-6 minutes per side.',
      'Remove chicken and set aside.',
      'Add vegetables to the pan and sauté for 8-10 minutes.',
      'Return chicken to pan and cook for another 2-3 minutes.',
      'Serve hot and enjoy!'
    ],
    dietary: []
  },
  {
    id: '2',
    title: 'Vegetable Fried Rice',
    description: 'Quick and tasty fried rice packed with fresh vegetables.',
    cookTime: '15 mins',
    difficulty: 'easy',
    ingredients: [
      '2 cups cooked rice',
      '1 cup mixed vegetables (broccoli, carrots)',
      '2 eggs, beaten',
      '1 onion, diced',
      '2 cloves garlic, minced',
      '2 tbsp olive oil',
      'Soy sauce to taste'
    ],
    instructions: [
      'Heat oil in a large wok or pan.',
      'Scramble eggs and set aside.',
      'Sauté onion and garlic until fragrant.',
      'Add vegetables and cook for 3-4 minutes.',
      'Add rice and scrambled eggs, stir well.',
      'Season with soy sauce and serve.'
    ],
    dietary: ['vegetarian']
  },
  {
    id: '3',
    title: 'Garlic Herb Roasted Vegetables',
    description: 'Perfectly roasted vegetables with aromatic herbs.',
    cookTime: '30 mins',
    difficulty: 'easy',
    ingredients: [
      '1 cup broccoli florets',
      '2 carrots, chopped',
      '1 onion, quartered',
      '3 cloves garlic, minced',
      '3 tbsp olive oil',
      'Fresh herbs (rosemary, thyme)',
      'Salt and pepper'
    ],
    instructions: [
      'Preheat oven to 425°F (220°C).',
      'Toss vegetables with olive oil, garlic, and herbs.',
      'Season with salt and pepper.',
      'Spread on baking sheet in single layer.',
      'Roast for 25-30 minutes until tender.',
      'Serve as side dish or main course.'
    ],
    dietary: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free']
  }
];

/**
 * Detects ingredients from an uploaded fridge image
 * Uses OpenAI Vision API in production, mock data in development
 */
export async function detectIngredientsFromImage(imageFile: File): Promise<string[]> {
  const isMockMode = import.meta.env.VITE_MOCK === 'true';
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  console.log('Environment check:', {
    isMockMode,
    hasApiKey: !!apiKey,
    apiKeyLength: apiKey?.length,
    mockEnvValue: import.meta.env.VITE_MOCK
  });
  
  if (isMockMode) {
    console.log('Running in mock mode');
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    return MOCK_INGREDIENTS;
  }

  if (!apiKey) {
    console.error('OpenAI API key not found. Environment variables:', {
      VITE_MOCK: import.meta.env.VITE_MOCK,
      VITE_OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY ? '[PRESENT]' : '[MISSING]'
    });
    throw new Error('OpenAI API key not found. Please set VITE_OPENAI_API_KEY in your .env file.');
  }

  // Validate file type and size
  if (!imageFile.type.startsWith('image/')) {
    throw new Error('Please upload a valid image file.');
  }

  if (imageFile.size > 20 * 1024 * 1024) { // 20MB limit
    throw new Error('Image file is too large. Please upload an image smaller than 20MB.');
  }

  try {
    // Convert image to base64
    const base64Image = await convertImageToBase64(imageFile);
    
    console.log('Making OpenAI API call for image analysis...');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this fridge image and identify all visible food ingredients. Focus on ingredients that can be used for cooking. Return only a comma-separated list of ingredients, nothing else. Example: chicken breast, broccoli, carrots, eggs, milk'
              },
              {
                type: 'image_url',
                image_url: {
                  url: base64Image
                }
              }
            ]
          }
        ],
        max_tokens: 300,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const ingredientsText = data.choices[0]?.message?.content || '';
    
    if (!ingredientsText) {
      throw new Error('No ingredients detected in the image');
    }
    
    // Parse the comma-separated ingredients
    const ingredients = ingredientsText
      .split(',')
      .map(ingredient => ingredient.trim())
      .filter(ingredient => ingredient.length > 0 && ingredient.length < 50) // Filter out very long strings
      .slice(0, 20); // Limit to 20 ingredients max
    
    if (ingredients.length === 0) {
      throw new Error('No valid ingredients detected in the image');
    }
    
    return ingredients;
      
  } catch (error) {
    console.error('Error detecting ingredients:', error);
    throw error instanceof Error ? error : new Error('Unknown error occurred while detecting ingredients');
  }
}

/**
 * Generates recipes based on available ingredients and dietary preferences
 */
export async function generateRecipes(
  ingredients: string[], 
  preferences: DietaryPreferences
): Promise<Recipe[]> {
  const isMockMode = import.meta.env.VITE_MOCK === 'true';
  
  if (isMockMode) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Filter mock recipes based on dietary preferences
    return MOCK_RECIPES.filter(recipe => {
      if (preferences.vegetarian && !recipe.dietary?.includes('vegetarian')) {
        return recipe.dietary?.includes('vegan'); // Vegan is also vegetarian
      }
      if (preferences.vegan && !recipe.dietary?.includes('vegan')) {
        return false;
      }
      if (preferences.glutenFree && !recipe.dietary?.includes('gluten-free')) {
        return false;
      }
      if (preferences.dairyFree && !recipe.dietary?.includes('dairy-free')) {
        return false;
      }
      return true;
    });
  }

  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key not found. Please set VITE_OPENAI_API_KEY in your .env file.');
  }

  if (!ingredients || ingredients.length === 0) {
    throw new Error('No ingredients provided for recipe generation');
  }

  try {
    const dietaryText = Object.entries(preferences)
      .filter(([, enabled]) => enabled)
      .map(([key]) => {
        switch (key) {
          case 'vegetarian': return 'vegetarian';
          case 'vegan': return 'vegan';
          case 'glutenFree': return 'gluten-free';
          case 'dairyFree': return 'dairy-free';
          default: return '';
        }
      })
      .filter(Boolean)
      .join(', ');

    const prompt = `
Create 3-5 delicious and practical recipes using primarily these ingredients: ${ingredients.join(', ')}.

${dietaryText ? `IMPORTANT: All recipes must be ${dietaryText}.` : ''}

Guidelines:
- Each recipe should use at least 3 of the provided ingredients
- Include realistic cook times (15-60 minutes)
- Provide clear, step-by-step instructions
- Include common pantry items if needed (salt, pepper, oil, etc.)
- Make recipes practical for home cooking

Return ONLY a valid JSON array with this exact structure:
[
  {
    "id": "recipe_1",
    "title": "Recipe Name",
    "description": "Brief appetizing description (1-2 sentences)",
    "cookTime": "25 mins",
    "difficulty": "easy",
    "ingredients": ["2 chicken breasts", "1 cup broccoli", "2 tbsp olive oil"],
    "instructions": ["Step 1", "Step 2", "Step 3"],
    "dietary": ["vegetarian"]
  }
]

Difficulty levels: "easy", "medium", "hard"
Cook time format: "X mins" or "X hours Y mins"
Dietary tags: "vegetarian", "vegan", "gluten-free", "dairy-free"
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a professional chef and recipe creator. Generate practical, delicious recipes based on available ingredients. Always return valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 3000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const recipesJson = data.choices[0]?.message?.content || '[]';
    
    if (!recipesJson) {
      throw new Error('No recipes generated');
    }
    
    try {
      const recipes = JSON.parse(recipesJson);
      
      // Validate the response structure
      if (!Array.isArray(recipes)) {
        throw new Error('Invalid response format');
      }
      
      // Validate each recipe has required fields
      const validRecipes = recipes.filter(recipe => 
        recipe.id && recipe.title && recipe.ingredients && recipe.instructions
      );
      
      if (validRecipes.length === 0) {
        throw new Error('No valid recipes in response');
      }
      
      return validRecipes;
    } catch (parseError) {
      console.error('Error parsing recipes JSON:', parseError);
      console.error('Raw response:', recipesJson);
      throw new Error('Failed to parse recipe response');
    }
    
  } catch (error) {
    console.error('Error generating recipes:', error);
    throw error instanceof Error ? error : new Error('Unknown error occurred while generating recipes');
  }
}

/**
 * Helper function to convert image file to base64 data URL
 */
async function convertImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert image to base64'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

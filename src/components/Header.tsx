/**
 * Header Component - Reusable navigation header with glassmorphism design
 * Features warm orange branding and responsive layout
 */

import { ChefHat, BookOpen } from 'lucide-react';

interface HeaderProps {
  onMyRecipesClick?: () => void;
  onLogoClick?: () => void;
  isMyRecipesActive?: boolean;
  className?: string;
}

export const Header = ({ 
  onMyRecipesClick, 
  onLogoClick, 
  isMyRecipesActive = false,
  className = ""
}: HeaderProps) => {
  const handleLogoClick = () => {
    if (onLogoClick) {
      onLogoClick();
    }
  };

  const handleMyRecipesClick = () => {
    if (onMyRecipesClick) {
      onMyRecipesClick();
    }
  };

  return (
    <header className={`sticky top-0 z-50 bg-white bg-opacity-95 backdrop-blur-md border-b border-white border-opacity-20 ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex justify-between items-center py-4">
          {/* Logo Section */}
          <button
            onClick={handleLogoClick}
            className="flex items-center space-x-3 group transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-warm-600 focus:ring-opacity-50 rounded-lg p-1"
            aria-label="FridgeChef Home"
          >
            {/* Logo Icon */}
            <div className="w-8 h-8 bg-gradient-to-br from-warm-600 to-warm-700 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-warm transition-all duration-200">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            
            {/* Logo Text */}
            <span className="text-xl font-bold text-gray-800 group-hover:text-orange-600 transition-colors duration-200">
              FridgeChef
            </span>
          </button>

          {/* My Recipes Button */}
          <button
            onClick={handleMyRecipesClick}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 transform
              min-h-[44px] min-w-[44px] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50
              ${isMyRecipesActive 
                ? 'bg-gradient-to-r from-warm-600 to-warm-700 text-white shadow-warm' 
                : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gradient-to-r hover:from-warm-600 hover:to-warm-700 hover:text-white hover:-translate-y-0.5 hover:shadow-warm'
              }
            `}
            aria-label="View My Recipes"
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">My Recipes</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

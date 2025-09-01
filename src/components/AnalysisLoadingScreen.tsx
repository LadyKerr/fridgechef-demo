/**
 * AnalysisLoadingScreen - Engaging AI analysis loading screen
 * Features warm orange gradient, glassmorphism, and delightful animations
 */

import { useState, useEffect } from 'react';
import { Search, Check, ChefHat } from 'lucide-react';

interface AnalysisStep {
  id: string;
  label: string;
  status: 'completed' | 'active' | 'pending';
}

interface AnalysisLoadingScreenProps {
  onComplete?: () => void;
  mode?: 'analysis' | 'generating';
}

export function AnalysisLoadingScreen({ onComplete, mode = 'analysis' }: AnalysisLoadingScreenProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const steps: AnalysisStep[] = mode === 'analysis' ? [
    { id: 'upload', label: 'Photo uploaded successfully', status: 'completed' },
    { id: 'identify', label: 'Identifying ingredients', status: 'pending' },
    { id: 'match', label: 'Matching recipes with your preferences', status: 'pending' },
    { id: 'generate', label: 'Generating personalized recipes', status: 'pending' }
  ] : [
    { id: 'analyze', label: 'Analyzing your ingredients', status: 'completed' },
    { id: 'preferences', label: 'Processing your preferences', status: 'completed' },
    { id: 'matching', label: 'Finding perfect recipe matches', status: 'pending' },
    { id: 'creating', label: 'Creating personalized recipes', status: 'pending' }
  ];

  const [analysisSteps, setAnalysisSteps] = useState(steps);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnalysisSteps(prev => {
        const newSteps = [...prev];
        
        if (currentStepIndex < newSteps.length) {
          // Complete current active step
          if (currentStepIndex > 0) {
            newSteps[currentStepIndex - 1].status = 'completed';
          }
          
          // Set current step as active
          if (currentStepIndex < newSteps.length) {
            newSteps[currentStepIndex].status = 'active';
          }
        }
        
        return newSteps;
      });

      if (currentStepIndex < steps.length) {
        setCurrentStepIndex(prev => prev + 1);
      } else if (!isComplete) {
        // All steps completed
        setAnalysisSteps(prev => prev.map(step => ({ ...step, status: 'completed' as const })));
        setIsComplete(true);
        
        // Redirect after completion
        setTimeout(() => {
          onComplete?.();
        }, 1500);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [currentStepIndex, isComplete, onComplete, steps.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-red-400 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-white rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-2/3 left-1/6 w-16 h-16 bg-white rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Main heading */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-text-glow">
            {isComplete 
              ? 'Analysis Complete!' 
              : mode === 'analysis' 
                ? 'Analyzing Your Fridge' 
                : 'Cooking Up Recipes'
            }
          </h1>
          <p className="text-xl text-white/90 animate-fade-in-out">
            {isComplete 
              ? 'Redirecting you to your personalized recipes...' 
              : mode === 'analysis'
                ? 'Our AI is identifying ingredients from your photo.'
                : 'Our AI chef is creating personalized recipes for you...'
            }
          </p>
        </div>

        {/* Central animation container */}
        <div className="flex justify-center mb-12">
          <div className="relative animate-float">
            {/* Rotating gradient border */}
            <div className="w-32 h-32 rounded-full animate-spin-slow bg-gradient-conic p-1">
              {/* Inner glassmorphism container */}
              <div className="w-full h-full rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-2xl">
                {/* Icon with animation */}
                <div className="relative">
                  {isComplete ? (
                    <ChefHat className="w-12 h-12 text-white animate-bounce" />
                  ) : (
                    <Search className="w-12 h-12 text-white animate-pulse" />
                  )}
                  
                  {/* Pulsing ring effect */}
                  <div className="absolute inset-0 rounded-full border-2 border-white/50 animate-ping"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress steps */}
        <div className="space-y-4">
          {analysisSteps.map((step) => (
            <div
              key={step.id}
              className={`
                relative p-4 rounded-xl transition-all duration-500 transform
                ${step.status === 'active' 
                  ? 'bg-white/25 backdrop-blur-md border-2 border-orange-300 scale-105 shadow-lg' 
                  : 'bg-white/15 backdrop-blur-sm border border-white/20'
                }
              `}
            >
              <div className="flex items-center space-x-4">
                {/* Status icon */}
                <div className={`
                  flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                  ${step.status === 'completed' 
                    ? 'bg-green-500 scale-110' 
                    : step.status === 'active'
                    ? 'bg-orange-500 animate-pulse'
                    : 'bg-gray-400'
                  }
                `}>
                  {step.status === 'completed' ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <div className={`
                      w-3 h-3 rounded-full bg-white
                      ${step.status === 'active' ? 'animate-ping' : ''}
                    `} />
                  )}
                </div>

                {/* Step text */}
                <div className="flex-1">
                  <p className={`
                    font-medium transition-all duration-300
                    ${step.status === 'active' 
                      ? 'text-white text-lg' 
                      : step.status === 'completed'
                      ? 'text-white/90'
                      : 'text-white/70'
                    }
                  `}>
                    {step.label}
                  </p>
                </div>

                {/* Active step indicator */}
                {step.status === 'active' && (
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-orange-300 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>

              {/* Active step glow effect */}
              {step.status === 'active' && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-400/20 to-red-400/20 -z-10 blur-lg"></div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom text */}
        <div className="text-center mt-8">
          <p className="text-white/80 text-sm">
            Made with ❤️ for better cooking experiences
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Pause, 
  SkipForward, 
  X, 
  ChevronLeft, 
  ChevronRight,
  MapPin,
  Target,
  Lightbulb,
  CheckCircle,
  Circle
} from "lucide-react";

export interface TourStep {
  id: string;
  title: string;
  content: string;
  target: string; // CSS selector for the element to highlight
  placement: 'top' | 'bottom' | 'left' | 'right';
  action?: 'click' | 'hover' | 'input' | 'observe';
  actionDescription?: string;
  tip?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  nextButton?: string;
  optional?: boolean;
}

export interface TourConfiguration {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: string;
  steps: TourStep[];
  prerequisites?: string[];
  learningObjectives: string[];
}

interface GuidedTourProps {
  tours: TourConfiguration[];
  isOpen: boolean;
  onClose: () => void;
  onTourComplete: (tourId: string) => void;
  currentTour?: string;
  userLevel: 'beginner' | 'intermediate' | 'advanced';
}

export function GuidedTour({
  tours,
  isOpen,
  onClose,
  onTourComplete,
  currentTour,
  userLevel
}: GuidedTourProps) {
  const [selectedTour, setSelectedTour] = useState<TourConfiguration | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [highlightPosition, setHighlightPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const [tourTooltipPosition, setTourTooltipPosition] = useState({ top: 0, left: 0 });
  
  const highlightRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const difficultyColors = {
    beginner: "bg-green-100 text-green-800 border-green-200",
    intermediate: "bg-blue-100 text-blue-800 border-blue-200",
    advanced: "bg-purple-100 text-purple-800 border-purple-200"
  };

  // Filter tours based on user level
  const availableTours = tours.filter(tour => {
    const levelOrder = { beginner: 1, intermediate: 2, advanced: 3 };
    return levelOrder[tour.difficulty] <= levelOrder[userLevel];
  });

  // Auto-select tour if currentTour is provided
  useEffect(() => {
    if (currentTour) {
      const tour = tours.find(t => t.id === currentTour);
      if (tour) {
        setSelectedTour(tour);
        setIsActive(true);
        setCurrentStep(0);
      }
    }
  }, [currentTour, tours]);

  // Update highlight position when step changes
  useEffect(() => {
    if (isActive && selectedTour && selectedTour.steps[currentStep]) {
      const step = selectedTour.steps[currentStep];
      updateHighlight(step.target);
    }
  }, [currentStep, isActive, selectedTour]);

  const updateHighlight = (targetSelector: string) => {
    const element = document.querySelector(targetSelector);
    if (element) {
      const rect = element.getBoundingClientRect();
      const scrollX = window.pageXOffset;
      const scrollY = window.pageYOffset;
      
      setHighlightPosition({
        top: rect.top + scrollY,
        left: rect.left + scrollX,
        width: rect.width,
        height: rect.height
      });

      // Calculate tooltip position based on step placement
      const step = selectedTour?.steps[currentStep];
      if (step && tooltipRef.current) {
        const tooltipRect = tooltipRef.current.getBoundingClientRect();
        let tooltipTop = rect.top + scrollY;
        let tooltipLeft = rect.left + scrollX;

        switch (step.placement) {
          case 'top':
            tooltipTop = rect.top + scrollY - tooltipRect.height - 12;
            tooltipLeft = rect.left + scrollX + rect.width / 2 - tooltipRect.width / 2;
            break;
          case 'bottom':
            tooltipTop = rect.top + scrollY + rect.height + 12;
            tooltipLeft = rect.left + scrollX + rect.width / 2 - tooltipRect.width / 2;
            break;
          case 'left':
            tooltipTop = rect.top + scrollY + rect.height / 2 - tooltipRect.height / 2;
            tooltipLeft = rect.left + scrollX - tooltipRect.width - 12;
            break;
          case 'right':
            tooltipTop = rect.top + scrollY + rect.height / 2 - tooltipRect.height / 2;
            tooltipLeft = rect.left + scrollX + rect.width + 12;
            break;
        }

        // Boundary adjustments
        if (tooltipLeft < 12) tooltipLeft = 12;
        if (tooltipLeft + tooltipRect.width > window.innerWidth - 12) {
          tooltipLeft = window.innerWidth - tooltipRect.width - 12;
        }
        if (tooltipTop < 12) tooltipTop = 12;

        setTourTooltipPosition({ top: tooltipTop, left: tooltipLeft });
      }

      // Scroll element into view
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const startTour = (tour: TourConfiguration) => {
    setSelectedTour(tour);
    setCurrentStep(0);
    setIsActive(true);
    setIsPaused(false);
    setCompletedSteps(new Set());
  };

  const nextStep = () => {
    if (selectedTour && currentStep < selectedTour.steps.length - 1) {
      // Mark current step as completed
      const newCompleted = new Set(completedSteps);
      newCompleted.add(selectedTour.steps[currentStep].id);
      setCompletedSteps(newCompleted);
      
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipStep = () => {
    if (selectedTour && selectedTour.steps[currentStep].optional) {
      nextStep();
    }
  };

  const pauseTour = () => {
    setIsPaused(!isPaused);
  };

  const exitTour = () => {
    setIsActive(false);
    setSelectedTour(null);
    setCurrentStep(0);
    setCompletedSteps(new Set());
    onClose();
  };

  const completeTour = () => {
    if (selectedTour) {
      // Mark all steps as completed
      const allSteps = new Set(selectedTour.steps.map(s => s.id));
      setCompletedSteps(allSteps);
      onTourComplete(selectedTour.id);
    }
    
    setTimeout(() => {
      exitTour();
    }, 2000);
  };

  const progress = selectedTour ? ((currentStep + 1) / selectedTour.steps.length) * 100 : 0;

  if (!isOpen && !isActive) return null;

  return (
    <>
      {/* Tour Selection Modal */}
      {!isActive && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Guided Learning Tours</h2>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <p className="text-gray-600 text-sm mb-6">
                Choose a guided tour to learn about transformer attention step by step. 
                Tours are tailored to your level: <strong>{userLevel}</strong>.
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                {availableTours.map((tour) => (
                  <Card key={tour.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{tour.title}</h3>
                        <Badge className={`text-xs ${difficultyColors[tour.difficulty]}`}>
                          {tour.difficulty}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{tour.description}</p>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {tour.steps.length} steps
                          </span>
                          <span>{tour.estimatedDuration}</span>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <h4 className="text-xs font-medium text-gray-800 mb-1">Learning Objectives:</h4>
                        <ul className="text-xs text-gray-600 space-y-0.5">
                          {tour.learningObjectives.slice(0, 3).map((objective, idx) => (
                            <li key={idx} className="flex items-start gap-1">
                              <Target className="w-2 h-2 mt-1 flex-shrink-0" />
                              {objective}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {tour.prerequisites && tour.prerequisites.length > 0 && (
                        <div className="mb-3">
                          <h4 className="text-xs font-medium text-gray-800 mb-1">Prerequisites:</h4>
                          <div className="flex flex-wrap gap-1">
                            {tour.prerequisites.map((prereq, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {prereq}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <Button
                        onClick={() => startTour(tour)}
                        className="w-full"
                        size="sm"
                      >
                        <Play className="w-3 h-3 mr-2" />
                        Start Tour
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Active Tour Overlay */}
      {isActive && selectedTour && (
        <>
          {/* Overlay */}
          <div className="fixed inset-0 bg-black bg-opacity-30 z-40" />
          
          {/* Highlight */}
          <div
            className="fixed z-40 border-4 border-blue-500 rounded-lg pointer-events-none transition-all duration-300"
            style={{
              top: highlightPosition.top - 4,
              left: highlightPosition.left - 4,
              width: highlightPosition.width + 8,
              height: highlightPosition.height + 8,
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.3)'
            }}
          />
          
          {/* Tour Tooltip */}
          <div
            ref={tooltipRef}
            className="fixed z-50 w-80"
            style={{
              top: tourTooltipPosition.top,
              left: tourTooltipPosition.left
            }}
          >
            <Card className="shadow-xl">
              <CardContent className="p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge className={`text-xs ${difficultyColors[selectedTour.difficulty]}`}>
                      {selectedTour.difficulty}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      Step {currentStep + 1} of {selectedTour.steps.length}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={exitTour}>
                    <X className="w-3 h-3" />
                  </Button>
                </div>
                
                {/* Progress */}
                <Progress value={progress} className="mb-3" />
                
                {/* Step Content */}
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {selectedTour.steps[currentStep].title}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1">
                      {selectedTour.steps[currentStep].content}
                    </p>
                  </div>
                  
                  {selectedTour.steps[currentStep].action && (
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <div className="flex items-start gap-2">
                        <Target className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-xs font-medium text-blue-900">
                            Action: {selectedTour.steps[currentStep].action}
                          </div>
                          {selectedTour.steps[currentStep].actionDescription && (
                            <div className="text-xs text-blue-800 mt-1">
                              {selectedTour.steps[currentStep].actionDescription}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {selectedTour.steps[currentStep].tip && (
                    <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div className="text-xs text-yellow-800">
                          <strong>Tip:</strong> {selectedTour.steps[currentStep].tip}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Controls */}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={prevStep}
                      disabled={currentStep === 0}
                    >
                      <ChevronLeft className="w-3 h-3 mr-1" />
                      Back
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={pauseTour}
                    >
                      {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                    </Button>
                    
                    {selectedTour.steps[currentStep].optional && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={skipStep}
                      >
                        <SkipForward className="w-3 h-3 mr-1" />
                        Skip
                      </Button>
                    )}
                  </div>
                  
                  <Button
                    onClick={nextStep}
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    {currentStep === selectedTour.steps.length - 1 ? (
                      <>
                        <CheckCircle className="w-3 h-3" />
                        Complete
                      </>
                    ) : (
                      <>
                        {selectedTour.steps[currentStep].nextButton || 'Next'}
                        <ChevronRight className="w-3 h-3" />
                      </>
                    )}
                  </Button>
                </div>
                
                {/* Step Progress Indicators */}
                <div className="flex items-center justify-center gap-1 mt-3 pt-3 border-t">
                  {selectedTour.steps.map((step, idx) => (
                    <button
                      key={step.id}
                      onClick={() => setCurrentStep(idx)}
                      className="p-1"
                    >
                      {completedSteps.has(step.id) ? (
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      ) : idx === currentStep ? (
                        <Circle className="w-3 h-3 text-blue-500 fill-current" />
                      ) : (
                        <Circle className="w-3 h-3 text-gray-300" />
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </>
  );
}
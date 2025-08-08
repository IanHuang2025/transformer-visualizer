"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { BookOpen, HelpCircle, ChevronRight, CheckCircle, Sparkles, ArrowRight, RefreshCw, Play, Pause, SkipForward, RotateCcw, Lightbulb } from 'lucide-react';

interface LibraryItem {
  id: string;
  title: string;
  keywords: string[];
  content: string;
  relevanceToQuery: number;
}

interface QueryKeyValueTutorialProps {
  onComplete?: () => void;
  onSkip?: () => void;
}

const libraryItems: LibraryItem[] = [
  {
    id: "cats",
    title: "All About Cats",
    keywords: ["cats", "feline", "pets", "animals", "domestic"],
    content: "Cats are independent, graceful creatures that make wonderful companions.",
    relevanceToQuery: 0.9
  },
  {
    id: "furniture", 
    title: "Furniture Guide",
    keywords: ["chair", "table", "mat", "furniture", "home"],
    content: "Mats and rugs provide comfort and decoration for living spaces.",
    relevanceToQuery: 0.7
  },
  {
    id: "verbs",
    title: "Action Words",
    keywords: ["sit", "sat", "run", "jump", "actions", "verbs"],
    content: "Sitting is a common resting position for both humans and animals.",
    relevanceToQuery: 0.8
  },
  {
    id: "cooking",
    title: "Cooking Basics", 
    keywords: ["cook", "recipe", "kitchen", "food", "ingredients"],
    content: "Basic cooking techniques for beginners and experienced chefs.",
    relevanceToQuery: 0.1
  },
  {
    id: "space",
    title: "Space Exploration",
    keywords: ["space", "planets", "astronauts", "rockets", "universe"],
    content: "Discovering the mysteries of our solar system and beyond.",
    relevanceToQuery: 0.05
  }
];

export default function QueryKeyValueTutorial({ onComplete, onSkip }: QueryKeyValueTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentQuery, setCurrentQuery] = useState("What do we know about cats sitting?");
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [transformationStep, setTransformationStep] = useState(0);
  const [completedActivities, setCompletedActivities] = useState<Set<number>>(new Set());
  const [userHasAskedQuery, setUserHasAskedQuery] = useState(false);
  const [userHasExploredBooks, setUserHasExploredBooks] = useState(false);
  const [userHasSeenTransformation, setUserHasSeenTransformation] = useState(false);

  const sampleEmbedding = [0.2, -0.5, 0.8, 0.1, -0.3, 0.6, 0.4, -0.2];
  const queryVector = [0.7, -0.2, 0.9, 0.3, -0.1, 0.5, 0.8, -0.4];
  const keyVector = [0.6, -0.3, 0.7, 0.2, 0.1, 0.4, 0.5, -0.1];
  const valueVector = [0.9, -0.1, 0.6, 0.4, -0.2, 0.8, 0.3, -0.3];

  const steps = [
    {
      title: "The Library Analogy",
      description: "Understand how Query, Key, Value works like a library research system",
      action: "Ask a question to start your research!"
    },
    {
      title: "Exploring the Library",
      description: "See how Keys advertise what each book contains",
      action: "Click on different books to see their keywords (Keys)"
    },
    {
      title: "From Embedding to Q, K, V",
      description: "Watch how one embedding becomes Query, Key, and Value vectors",
      action: "Step through the mathematical transformation"
    }
  ];

  const handleQuerySubmit = () => {
    setUserHasAskedQuery(true);
    if (currentStep === 0) {
      setCurrentStep(1);
      setCompletedActivities(prev => new Set(prev).add(0));
    }
  };

  const handleBookClick = (bookId: string) => {
    setSelectedBook(bookId);
    if (!userHasExploredBooks) {
      setUserHasExploredBooks(true);
    }
    
    if (currentStep === 1 && userHasExploredBooks) {
      // After exploring books, can advance
      setTimeout(() => {
        setCompletedActivities(prev => new Set(prev).add(1));
      }, 500);
    }
  };

  const handleTransformationStep = () => {
    if (transformationStep < 3) {
      setTransformationStep(prev => prev + 1);
    }
    
    if (transformationStep === 2 && currentStep === 2) {
      setCompletedActivities(prev => new Set(prev).add(2));
      setUserHasSeenTransformation(true);
    }
  };

  const resetTransformation = () => {
    setTransformationStep(0);
  };

  const LibrarySection = () => {
    if (currentStep < 1) return null;

    return (
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-600" />
            The Magic Library
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-amber-700">
            Your query: <span className="font-semibold">"{currentQuery}"</span>
          </div>
          
          <div className="text-sm text-amber-700 mb-4">
            Click on books to see their keywords (Keys) and content (Values):
          </div>
          
          <div className="grid gap-3">
            {libraryItems.map((item) => {
              const isSelected = selectedBook === item.id;
              const relevanceColor = item.relevanceToQuery > 0.7 ? 'green' : 
                                   item.relevanceToQuery > 0.4 ? 'yellow' : 'gray';
              
              return (
                <div key={item.id} className="space-y-2">
                  <button
                    onClick={() => handleBookClick(item.id)}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      isSelected
                        ? "bg-amber-100 border-amber-400 shadow-md"
                        : "bg-white hover:bg-amber-50 border-amber-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-amber-900">{item.title}</div>
                        <div className="text-sm text-amber-700 mt-1">
                          Keywords: {item.keywords.slice(0, 3).join(", ")}...
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`text-xs px-2 py-1 rounded-full ${
                          relevanceColor === 'green' ? 'bg-green-100 text-green-800' :
                          relevanceColor === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {Math.round(item.relevanceToQuery * 100)}% relevant
                        </div>
                      </div>
                    </div>
                  </button>
                  
                  {isSelected && (
                    <div className="bg-white p-4 rounded-lg border border-amber-300 ml-4">
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm font-semibold text-amber-900 mb-1">🏷️ Keys (What this book advertises):</div>
                          <div className="flex flex-wrap gap-1">
                            {item.keywords.map((keyword, idx) => (
                              <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-sm font-semibold text-amber-900 mb-1">📖 Value (Actual content):</div>
                          <div className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                            {item.content}
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-sm font-semibold text-amber-900 mb-1">🎯 Why this relevance score?</div>
                          <div className="text-xs text-gray-600">
                            {item.relevanceToQuery > 0.7 ? 
                              "High relevance: Keywords match your query very well!" :
                              item.relevanceToQuery > 0.4 ?
                              "Medium relevance: Some keywords match your query." :
                              "Low relevance: Few keywords match your query."
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {userHasExploredBooks && currentStep === 1 && (
            <div className="text-center pt-4">
              <Button 
                onClick={() => setCurrentStep(2)}
                className="bg-amber-600 hover:bg-amber-700"
              >
                I understand how Keys and Values work! <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const QuerySection = () => {
    return (
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            Ask Your Research Question (Query)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-blue-700">
            In the library analogy, your Query is like asking the librarian a research question:
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-blue-200">
            <div className="text-lg font-semibold text-center text-blue-900 mb-3">
              "{currentQuery}"
            </div>
            
            <div className="text-sm text-blue-700 text-center">
              This is your <strong>Query</strong> - what you're looking for in the library.
            </div>
          </div>
          
          <div className="flex gap-2">
            <input 
              type="text" 
              value={currentQuery}
              onChange={(e) => setCurrentQuery(e.target.value)}
              className="flex-1 p-2 border rounded-lg text-sm"
              placeholder="Enter your research question..."
            />
            <Button onClick={handleQuerySubmit} className="bg-blue-600 hover:bg-blue-700">
              Ask Question
            </Button>
          </div>
          
          {userHasAskedQuery && (
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <div className="text-sm text-green-800">
                ✅ Great! Now the librarian (attention mechanism) will search through all books to find the most relevant information for your query.
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const TransformationSection = () => {
    const [autoPlay, setAutoPlay] = useState(false);
    const [playSpeed, setPlaySpeed] = useState(1000);
    const [isPlaying, setIsPlaying] = useState(false);
    
    if (currentStep < 2) return null;

    const playAutoTransformation = async () => {
      setIsPlaying(true);
      setTransformationStep(0);
      
      for (let step = 1; step <= 3; step++) {
        await new Promise(resolve => setTimeout(resolve, playSpeed));
        setTransformationStep(step);
      }
      
      setIsPlaying(false);
    };

    const VectorDisplay = ({ title, vector, color, description, isHighlighted = false, stepNumber }: {
      title: string;
      vector: number[];
      color: string;
      description: string;
      isHighlighted?: boolean;
      stepNumber?: number;
    }) => (
      <div className={`p-4 rounded-lg border transition-all duration-500 ${
        isHighlighted 
          ? `bg-${color}-100 border-${color}-400 shadow-lg transform scale-105` 
          : `bg-${color}-50 border-${color}-200`
      }`}>
        <div className={`text-base font-semibold text-${color}-900 mb-3 flex items-center gap-2`}>
          {stepNumber && (
            <div className={`w-6 h-6 bg-${color}-500 text-white rounded-full flex items-center justify-center text-xs font-bold`}>
              {stepNumber}
            </div>
          )}
          {title}
        </div>
        
        {/* Enhanced Vector Visualization */}
        <div className="space-y-3">
          <div className="grid grid-cols-4 gap-1 mb-2">
            {vector.map((val, idx) => (
              <div key={idx} className="text-center">
                <div className={`px-2 py-2 text-xs font-mono bg-${color}-200 text-${color}-800 rounded transition-all hover:scale-110`}>
                  {val.toFixed(1)}
                </div>
                <div className="text-xs text-gray-500 mt-1">d{idx}</div>
              </div>
            ))}
          </div>
          
          {/* Vector Magnitude and Properties */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className={`bg-${color}-200 rounded p-2 text-center`}>
              <div className="font-bold">Magnitude</div>
              <div>{Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0)).toFixed(2)}</div>
            </div>
            <div className={`bg-${color}-200 rounded p-2 text-center`}>
              <div className="font-bold">Max Value</div>
              <div>{Math.max(...vector).toFixed(1)}</div>
            </div>
            <div className={`bg-${color}-200 rounded p-2 text-center`}>
              <div className="font-bold">Min Value</div>
              <div>{Math.min(...vector).toFixed(1)}</div>
            </div>
          </div>
        </div>
        
        <div className={`text-sm text-${color}-700 mt-3 p-2 bg-${color}-100 rounded`}>
          {description}
        </div>
      </div>
    );

    return (
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            Interactive Transformation: Embedding → Q, K, V
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Control Panel */}
          <div className="bg-white p-4 rounded-lg border flex items-center justify-between">
            <div className="text-sm text-purple-700">
              Watch how a single embedding transforms into three specialized vectors:
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={playAutoTransformation}
                disabled={isPlaying}
                className="bg-purple-600 hover:bg-purple-700"
                size="sm"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Playing...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Auto Play
                  </>
                )}
              </Button>
              
              <select 
                value={playSpeed}
                onChange={(e) => setPlaySpeed(Number(e.target.value))}
                className="text-xs border rounded px-2 py-1"
                disabled={isPlaying}
              >
                <option value={500}>Fast</option>
                <option value={1000}>Normal</option>
                <option value={1500}>Slow</option>
              </select>
            </div>
          </div>
          
          {/* Transformation Steps */}
          <div className="space-y-4">
            {/* Step 0: Original Embedding */}
            <VectorDisplay
              title="Original Token Embedding"
              vector={sampleEmbedding}
              color="gray"
              description="This is the original vector representation of a token (e.g., 'cat'). Each dimension captures different aspects of the word's meaning."
              isHighlighted={transformationStep >= 0}
              stepNumber={0}
            />
            
            {/* Mathematical Transformation Arrows */}
            {transformationStep >= 1 && (
              <div className="flex items-center justify-center py-2">
                <div className="flex items-center gap-4">
                  <div className="text-purple-600 text-2xl">×</div>
                  <div className="text-sm font-mono bg-purple-100 px-3 py-2 rounded border">
                    W<sub>Q</sub>, W<sub>K</sub>, W<sub>V</sub>
                  </div>
                  <ArrowRight className="w-5 h-5 text-purple-600" />
                  <div className="text-sm text-purple-700">Three specialized transformations</div>
                </div>
              </div>
            )}
            
            {/* Query, Key, Value in parallel */}
            {transformationStep >= 1 && (
              <div className="grid md:grid-cols-3 gap-4">
                {/* Query */}
                <div className={`transform transition-all duration-500 ${transformationStep >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                  <VectorDisplay
                    title="Query (Q)"
                    vector={queryVector}
                    color="blue"
                    description="The 'search query' - what information is this token looking for from other tokens?"
                    isHighlighted={transformationStep === 1}
                    stepNumber={1}
                  />
                </div>
                
                {/* Key */}
                <div className={`transform transition-all duration-500 delay-200 ${transformationStep >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                  <VectorDisplay
                    title="Key (K)"
                    vector={keyVector}
                    color="orange"
                    description="The 'advertisement' - what information does this token have to offer to others?"
                    isHighlighted={transformationStep === 2}
                    stepNumber={2}
                  />
                </div>
                
                {/* Value */}
                <div className={`transform transition-all duration-500 delay-400 ${transformationStep >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                  <VectorDisplay
                    title="Value (V)"
                    vector={valueVector}
                    color="green"
                    description="The 'content' - what information does this token actually contain and contribute?"
                    isHighlighted={transformationStep === 3}
                    stepNumber={3}
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Manual Controls */}
          <div className="flex justify-center gap-2 pt-4">
            <Button
              onClick={handleTransformationStep}
              disabled={transformationStep >= 3 || isPlaying}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <SkipForward className="w-4 h-4 mr-2" />
              {transformationStep === 0 ? "Start Transformation" :
               transformationStep === 1 ? "Add Key (K)" :
               transformationStep === 2 ? "Add Value (V)" :
               "Transformation Complete!"}
            </Button>
            <Button 
              variant="outline" 
              onClick={resetTransformation}
              disabled={isPlaying}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
          
          {/* Completion Message */}
          {transformationStep >= 3 && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div className="text-lg font-semibold text-green-800">Transformation Complete! 🎉</div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="bg-blue-100 p-3 rounded border">
                  <div className="font-semibold text-blue-900 mb-1">🔍 Query (Q)</div>
                  <div className="text-blue-800">
                    "What am I looking for?" - Acts like a search query to find relevant information from other tokens.
                  </div>
                </div>
                
                <div className="bg-orange-100 p-3 rounded border">
                  <div className="font-semibold text-orange-900 mb-1">🏷️ Key (K)</div>
                  <div className="text-orange-800">
                    "What do I advertise?" - Like a catalog entry that describes what this token offers.
                  </div>
                </div>
                
                <div className="bg-green-100 p-3 rounded border">
                  <div className="font-semibold text-green-900 mb-1">📦 Value (V)</div>
                  <div className="text-green-800">
                    "What do I contain?" - The actual information payload that gets shared with other tokens.
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-purple-100 rounded border border-purple-300">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-purple-600" />
                  <span className="font-semibold text-purple-900">Key Insight:</span>
                </div>
                <div className="text-purple-800 text-sm">
                  The same token embedding becomes three different "roles" through learned linear transformations. 
                  This allows each token to simultaneously ask questions (Q), advertise its capabilities (K), 
                  and provide information (V) in the attention mechanism!
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const allActivitiesComplete = completedActivities.size >= steps.length;

  return (
    <TooltipProvider>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-gradient-to-r from-teal-50 to-blue-50 border-teal-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-teal-600" />
                  Query, Key, Value Tutorial
                </CardTitle>
                <p className="text-sm text-teal-700 mt-2">
                  Learn the library analogy for understanding Q, K, V mechanics
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={onSkip}>
                  Skip Tutorial
                </Button>
                {allActivitiesComplete && (
                  <Button onClick={onComplete} className="bg-green-600 hover:bg-green-700">
                    Continue <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center space-x-4">
          {steps.map((_, index) => (
            <div key={index} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                completedActivities.has(index)
                  ? "bg-green-500 text-white"
                  : currentStep === index
                  ? "bg-teal-500 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}>
                {completedActivities.has(index) ? <CheckCircle className="w-4 h-4" /> : index + 1}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 h-0.5 mx-2 transition-all ${
                  completedActivities.has(index) ? "bg-green-500" : "bg-gray-200"
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Current Step */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{steps[currentStep].title}</CardTitle>
            <p className="text-sm text-muted-foreground">{steps[currentStep].description}</p>
          </CardHeader>
          <CardContent>
            <div className="bg-teal-50 p-3 rounded-lg border border-teal-200">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span className="text-sm font-medium text-teal-900">Your Task:</span>
              </div>
              <p className="text-sm text-teal-800 mt-1">{steps[currentStep].action}</p>
            </div>
          </CardContent>
        </Card>

        {/* Content Sections */}
        <QuerySection />
        <LibrarySection />
        <TransformationSection />

        {/* Summary and Key Insights */}
        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              Key Insights: The Q, K, V System
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <HelpCircle className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-blue-900">Query (Q)</span>
                </div>
                <div className="text-sm text-blue-800">
                  "What am I looking for?" - Like asking a specific research question at the library
                </div>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-4 h-4 text-orange-600" />
                  <span className="font-semibold text-orange-900">Key (K)</span>
                </div>
                <div className="text-sm text-orange-800">
                  "What do I advertise?" - Like book titles and keywords that help with searching
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-green-600" />
                  <span className="font-semibold text-green-900">Value (V)</span>
                </div>
                <div className="text-sm text-green-800">
                  "What do I actually contain?" - Like the actual content inside the books
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border">
              <div className="text-sm font-medium mb-2">🎯 What's Next?</div>
              <div className="text-sm text-gray-700">
                Now you understand how each token gets three specialized "roles"! Next, you'll see how these Q, K, V vectors are used to create the <strong>attention matrix</strong> - the mathematical heart of attention.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
"use client";

import React from "react";
import { Modal, ModalHeader, ModalBody } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Sparkles, 
  BookOpen, 
  Lightbulb, 
  Rocket, 
  GraduationCap, 
  Brain, 
  Code,
  ArrowRight,
  Star,
  Target,
  Zap
} from "lucide-react";

export type LearningPath = "beginner" | "intermediate" | "advanced";

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPathSelect: (path: LearningPath) => void;
}

export function WelcomeModal({ isOpen, onClose, onPathSelect }: WelcomeModalProps) {
  const handlePathSelection = (path: LearningPath) => {
    onPathSelect(path);
    onClose();
  };

  const learningPaths = [
    {
      id: "beginner" as LearningPath,
      title: "I'm completely new to transformers",
      subtitle: "Start with the basics",
      description: "Perfect for newcomers! We'll guide you through the fundamentals with simple explanations and intuitive analogies.",
      icon: <GraduationCap className="w-8 h-8" />,
      color: "bg-green-500",
      features: [
        "Simple, jargon-free explanations",
        "Visual analogies and metaphors",
        "Step-by-step guided tour",
        "Focus on intuition over math"
      ],
      badge: "🌱 Beginner Friendly",
      buttonText: "Start Learning"
    },
    {
      id: "intermediate" as LearningPath,
      title: "I know some basics",
      subtitle: "Dive deeper into details",
      description: "Great for those with some ML background. Get detailed explanations with key concepts and interactive quizzes.",
      icon: <Brain className="w-8 h-8" />,
      color: "bg-blue-500",
      features: [
        "Detailed concept explanations",
        "Interactive knowledge checks",
        "Mathematical intuition",
        "Real-world applications"
      ],
      badge: "🌿 Intermediate Level",
      buttonText: "Explore Details"
    },
    {
      id: "advanced" as LearningPath,
      title: "I want to explore freely",
      subtitle: "Technical deep dive",
      description: "For experienced practitioners. Access all controls, mathematical formulations, and implementation details.",
      icon: <Code className="w-8 h-8" />,
      color: "bg-purple-500",
      features: [
        "Full mathematical formulas",
        "Implementation insights",
        "Advanced optimization tips",
        "Production considerations"
      ],
      badge: "🌳 Advanced Mode",
      buttonText: "Dive Deep"
    }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalHeader onClose={onClose}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome to the Transformer Attention Visualizer!
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Learn how transformers understand relationships between words
            </p>
          </div>
        </div>
      </ModalHeader>

      <ModalBody className="space-y-6">
        {/* Purpose Section */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-lg font-semibold text-gray-800">
            <Target className="w-5 h-5 text-blue-500" />
            What You&apos;ll Learn
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mb-2">
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-blue-900 text-sm">Attention Mechanism</h3>
              <p className="text-xs text-blue-700 text-center mt-1">
                How models focus on relevant words
              </p>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-green-50 rounded-xl border border-green-100">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mb-2">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-green-900 text-sm">Query-Key-Value</h3>
              <p className="text-xs text-green-700 text-center mt-1">
                The building blocks of attention
              </p>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-purple-50 rounded-xl border border-purple-100">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mb-2">
                <Star className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-purple-900 text-sm">Multi-Head Processing</h3>
              <p className="text-xs text-purple-700 text-center mt-1">
                Parallel attention patterns
              </p>
            </div>
          </div>
        </div>

        {/* Learning Path Selection */}
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Choose Your Learning Path</h2>
            <p className="text-gray-600 text-sm">
              Select the approach that best matches your background and goals
            </p>
          </div>

          <div className="grid gap-4">
            {learningPaths.map((path) => (
              <Card 
                key={path.id}
                className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer border-2 hover:border-blue-200"
                onClick={() => handlePathSelection(path.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`${path.color} p-3 rounded-2xl text-white flex-shrink-0`}>
                      {path.icon}
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-900">{path.title}</h3>
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                            {path.badge}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 font-medium">{path.subtitle}</p>
                        <p className="text-sm text-gray-500 mt-1">{path.description}</p>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-2">
                        {path.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0" />
                            {feature}
                          </div>
                        ))}
                      </div>
                      
                      <Button 
                        className="w-full mt-3"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePathSelection(path.id);
                        }}
                      >
                        <Rocket className="w-4 h-4 mr-2" />
                        {path.buttonText}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Optional: Skip for now option */}
        <div className="text-center pt-4 border-t border-gray-100">
          <Button 
            variant="ghost" 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Skip for now (you can restart this anytime)
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
}
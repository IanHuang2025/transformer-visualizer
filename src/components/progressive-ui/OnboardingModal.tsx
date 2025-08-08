"use client";

import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Play, 
  BookOpen, 
  Settings, 
  ChevronRight,
  Lightbulb,
  Target,
  CheckCircle
} from "lucide-react";
import { useLearningJourney, JourneyStep, getStepTitle, getStepDescription } from "@/hooks/useLearningJourney";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ONBOARDING_STEPS: { step: JourneyStep; icon: React.ReactNode; color: string }[] = [
  { step: "text-input", icon: <Play className="w-5 h-5" />, color: "bg-blue-500" },
  { step: "tokenization", icon: <Target className="w-5 h-5" />, color: "bg-green-500" },
  { step: "attention-intro", icon: <Lightbulb className="w-5 h-5" />, color: "bg-yellow-500" },
  { step: "embed", icon: <BookOpen className="w-5 h-5" />, color: "bg-purple-500" },
  { step: "qkv", icon: <Settings className="w-5 h-5" />, color: "bg-indigo-500" },
  { step: "complete", icon: <CheckCircle className="w-5 h-5" />, color: "bg-emerald-500" }
];

export function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const { learningPath, currentStep, completedSteps, setCurrentStep } = useLearningJourney();
  
  const handleStartJourney = () => {
    setCurrentStep("text-input");
    onClose();
  };

  const getPathMessage = () => {
    switch (learningPath) {
      case "beginner":
        return "We'll guide you step-by-step through the basics with simple explanations and visual aids.";
      case "intermediate":
        return "You'll get detailed explanations with interactive elements and knowledge checks.";
      case "free-explore":
        return "All features are available. You can explore at your own pace.";
      default:
        return "Choose your path to get started with transformer attention visualization.";
    }
  };

  const getPathIcon = () => {
    switch (learningPath) {
      case "beginner": return "🌱";
      case "intermediate": return "🌿";
      case "free-explore": return "🌳";
      default: return "📚";
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalHeader onClose={onClose}>
        <div className="flex items-center gap-3">
          <div className="text-2xl">{getPathIcon()}</div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Ready to Start Your Learning Journey?
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {learningPath === "beginner" && "Beginner Path"}
              {learningPath === "intermediate" && "Intermediate Path"}
              {learningPath === "free-explore" && "Free Exploration"}
            </p>
          </div>
        </div>
      </ModalHeader>

      <ModalBody className="space-y-6">
        {/* Path Description */}
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
          <p className="text-sm text-blue-800">{getPathMessage()}</p>
        </div>

        {/* Journey Overview */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Learning Journey</h3>
          <div className="space-y-3">
            {ONBOARDING_STEPS.map((item, index) => {
              const isCompleted = completedSteps.has(item.step);
              const isCurrent = currentStep === item.step;
              
              return (
                <div key={item.step} className={`flex items-center gap-4 p-3 rounded-lg border transition-all ${
                  isCompleted 
                    ? "bg-green-50 border-green-200" 
                    : isCurrent 
                    ? "bg-blue-50 border-blue-200"
                    : "bg-gray-50 border-gray-200"
                }`}>
                  <div className={`${item.color} p-2 rounded-full text-white`}>
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{getStepTitle(item.step)}</span>
                      {isCompleted && <CheckCircle className="w-4 h-4 text-green-600" />}
                    </div>
                    <p className="text-sm text-gray-600">{getStepDescription(item.step)}</p>
                  </div>
                  <div className="text-xs text-gray-500 font-mono">
                    {index + 1}/{ONBOARDING_STEPS.length}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Tips */}
        <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-sm font-medium text-yellow-900">Quick Tips</span>
              <div className="text-sm text-yellow-800 mt-1 space-y-1">
                <p>• Click on tokens to see how they pay attention to other words</p>
                <p>• Switch between attention heads to see different perspectives</p>
                <p>• Use the step navigator to understand the complete process</p>
              </div>
            </div>
          </div>
        </div>
      </ModalBody>

      <ModalFooter>
        <Button variant="outline" onClick={onClose}>
          Skip for Now
        </Button>
        <Button onClick={handleStartJourney} className="ml-3">
          Start Learning Journey
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </ModalFooter>
    </Modal>
  );
}
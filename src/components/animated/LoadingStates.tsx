"use client";

import React from 'react';
import { useAnimation, useAnimationClasses } from '@/contexts/AnimationContext';
import { Loader2, CheckCircle, AlertCircle, Clock, Zap } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'purple' | 'orange';
}

export function LoadingSpinner({ size = 'md', color = 'blue' }: LoadingSpinnerProps) {
  const animationClasses = useAnimationClasses();
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  };
  
  const colorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600'
  };

  return (
    <Loader2 className={`
      ${sizeClasses[size]} 
      ${colorClasses[color]} 
      ${animationClasses.enabled ? 'animate-spin' : ''}
    `} />
  );
}

interface LoadingDotsProps {
  color?: 'blue' | 'green' | 'purple' | 'orange';
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingDots({ color = 'blue', size = 'md' }: LoadingDotsProps) {
  const animationClasses = useAnimationClasses();
  
  const sizeClasses = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2',
    lg: 'w-3 h-3'
  };
  
  const colorClasses = {
    blue: 'bg-blue-600',
    green: 'bg-green-600', 
    purple: 'bg-purple-600',
    orange: 'bg-orange-600'
  };

  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className={`
            ${sizeClasses[size]} 
            ${colorClasses[color]} 
            rounded-full
            ${animationClasses.enabled ? 'animate-loading-dots' : ''}
          `}
          style={{
            animationDelay: `${index * 150}ms`
          }}
        />
      ))}
    </div>
  );
}

interface ProgressBarProps {
  progress: number; // 0-100
  label?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange';
  showPercentage?: boolean;
  animated?: boolean;
}

export function ProgressBar({ 
  progress, 
  label, 
  color = 'blue', 
  showPercentage = true,
  animated = true 
}: ProgressBarProps) {
  const animationClasses = useAnimationClasses();
  
  const colorClasses = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    purple: 'bg-purple-600', 
    orange: 'bg-orange-600'
  };
  
  const bgColorClasses = {
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    purple: 'bg-purple-100',
    orange: 'bg-orange-100'
  };

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>{label}</span>
          {showPercentage && <span>{Math.round(progress)}%</span>}
        </div>
      )}
      <div className={`w-full h-2 ${bgColorClasses[color]} rounded-full overflow-hidden`}>
        <div
          className={`
            h-full ${colorClasses[color]} transition-all duration-300
            ${animated && animationClasses.enabled ? 'animate-progress-fill' : ''}
          `}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
}

interface PulseLoaderProps {
  count?: number;
  color?: 'blue' | 'green' | 'purple' | 'orange';
  size?: 'sm' | 'md' | 'lg';
}

export function PulseLoader({ count = 3, color = 'blue', size = 'md' }: PulseLoaderProps) {
  const animationClasses = useAnimationClasses();
  
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };
  
  const colorClasses = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    purple: 'bg-purple-600',
    orange: 'bg-orange-600'
  };

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`
            ${sizeClasses[size]} 
            ${colorClasses[color]} 
            rounded-full
            ${animationClasses.enabled ? 'animate-pulse' : ''}
          `}
          style={{
            animationDelay: `${index * 200}ms`
          }}
        />
      ))}
    </div>
  );
}

interface StatusIndicatorProps {
  status: 'loading' | 'success' | 'error' | 'pending';
  message: string;
  showIcon?: boolean;
}

export function StatusIndicator({ status, message, showIcon = true }: StatusIndicatorProps) {
  const animationClasses = useAnimationClasses();
  
  const statusConfig = {
    loading: {
      icon: <LoadingSpinner size="sm" color="blue" />,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200'
    },
    success: {
      icon: <CheckCircle className="w-4 h-4 text-green-600" />,
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200'
    },
    error: {
      icon: <AlertCircle className="w-4 h-4 text-red-600" />,
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      borderColor: 'border-red-200'
    },
    pending: {
      icon: <Clock className="w-4 h-4 text-gray-600" />,
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-700', 
      borderColor: 'border-gray-200'
    }
  };
  
  const config = statusConfig[status];

  return (
    <div className={`
      flex items-center gap-2 px-3 py-2 rounded-lg border text-sm
      ${config.bgColor} ${config.textColor} ${config.borderColor}
      ${animationClasses.fadeInUp}
    `}>
      {showIcon && config.icon}
      <span>{message}</span>
    </div>
  );
}

interface CalculationStepperProps {
  steps: string[];
  currentStep: number;
  completedSteps: number[];
  isProcessing?: boolean;
}

export function CalculationStepper({ 
  steps, 
  currentStep, 
  completedSteps,
  isProcessing = false 
}: CalculationStepperProps) {
  const animationClasses = useAnimationClasses();

  return (
    <div className="space-y-3">
      {steps.map((step, index) => {
        const isCompleted = completedSteps.includes(index);
        const isCurrent = currentStep === index;
        const isActive = isCurrent && isProcessing;
        
        return (
          <div key={index} className={`
            flex items-center gap-3 p-3 rounded-lg transition-all duration-300
            ${isCurrent 
              ? 'bg-blue-50 border border-blue-200' 
              : isCompleted 
              ? 'bg-green-50 border border-green-200'
              : 'bg-gray-50 border border-gray-200'
            }
          `}>
            {/* Step indicator */}
            <div className={`
              w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
              transition-all duration-300
              ${isCompleted 
                ? 'bg-green-500 text-white' 
                : isCurrent
                ? 'bg-blue-500 text-white'
                : 'bg-gray-300 text-gray-600'
              }
            `}>
              {isCompleted ? (
                <CheckCircle className="w-4 h-4" />
              ) : isActive ? (
                <LoadingSpinner size="sm" color="blue" />
              ) : (
                index + 1
              )}
            </div>
            
            {/* Step description */}
            <div className={`
              flex-1 text-sm transition-colors duration-300
              ${isCurrent 
                ? 'text-blue-800 font-medium' 
                : isCompleted
                ? 'text-green-800'
                : 'text-gray-600'
              }
            `}>
              {step}
            </div>
            
            {/* Activity indicator */}
            {isActive && (
              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4 text-yellow-500" />
                <LoadingDots color="blue" size="sm" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

interface ButtonLoadingProps {
  isLoading: boolean;
  children: React.ReactNode;
  loadingText?: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function ButtonLoading({ 
  isLoading, 
  children, 
  loadingText = "Loading...",
  className = "",
  onClick,
  disabled = false
}: ButtonLoadingProps) {
  const animationClasses = useAnimationClasses();

  return (
    <button
      className={`
        relative flex items-center justify-center gap-2 px-4 py-2 rounded-lg
        transition-all duration-200 font-medium text-sm
        ${disabled || isLoading
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
        }
        ${animationClasses.buttonHover}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <>
          <LoadingSpinner size="sm" color="blue" />
          <span>{loadingText}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

interface RippleEffectProps {
  x: number;
  y: number;
  onAnimationEnd: () => void;
}

export function RippleEffect({ x, y, onAnimationEnd }: RippleEffectProps) {
  const animationClasses = useAnimationClasses();

  return (
    <div
      className={`
        absolute pointer-events-none
        ${animationClasses.enabled ? 'animate-ping' : ''}
      `}
      style={{
        left: x - 10,
        top: y - 10,
        width: 20,
        height: 20
      }}
      onAnimationEnd={onAnimationEnd}
    >
      <div className="w-full h-full bg-blue-400 rounded-full opacity-30" />
    </div>
  );
}
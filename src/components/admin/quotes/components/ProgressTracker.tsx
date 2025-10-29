import React from 'react'

interface Step {
  num: number
  label: string
  icon: string
}

interface ProgressTrackerProps {
  currentStep: number
  totalSteps: number
  onStepClick: (step: number) => void
}

const steps: Step[] = [
  { num: 1, label: 'Basic Info', icon: '📋' },
  { num: 2, label: 'Scope', icon: '🎯' },
  { num: 3, label: 'Pricing', icon: '💰' },
  { num: 4, label: 'Timeline', icon: '📅' },
  { num: 5, label: 'Terms', icon: '📄' },
  { num: 6, label: 'Review', icon: '✅' },
]

export default function ProgressTracker({
  currentStep,
  totalSteps,
  onStepClick,
}: ProgressTrackerProps) {
  return (
    <div className="flex items-center justify-between">
      {steps.map((step, idx) => (
        <div key={step.num} className="flex items-center">
          <button
            onClick={() => onStepClick(step.num)}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all transform hover:scale-105 ${
              currentStep === step.num
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/50'
                : currentStep > step.num
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-900/50'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            <span className="text-xl">{step.icon}</span>
            <div className="text-left">
              <div className="text-xs opacity-75">Step {step.num}</div>
              <div className="font-semibold">{step.label}</div>
            </div>
            {currentStep > step.num && (
              <span className="ml-1 text-green-600 dark:text-green-400">✓</span>
            )}
          </button>
          {idx < steps.length - 1 && (
            <div className="relative h-1 w-8 sm:w-12 mx-1 sm:mx-2">
              <div className="absolute inset-0 bg-slate-300 dark:bg-slate-600 rounded-full" />
              <div
                className={`absolute inset-0 rounded-full transition-all duration-500 ${
                  currentStep > step.num
                    ? 'bg-gradient-to-r from-green-500 to-green-600'
                    : 'bg-transparent'
                }`}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

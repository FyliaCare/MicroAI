import React, { useState } from 'react'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import { QuoteData } from '../types'

interface Step2Props {
  quoteData: QuoteData
  setQuoteData: React.Dispatch<React.SetStateAction<QuoteData>>
}

export default function Step2Scope({ quoteData, setQuoteData }: Step2Props) {
  const [newObjective, setNewObjective] = useState('')
  const [newScope, setNewScope] = useState('')
  const [newOutOfScope, setNewOutOfScope] = useState('')
  const [newAssumption, setNewAssumption] = useState('')
  const [newConstraint, setNewConstraint] = useState('')

  const addToArray = (
    field: keyof QuoteData,
    value: string,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (!value.trim()) return
    setQuoteData((prev) => ({
      ...prev,
      [field]: [...(prev[field] as string[]), value.trim()],
    }))
    setter('')
  }

  const removeFromArray = (field: keyof QuoteData, index: number) => {
    setQuoteData((prev) => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index),
    }))
  }

  return (
    <Card className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Project Scope & Requirements
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Define what's included, excluded, and key assumptions
        </p>
      </div>

      <div className="space-y-8">
        {/* Executive Summary */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Executive Summary *
          </label>
          <Textarea
            value={quoteData.executiveSummary}
            onChange={(e) =>
              setQuoteData((prev) => ({
                ...prev,
                executiveSummary: e.target.value,
              }))
            }
            placeholder="Provide a high-level overview of the project, its objectives, and expected outcomes..."
            rows={5}
            className="text-base"
          />
          <p className="text-xs text-slate-500 mt-1">
            This will appear at the top of the quote document
          </p>
        </div>

        {/* Project Objectives */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Project Objectives
          </label>
          <div className="flex gap-2 mb-3">
            <Input
              value={newObjective}
              onChange={(e) => setNewObjective(e.target.value)}
              placeholder="Add a project objective..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addToArray('objectives', newObjective, setNewObjective)
                }
              }}
            />
            <Button
              onClick={() =>
                addToArray('objectives', newObjective, setNewObjective)
              }
              type="button"
            >
              Add
            </Button>
          </div>
          <div className="space-y-2">
            {quoteData.objectives.map((obj, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg group hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
              >
                <span className="text-indigo-600 dark:text-indigo-400 mt-0.5 text-lg">
                  🎯
                </span>
                <span className="flex-1 text-slate-900 dark:text-white">
                  {obj}
                </span>
                <button
                  onClick={() => removeFromArray('objectives', idx)}
                  className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity font-bold text-lg"
                >
                  ×
                </button>
              </div>
            ))}
            {quoteData.objectives.length === 0 && (
              <p className="text-sm text-slate-500 italic py-2">
                No objectives added yet. Add at least one to proceed.
              </p>
            )}
          </div>
        </div>

        {/* Scope of Work */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Scope of Work (What's Included) *
          </label>
          <div className="flex gap-2 mb-3">
            <Input
              value={newScope}
              onChange={(e) => setNewScope(e.target.value)}
              placeholder="Add a scope item..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addToArray('scope', newScope, setNewScope)
                }
              }}
            />
            <Button
              onClick={() => addToArray('scope', newScope, setNewScope)}
              type="button"
            >
              Add
            </Button>
          </div>
          <div className="space-y-2">
            {quoteData.scope.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg group hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
              >
                <span className="text-green-600 dark:text-green-400 mt-0.5 text-lg">
                  ✓
                </span>
                <span className="flex-1 text-slate-900 dark:text-white">
                  {item}
                </span>
                <button
                  onClick={() => removeFromArray('scope', idx)}
                  className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity font-bold text-lg"
                >
                  ×
                </button>
              </div>
            ))}
            {quoteData.scope.length === 0 && (
              <p className="text-sm text-slate-500 italic py-2">
                No scope items added. This is required to proceed.
              </p>
            )}
          </div>
        </div>

        {/* Out of Scope */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Out of Scope (Exclusions)
          </label>
          <div className="flex gap-2 mb-3">
            <Input
              value={newOutOfScope}
              onChange={(e) => setNewOutOfScope(e.target.value)}
              placeholder="Add an exclusion..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addToArray('outOfScope', newOutOfScope, setNewOutOfScope)
                }
              }}
            />
            <Button
              onClick={() =>
                addToArray('outOfScope', newOutOfScope, setNewOutOfScope)
              }
              type="button"
            >
              Add
            </Button>
          </div>
          <div className="space-y-2">
            {quoteData.outOfScope.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg group hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              >
                <span className="text-red-600 dark:text-red-400 mt-0.5 text-lg">
                  ×
                </span>
                <span className="flex-1 text-slate-900 dark:text-white">
                  {item}
                </span>
                <button
                  onClick={() => removeFromArray('outOfScope', idx)}
                  className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity font-bold text-lg"
                >
                  ×
                </button>
              </div>
            ))}
            {quoteData.outOfScope.length === 0 && (
              <p className="text-sm text-slate-500 italic py-2">
                Clearly state what's not included to avoid scope creep
              </p>
            )}
          </div>
        </div>

        {/* Assumptions */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Assumptions
          </label>
          <div className="flex gap-2 mb-3">
            <Input
              value={newAssumption}
              onChange={(e) => setNewAssumption(e.target.value)}
              placeholder="Add an assumption..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addToArray('assumptions', newAssumption, setNewAssumption)
                }
              }}
            />
            <Button
              onClick={() =>
                addToArray('assumptions', newAssumption, setNewAssumption)
              }
              type="button"
            >
              Add
            </Button>
          </div>
          <div className="space-y-2">
            {quoteData.assumptions.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg group hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors"
              >
                <span className="text-yellow-600 dark:text-yellow-400 mt-0.5 text-lg">
                  ⚠
                </span>
                <span className="flex-1 text-slate-900 dark:text-white">
                  {item}
                </span>
                <button
                  onClick={() => removeFromArray('assumptions', idx)}
                  className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity font-bold text-lg"
                >
                  ×
                </button>
              </div>
            ))}
            {quoteData.assumptions.length === 0 && (
              <p className="text-sm text-slate-500 italic py-2">
                List key assumptions about the project
              </p>
            )}
          </div>
        </div>

        {/* Constraints */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Constraints & Limitations
          </label>
          <div className="flex gap-2 mb-3">
            <Input
              value={newConstraint}
              onChange={(e) => setNewConstraint(e.target.value)}
              placeholder="Add a constraint..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addToArray('constraints', newConstraint, setNewConstraint)
                }
              }}
            />
            <Button
              onClick={() =>
                addToArray('constraints', newConstraint, setNewConstraint)
              }
              type="button"
            >
              Add
            </Button>
          </div>
          <div className="space-y-2">
            {quoteData.constraints.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg group hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
              >
                <span className="text-orange-600 dark:text-orange-400 mt-0.5 text-lg">
                  🚧
                </span>
                <span className="flex-1 text-slate-900 dark:text-white">
                  {item}
                </span>
                <button
                  onClick={() => removeFromArray('constraints', idx)}
                  className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity font-bold text-lg"
                >
                  ×
                </button>
              </div>
            ))}
            {quoteData.constraints.length === 0 && (
              <p className="text-sm text-slate-500 italic py-2">
                Define any technical, budgetary, or timeline constraints
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
        <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
          <span className="text-lg">💡</span>
          <span>
            <strong>Pro Tip:</strong> Be thorough with scope definition to avoid misunderstandings and scope creep later.
          </span>
        </p>
      </div>
    </Card>
  )
}

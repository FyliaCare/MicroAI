'use client'

import { useState } from 'react'
import { 
  Target, 
  FileText, 
  XCircle, 
  CheckCircle, 
  Package, 
  Plus, 
  Trash2, 
  Edit2,
  GripVertical
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

interface ScopeTabProps {
  formData: any
  updateFormData: (field: string, value: any) => void
}

interface ListItem {
  id: string
  text: string
}

export default function ScopeTab({ formData, updateFormData }: ScopeTabProps) {
  const [newObjective, setNewObjective] = useState('')
  const [newScopeItem, setNewScopeItem] = useState('')
  const [newExclusion, setNewExclusion] = useState('')
  const [newAssumption, setNewAssumption] = useState('')
  const [newDeliverable, setNewDeliverable] = useState('')
  
  const [editingObjective, setEditingObjective] = useState<number | null>(null)
  const [editingScopeItem, setEditingScopeItem] = useState<number | null>(null)
  const [editingExclusion, setEditingExclusion] = useState<number | null>(null)
  const [editingAssumption, setEditingAssumption] = useState<number | null>(null)
  const [editingDeliverable, setEditingDeliverable] = useState<number | null>(null)

  // Objectives Management
  const addObjective = () => {
    if (newObjective.trim()) {
      updateFormData('objectives', [...formData.objectives, newObjective.trim()])
      setNewObjective('')
    }
  }

  const updateObjective = (index: number, value: string) => {
    const updated = [...formData.objectives]
    updated[index] = value
    updateFormData('objectives', updated)
    setEditingObjective(null)
  }

  const removeObjective = (index: number) => {
    updateFormData('objectives', formData.objectives.filter((_: any, i: number) => i !== index))
  }

  // Scope Items Management
  const addScopeItem = () => {
    if (newScopeItem.trim()) {
      updateFormData('scopeItems', [...formData.scopeItems, newScopeItem.trim()])
      setNewScopeItem('')
    }
  }

  const updateScopeItem = (index: number, value: string) => {
    const updated = [...formData.scopeItems]
    updated[index] = value
    updateFormData('scopeItems', updated)
    setEditingScopeItem(null)
  }

  const removeScopeItem = (index: number) => {
    updateFormData('scopeItems', formData.scopeItems.filter((_: any, i: number) => i !== index))
  }

  // Exclusions Management
  const addExclusion = () => {
    if (newExclusion.trim()) {
      updateFormData('exclusions', [...formData.exclusions, newExclusion.trim()])
      setNewExclusion('')
    }
  }

  const updateExclusion = (index: number, value: string) => {
    const updated = [...formData.exclusions]
    updated[index] = value
    updateFormData('exclusions', updated)
    setEditingExclusion(null)
  }

  const removeExclusion = (index: number) => {
    updateFormData('exclusions', formData.exclusions.filter((_: any, i: number) => i !== index))
  }

  // Assumptions Management
  const addAssumption = () => {
    if (newAssumption.trim()) {
      updateFormData('assumptions', [...formData.assumptions, newAssumption.trim()])
      setNewAssumption('')
    }
  }

  const updateAssumption = (index: number, value: string) => {
    const updated = [...formData.assumptions]
    updated[index] = value
    updateFormData('assumptions', updated)
    setEditingAssumption(null)
  }

  const removeAssumption = (index: number) => {
    updateFormData('assumptions', formData.assumptions.filter((_: any, i: number) => i !== index))
  }

  // Deliverables Management
  const addDeliverable = () => {
    if (newDeliverable.trim()) {
      updateFormData('deliverables', [...formData.deliverables, newDeliverable.trim()])
      setNewDeliverable('')
    }
  }

  const updateDeliverable = (index: number, value: string) => {
    const updated = [...formData.deliverables]
    updated[index] = value
    updateFormData('deliverables', updated)
    setEditingDeliverable(null)
  }

  const removeDeliverable = (index: number) => {
    updateFormData('deliverables', formData.deliverables.filter((_: any, i: number) => i !== index))
  }

  return (
    <div className="space-y-6">
      {/* Project Objectives */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Target className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-gray-900">Project Objectives</h2>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Define the key goals and objectives this project aims to achieve.
        </p>

        {/* Add New Objective */}
        <div className="flex space-x-2 mb-4">
          <input
            type="text"
            value={newObjective}
            onChange={(e) => setNewObjective(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addObjective()}
            placeholder="Enter project objective..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <Button onClick={addObjective} disabled={!newObjective.trim()}>
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>

        {/* Objectives List */}
        <div className="space-y-2">
          {formData.objectives.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Target className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No objectives added yet</p>
            </div>
          ) : (
            formData.objectives.map((objective: string, index: number) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors"
              >
                <GripVertical className="w-5 h-5 text-gray-400 mt-0.5 cursor-move" />
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                {editingObjective === index ? (
                  <input
                    type="text"
                    defaultValue={objective}
                    onBlur={(e) => updateObjective(index, e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && updateObjective(index, e.currentTarget.value)}
                    autoFocus
                    className="flex-1 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                ) : (
                  <p className="flex-1 text-gray-900">{objective}</p>
                )}
                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setEditingObjective(index)}
                    className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeObjective(index)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Scope of Work */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <FileText className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-gray-900">Scope of Work</h2>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          List all items and services included in this project.
        </p>

        {/* Add New Scope Item */}
        <div className="flex space-x-2 mb-4">
          <input
            type="text"
            value={newScopeItem}
            onChange={(e) => setNewScopeItem(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addScopeItem()}
            placeholder="Enter scope item..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <Button onClick={addScopeItem} disabled={!newScopeItem.trim()}>
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>

        {/* Scope Items List */}
        <div className="space-y-2">
          {formData.scopeItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No scope items added yet</p>
            </div>
          ) : (
            formData.scopeItems.map((item: string, index: number) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-3 bg-indigo-50 rounded-lg group hover:bg-indigo-100 transition-colors"
              >
                <GripVertical className="w-5 h-5 text-gray-400 mt-0.5 cursor-move" />
                <CheckCircle className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                {editingScopeItem === index ? (
                  <input
                    type="text"
                    defaultValue={item}
                    onBlur={(e) => updateScopeItem(index, e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && updateScopeItem(index, e.currentTarget.value)}
                    autoFocus
                    className="flex-1 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                ) : (
                  <p className="flex-1 text-gray-900">{item}</p>
                )}
                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setEditingScopeItem(index)}
                    className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeScopeItem(index)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Exclusions */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <XCircle className="w-5 h-5 text-red-600" />
          <h2 className="text-lg font-semibold text-gray-900">Exclusions</h2>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Specify what is explicitly NOT included in this project scope.
        </p>

        {/* Add New Exclusion */}
        <div className="flex space-x-2 mb-4">
          <input
            type="text"
            value={newExclusion}
            onChange={(e) => setNewExclusion(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addExclusion()}
            placeholder="Enter exclusion..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <Button onClick={addExclusion} disabled={!newExclusion.trim()}>
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>

        {/* Exclusions List */}
        <div className="space-y-2">
          {formData.exclusions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <XCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No exclusions added yet</p>
            </div>
          ) : (
            formData.exclusions.map((exclusion: string, index: number) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg group hover:bg-red-100 transition-colors"
              >
                <GripVertical className="w-5 h-5 text-gray-400 mt-0.5 cursor-move" />
                <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                {editingExclusion === index ? (
                  <input
                    type="text"
                    defaultValue={exclusion}
                    onBlur={(e) => updateExclusion(index, e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && updateExclusion(index, e.currentTarget.value)}
                    autoFocus
                    className="flex-1 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                ) : (
                  <p className="flex-1 text-gray-900">{exclusion}</p>
                )}
                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setEditingExclusion(index)}
                    className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeExclusion(index)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Assumptions */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <CheckCircle className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Assumptions</h2>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          List assumptions made during project planning and execution.
        </p>

        {/* Add New Assumption */}
        <div className="flex space-x-2 mb-4">
          <input
            type="text"
            value={newAssumption}
            onChange={(e) => setNewAssumption(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addAssumption()}
            placeholder="Enter assumption..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <Button onClick={addAssumption} disabled={!newAssumption.trim()}>
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>

        {/* Assumptions List */}
        <div className="space-y-2">
          {formData.assumptions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No assumptions added yet</p>
            </div>
          ) : (
            formData.assumptions.map((assumption: string, index: number) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg group hover:bg-blue-100 transition-colors"
              >
                <GripVertical className="w-5 h-5 text-gray-400 mt-0.5 cursor-move" />
                <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                {editingAssumption === index ? (
                  <input
                    type="text"
                    defaultValue={assumption}
                    onBlur={(e) => updateAssumption(index, e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && updateAssumption(index, e.currentTarget.value)}
                    autoFocus
                    className="flex-1 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                ) : (
                  <p className="flex-1 text-gray-900">{assumption}</p>
                )}
                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setEditingAssumption(index)}
                    className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeAssumption(index)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Deliverables */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Package className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-semibold text-gray-900">Deliverables</h2>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Define the tangible outputs and deliverables the client will receive.
        </p>

        {/* Add New Deliverable */}
        <div className="flex space-x-2 mb-4">
          <input
            type="text"
            value={newDeliverable}
            onChange={(e) => setNewDeliverable(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addDeliverable()}
            placeholder="Enter deliverable..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <Button onClick={addDeliverable} disabled={!newDeliverable.trim()}>
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>

        {/* Deliverables List */}
        <div className="space-y-2">
          {formData.deliverables.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No deliverables added yet</p>
            </div>
          ) : (
            formData.deliverables.map((deliverable: string, index: number) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg group hover:bg-purple-100 transition-colors"
              >
                <GripVertical className="w-5 h-5 text-gray-400 mt-0.5 cursor-move" />
                <Package className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                {editingDeliverable === index ? (
                  <input
                    type="text"
                    defaultValue={deliverable}
                    onBlur={(e) => updateDeliverable(index, e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && updateDeliverable(index, e.currentTarget.value)}
                    autoFocus
                    className="flex-1 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                ) : (
                  <p className="flex-1 text-gray-900">{deliverable}</p>
                )}
                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setEditingDeliverable(index)}
                    className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeDeliverable(index)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  )
}

/**
 * Arc Calculator 2.0 — Engineering Toolkit Type Definitions
 */

export type DisciplineCategory = 'all' | 'electrical' | 'mechanical' | 'civil' | 'computer' | 'math'

export interface ToolVariable {
  id: string
  label: string
  symbol: string
  unit: string
  description: string
  defaultValue: number
  min?: number
  max?: number
  step?: number
}

export interface CalculationOutput {
  resultLabel: string
  value: string
  numericValue: number
  unit: string
  formula: string
  steps: string[]
  assumptions?: string[]
}

export interface EngineeringTool {
  id: string
  name: string
  category: DisciplineCategory
  badge: string
  description: string
  formula: string
  variables: ToolVariable[]
  assumptions: string[]
  calculate: (inputs: Record<string, number>) => CalculationOutput
}

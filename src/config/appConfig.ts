export interface AppConfig {
  name: string
  shortName: string
  tagline: string
  version: string
  description: string
  githubUrl: string
  maxHistoryItems: number
  maxExpressionLength: number
  maxParenthesesDepth: number
}

export const APP_CONFIG: AppConfig = {
  name: 'Arc Calculator',
  shortName: 'ArcCalc',
  tagline: 'Precision Scientific & Standard Calculator',
  version: '1.0.0',
  description: 'A refined, mathematically rigorous scientific calculator web application built for precision, clarity, and daily utility.',
  githubUrl: 'https://github.com/ranaaryandev/arc-calculator',
  maxHistoryItems: 50,
  maxExpressionLength: 300,
  maxParenthesesDepth: 30,
}

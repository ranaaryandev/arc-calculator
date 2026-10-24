export interface AppConfig {
  name: string
  shortName: string
  tagline: string
  version: string
  description: string
  githubUrl: string
  liveUrl: string
  author: string
  maxHistoryItems: number
  maxExpressionLength: number
  maxParenthesesDepth: number
}

export const APP_CONFIG: AppConfig = {
  name: 'Arc Calculator',
  shortName: 'ArcCalc',
  tagline: 'Precision Scientific & Engineering Calculator',
  version: '2.0.0',
  description: 'A refined, mathematically rigorous scientific calculator and university engineering toolkit built for precision, clarity, and daily utility.',
  githubUrl: 'https://github.com/ranaaryandev/arc-calculator',
  liveUrl: 'https://ranaaryandev.github.io/arc-calculator/',
  author: 'ranaaryandev',
  maxHistoryItems: 50,
  maxExpressionLength: 1000,
  maxParenthesesDepth: 40,
}

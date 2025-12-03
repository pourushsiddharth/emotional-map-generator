
export interface CoreEmotion {
  emotion: string;
  intensity: number; // 0-100
}

export interface EmotionalTransition {
  from: string;
  to: string;
  description: string;
}

export interface EmotionalMapAnalysis {
  core_emotions: CoreEmotion[];
  emotional_transitions: EmotionalTransition[];
  triggers: string[];
  psychological_interpretations: string[];
  healing_suggestions: string[];
  empathetic_message: string;
  mermaid_code: string; // Mermaid.js syntax
}

export interface UserInput {
  situation: string;
  language: string;
  age: string;
  country: string;
  apiKey?: string;
}

export enum AppState {
  INPUT = 'INPUT',
  LOADING = 'LOADING',
  RESULTS = 'RESULTS',
  FULLSCREEN = 'FULLSCREEN'
}

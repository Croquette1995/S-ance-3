export type TabId = 
  | 'heritage-pathologies'
  | 'semantic-pillars'
  | 'delegation-mechanism'
  | 'runtime-swap'
  | 'dip-interfaces'
  | 'duel-decision-tree'
  | 'antipatterns-debug'
  | 'angular-garage'
  | 'workshops-lab';

export interface ModuleSection {
  id: TabId;
  index: number;
  title: string;
  shortTitle: string;
  icon: string;
  badge?: string;
  description: string;
  labNumber?: number;
  exerciseCount?: number;
}

export interface ValidationCriterion {
  id: string;
  label: string;
  description: string;
  passed: boolean;
  hint: string;
}

export interface ConsoleLogEntry {
  type: 'log' | 'error' | 'warn' | 'info';
  text: string;
  timestamp: string;
}

export interface Exercise {
  id: string;
  labNumber: number;
  number: string; // e.g. "1.1", "2.3"
  title: string;
  subtitle: string;
  sectionId: TabId;
  estimatedTime: string;
  difficulty: 'Débutant' | 'Facile' | 'Intermédiaire' | 'Avancé';
  statement: string;
  hint: string;
  initialCode: string;
  solutionCode: string;
  currentCode: string;
  isCompleted: boolean;
  criteria: ValidationCriterion[];
  solutionExplanation: string[];
}

export interface QuizQuestion {
  id: number;
  relation: string; // e.g. "Smartphone et Batterie"
  leftItem: string;
  rightItem: string;
  expectedAnswer: 'is-a' | 'has-a';
  userAnswer?: 'is-a' | 'has-a';
  isCorrect?: boolean;
  explanation: string;
  category: string;
}

export interface DecisionNode {
  id: string;
  question: string;
  subtext?: string;
  yesNext?: string;
  noNext?: string;
  outcome?: {
    recommendation: 'COMPOSITION' | 'HERITAGE' | 'INTERFACE';
    title: string;
    description: string;
    badges: string[];
    gofQuote?: string;
  };
}

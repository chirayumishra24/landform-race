export type LandformCategory =
  | "mountains"
  | "valleys"
  | "plateaus"
  | "plains"
  | "rivers"
  | "land-life"
  | "human-activities";

export type LandformZone =
  | "mountains"
  | "valley"
  | "plateau"
  | "plains"
  | "river"
  | "settlement";

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  category: LandformCategory;
  difficulty: "easy" | "medium" | "hard";
  explanation: string;
  image?: string;
  visualType?: "none" | "image" | "terrain" | "map";
  terrainFocus?: LandformZone;
  enabled?: boolean;
}

export interface TeamProgress {
  teamId: "blue" | "orange";
  teamName: string;
  tagline: string;
  color: "blue" | "orange";
  score: number;
  checkpoint: number; // 0 to 15
  correctAnswers: number;
  totalAnswers: number;

  selectedOption: number | null;
  hasSubmitted: boolean;
  isCorrect: boolean | null;

  streak: number;
  maxStreak: number;

  fiftyFiftyRemaining: number;
  landscapeHintsRemaining: number;

  eliminatedOptions: number[];

  currentZone: LandformZone;

  isMoving: boolean;
  isBoosting: boolean;

  // Tracking history for missed questions review
  answeredQuestionsHistory: {
    question: Question;
    selectedOption: number;
    isCorrect: boolean;
  }[];
}

export interface ZoneConfig {
  id: LandformZone;
  title: string;
  rangeText: string;
  startCheckpoint: number;
  endCheckpoint: number;
  description: string;
  lookFor: string[];
  formation: string;
  humanLife: string;
  occupations: string;
  challenges: string;
  opportunities: string;
  color: string;
}

export type GameStatus =
  | "setup"
  | "instructions"
  | "countdown"
  | "playing"
  | "finished"
  | "review"
  | "explorer";

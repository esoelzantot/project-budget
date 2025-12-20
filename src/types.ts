// types.ts
export interface ProjectPage {
  id: number;
  name: string;
  uiHours: string;
  frontendHours: string;
  backendHours: string;
  points: string;
  notes: string;
}

export interface BasePage {
  name: string;
  uiHours: string;
  frontendHours: string;
  backendHours: string;
  points: number;
  notes: string;
}

export interface ManualTotals {
  frontend: {
    hours: string;
    points: string;
    cost: string;
  };
  backend: {
    hours: string;
    points: string;
    cost: string;
  };
  ui: {
    hours: string;
    points: string;
    cost: string;
  };
  analysis: {
    hours: string;
    cost: string;
  };
  testing: {
    hours: string;
    cost: string;
  };
}

export interface Totals {
  totalUI: number;
  totalFrontend: number;
  totalBackend: number;
  totalAnalysis: number;
  totalTesting: number;
  pointsUI: number;
  pointsFrontend: number;
  pointsBackend: number;
}

export type ProjectType = "web" | "mobile" | "desktop";
export type PricingType = "frontend" | "backend" | "ui/ux" | "total";

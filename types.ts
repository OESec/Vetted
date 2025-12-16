
export interface NavLink {
  label: string;
  href: string;
}

export interface Testimonial {
  id: number;
  quote: string;
  author: string;
  role: string;
  company: string;
  image: string;
}

export interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
}

// --- Dashboard Types ---

export interface QuestionnaireRow {
  id: string;
  question: string;
  answer: string;
  category?: string;
  supplier?: string;
  [key: string]: string | undefined;
}

export interface AnalysisResult {
  rowId: string;
  riskLevel: 'High' | 'Medium' | 'Low' | 'Pass';
  feedback: string;
  evidenceRequired: boolean;
  complianceFlag?: string; // e.g., "Non-compliant with SOC2"
}

export type Decision = 'FAIL' | 'CONSIDER' | 'PASS';

export interface AuditReport {
  id: string;
  fileName: string;
  uploadDate: Date;
  masterQuestionnaireName: string; // The standard this report was tested against
  rows: QuestionnaireRow[];
  results: Record<string, AnalysisResult>; // Keyed by rowId
  summary: {
    total: number;
    highRisk: number;
    mediumRisk: number;
    lowRisk: number;
    pass: number;
    score: number;
  };
}

export interface ReviewSet {
  id: string;
  name: string;
  dateCreated: Date;
  status: 'Open' | 'Closed' | 'Archived';
  description: string;
  reports: AuditReport[]; // The reports belonging to this bid/set
}

export interface MasterQuestionnaireRow {
  question: string;
  passAnswer: string;
  considerAnswer: string;
  failAnswer: string;
}

export interface QuestionnaireSet {
  id: string;
  name: string;
  lastUpdated: Date;
  rows: MasterQuestionnaireRow[];
}

export interface OrganizationSettingsData {
  activeSetId: string;
  sets: QuestionnaireSet[];
}
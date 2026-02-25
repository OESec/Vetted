import { AuditReport, AnalysisResult, QuestionnaireRow, ReviewSet, MasterQuestionnaireRow } from './types';

// --- Fully Hardcoded Dummy Data ---

// 1. Enterprise Standard Questions (15 Qs)
export const QUESTIONS = {
    q1: "Do you hold a valid ISO 27001 certification or SOC 2 Type II report?",
    q2: "What information will the organisation be processing?",
    q3: "Is sensitive PII or special category data included?",
    q4: "Where is the data hosted (Data Residency)?",
    q5: "Is data encrypted at rest?",
    q6: "Is data encrypted in transit?",
    q7: "Is Multi-Factor Authentication (MFA) enforced for all access?",
    q8: "Do you conduct annual penetration testing by a third party?",
    q9: "Do you perform regular vulnerability scanning?",
    q10: "Are background checks performed on all employees?",
    q11: "Do you have a documented Incident Response Plan?",
    q12: "Do you have a formal Data Retention and Disposal Policy?",
    q13: "Is there a formal Change Management process?",
    q14: "Do you segregate customer data (Multi-tenancy controls)?",
    q15: "Do you have a Business Continuity / Disaster Recovery plan?"
};

// 2. Rapid Assessment Questions (5 Qs)
export const RAPID_QUESTIONS = {
    q1: QUESTIONS.q1,
    q2: QUESTIONS.q2,
    q5: QUESTIONS.q5,
    q7: QUESTIONS.q7,
    q11: QUESTIONS.q11
};

// Initial Master Data matching the questions above
export const INITIAL_MASTER_DATA: MasterQuestionnaireRow[] = [
    {
        question: QUESTIONS.q1,
        passAnswer: "Yes, active ISO 27001 or SOC 2 Type II.",
        considerAnswer: "SOC 2 Type I or in progress.",
        failAnswer: "No certification."
    },
    {
        question: QUESTIONS.q2,
        passAnswer: "Public data or Internal data only.",
        considerAnswer: "Confidential data.",
        failAnswer: "Strictly Confidential / Secret."
    },
    {
        question: QUESTIONS.q3,
        passAnswer: "No.",
        considerAnswer: "Yes, but tokenized/masked.",
        failAnswer: "Yes, stored in plain text."
    },
    {
        question: QUESTIONS.q4,
        passAnswer: "UK or EU.",
        considerAnswer: "US (with DPF certification).",
        failAnswer: "China, Russia, or undisclosed."
    },
    {
        question: QUESTIONS.q5,
        passAnswer: "Yes, AES-256.",
        considerAnswer: "Yes, but older standard (e.g. 3DES).",
        failAnswer: "No encryption."
    },
    {
        question: QUESTIONS.q6,
        passAnswer: "Yes, TLS 1.2 or higher.",
        considerAnswer: "TLS 1.1 or legacy protocols.",
        failAnswer: "No encryption (HTTP/FTP)."
    },
    {
        question: QUESTIONS.q7,
        passAnswer: "Yes, enforced for all users.",
        considerAnswer: "Admins only.",
        failAnswer: "No MFA."
    },
    {
        question: QUESTIONS.q8,
        passAnswer: "Yes, by third-party annually.",
        considerAnswer: "Internal scans only.",
        failAnswer: "No."
    },
    {
        question: QUESTIONS.q9,
        passAnswer: "Yes, quarterly or continuous.",
        considerAnswer: "Ad-hoc / Irregular.",
        failAnswer: "No."
    },
    {
        question: QUESTIONS.q10,
        passAnswer: "Yes, all employees.",
        considerAnswer: "Key roles only.",
        failAnswer: "No."
    },
    {
        question: QUESTIONS.q11,
        passAnswer: "Yes, tested annually.",
        considerAnswer: "Yes, untested.",
        failAnswer: "No."
    },
    {
        question: QUESTIONS.q12,
        passAnswer: "Yes, automated disposal.",
        considerAnswer: "Manual process.",
        failAnswer: "No policy."
    },
    {
        question: QUESTIONS.q13,
        passAnswer: "Yes, with approval workflows.",
        considerAnswer: "Informal process.",
        failAnswer: "No."
    },
    {
        question: QUESTIONS.q14,
        passAnswer: "Yes, logical segregation.",
        considerAnswer: "Yes, but shared database.",
        failAnswer: "No segregation."
    },
    {
        question: QUESTIONS.q15,
        passAnswer: "Yes, tested annually.",
        considerAnswer: "Yes, untested.",
        failAnswer: "No."
    }
];

// Report 1: Average Vendor (Score ~65) - Enterprise Standard
const R1_ROWS: QuestionnaireRow[] = [
    { id: 'r1-1', question: QUESTIONS.q1, answer: 'We are currently in the readiness phase for SOC2.', category: 'Compliance' },
    { id: 'r1-2', question: QUESTIONS.q2, answer: 'We process customer names and email addresses.', category: 'Data Privacy' },
    { id: 'r1-3', question: QUESTIONS.q3, answer: 'No special category data.', category: 'Data Privacy' },
    { id: 'r1-4', question: QUESTIONS.q4, answer: 'Hosted in AWS US-East.', category: 'Infrastructure' },
    { id: 'r1-5', question: QUESTIONS.q5, answer: 'Yes, AES-256.', category: 'Encryption' },
    { id: 'r1-6', question: QUESTIONS.q6, answer: 'Yes, TLS 1.3.', category: 'Encryption' },
    { id: 'r1-7', question: QUESTIONS.q7, answer: 'Only for administrators.', category: 'Access Control' },
    { id: 'r1-8', question: QUESTIONS.q8, answer: 'We run internal vulnerability scans.', category: 'Vulnerability' },
    { id: 'r1-9', question: QUESTIONS.q9, answer: 'Yes, monthly scans.', category: 'Vulnerability' },
    { id: 'r1-10', question: QUESTIONS.q10, answer: 'No.', category: 'HR Security' },
    { id: 'r1-11', question: QUESTIONS.q11, answer: 'Yes, we have a policy.', category: 'IR' },
    { id: 'r1-12', question: QUESTIONS.q12, answer: 'We delete data upon request.', category: 'Data Governance' },
    { id: 'r1-13', question: QUESTIONS.q13, answer: 'Yes, managed via Jira.', category: 'SDLC' },
    { id: 'r1-14', question: QUESTIONS.q14, answer: 'Logical segregation in Postgres.', category: 'Architecture' },
    { id: 'r1-15', question: QUESTIONS.q15, answer: 'We have backups.', category: 'BC/DR' },
];
const R1_RESULTS: Record<string, AnalysisResult> = {
    'r1-1': { rowId: 'r1-1', riskLevel: 'Medium', feedback: 'SOC2 is not finalized. Request readiness assessment report.', evidenceRequired: true },
    'r1-2': { rowId: 'r1-2', riskLevel: 'Low', feedback: 'Standard PII only.', evidenceRequired: false },
    'r1-3': { rowId: 'r1-3', riskLevel: 'Pass', feedback: 'No sensitive data scope.', evidenceRequired: false },
    'r1-4': { rowId: 'r1-4', riskLevel: 'Medium', feedback: 'US hosting requires Data Privacy Framework or SCCs.', evidenceRequired: true },
    'r1-5': { rowId: 'r1-5', riskLevel: 'Pass', feedback: 'Standard encryption used.', evidenceRequired: false },
    'r1-6': { rowId: 'r1-6', riskLevel: 'Pass', feedback: 'Modern TLS.', evidenceRequired: false },
    'r1-7': { rowId: 'r1-7', riskLevel: 'Medium', feedback: 'MFA should be enforced for ALL users, not just admins.', evidenceRequired: false },
    'r1-8': { rowId: 'r1-8', riskLevel: 'Medium', feedback: 'Internal scans are insufficient. Third-party pentest required annually.', evidenceRequired: true },
    'r1-9': { rowId: 'r1-9', riskLevel: 'Pass', feedback: 'Monthly scanning is acceptable.', evidenceRequired: false },
    'r1-10': { rowId: 'r1-10', riskLevel: 'High', feedback: 'Background checks are mandatory for access to sensitive data.', evidenceRequired: true, complianceFlag: 'Policy Violation' },
    'r1-11': { rowId: 'r1-11', riskLevel: 'Pass', feedback: 'Acceptable.', evidenceRequired: true },
    'r1-12': { rowId: 'r1-12', riskLevel: 'Medium', feedback: 'Manual deletion is prone to error. Prefer automated retention policy.', evidenceRequired: false },
    'r1-13': { rowId: 'r1-13', riskLevel: 'Pass', feedback: 'Good tracking.', evidenceRequired: false },
    'r1-14': { rowId: 'r1-14', riskLevel: 'Pass', feedback: 'Standard multi-tenancy.', evidenceRequired: false },
    'r1-15': { rowId: 'r1-15', riskLevel: 'Medium', feedback: 'Backups are not a DR plan. Need RTO/RPO definitions.', evidenceRequired: true },
};

// Report 2: Excellent Vendor (Score 100) - Enterprise Standard
const R2_ROWS: QuestionnaireRow[] = [
    { id: 'r2-1', question: QUESTIONS.q1, answer: 'Yes, ISO 27001 certified and SOC2 Type II report attached.', category: 'Compliance' },
    { id: 'r2-2', question: QUESTIONS.q2, answer: 'Confidential business data.', category: 'Data Privacy' },
    { id: 'r2-3', question: QUESTIONS.q3, answer: 'No.', category: 'Data Privacy' },
    { id: 'r2-4', question: QUESTIONS.q4, answer: 'EU (Frankfurt Region).', category: 'Infrastructure' },
    { id: 'r2-5', question: QUESTIONS.q5, answer: 'Yes, AES-256 with KMS.', category: 'Encryption' },
    { id: 'r2-6', question: QUESTIONS.q6, answer: 'Yes, TLS 1.3.', category: 'Encryption' },
    { id: 'r2-7', question: QUESTIONS.q7, answer: 'Yes, hardware keys required for all staff.', category: 'Access Control' },
    { id: 'r2-8', question: QUESTIONS.q8, answer: 'Yes, quarterly by third-party firm.', category: 'Vulnerability' },
    { id: 'r2-9', question: QUESTIONS.q9, answer: 'Automated daily scanning.', category: 'Vulnerability' },
    { id: 'r2-10', question: QUESTIONS.q10, answer: 'Yes, criminal and credit checks.', category: 'HR Security' },
    { id: 'r2-11', question: QUESTIONS.q11, answer: 'Yes, tested annually with table-top exercises.', category: 'IR' },
    { id: 'r2-12', question: QUESTIONS.q12, answer: 'Yes, automated lifecycle management.', category: 'Data Governance' },
    { id: 'r2-13', question: QUESTIONS.q13, answer: 'Strict CI/CD with peer review enforcement.', category: 'SDLC' },
    { id: 'r2-14', question: QUESTIONS.q14, answer: 'Row-level security and tenant isolation.', category: 'Architecture' },
    { id: 'r2-15', question: QUESTIONS.q15, answer: 'Yes, hot-standby failover.', category: 'BC/DR' },
];
const R2_RESULTS: Record<string, AnalysisResult> = {
    'r2-1': { rowId: 'r2-1', riskLevel: 'Pass', feedback: 'Verified compliant.', evidenceRequired: false },
    'r2-2': { rowId: 'r2-2', riskLevel: 'Pass', feedback: 'Appropriate controls for confidential data.', evidenceRequired: false },
    'r2-3': { rowId: 'r2-3', riskLevel: 'Pass', feedback: 'Low risk data profile.', evidenceRequired: false },
    'r2-4': { rowId: 'r2-4', riskLevel: 'Pass', feedback: 'Compliant with EU residency preference.', evidenceRequired: false },
    'r2-5': { rowId: 'r2-5', riskLevel: 'Pass', feedback: 'Strong key management practices.', evidenceRequired: false },
    'r2-6': { rowId: 'r2-6', riskLevel: 'Pass', feedback: 'Strong transport encryption.', evidenceRequired: false },
    'r2-7': { rowId: 'r2-7', riskLevel: 'Pass', feedback: 'Gold standard MFA implementation.', evidenceRequired: false },
    'r2-8': { rowId: 'r2-8', riskLevel: 'Pass', feedback: 'Exceeds annual requirement.', evidenceRequired: false },
    'r2-9': { rowId: 'r2-9', riskLevel: 'Pass', feedback: 'Continuous monitoring.', evidenceRequired: false },
    'r2-10': { rowId: 'r2-10', riskLevel: 'Pass', feedback: 'Comprehensive screening.', evidenceRequired: false },
    'r2-11': { rowId: 'r2-11', riskLevel: 'Pass', feedback: 'Strong proactive IR stance.', evidenceRequired: false },
    'r2-12': { rowId: 'r2-12', riskLevel: 'Pass', feedback: 'Good automation.', evidenceRequired: false },
    'r2-13': { rowId: 'r2-13', riskLevel: 'Pass', feedback: 'Secure SDLC.', evidenceRequired: false },
    'r2-14': { rowId: 'r2-14', riskLevel: 'Pass', feedback: 'Strong isolation.', evidenceRequired: false },
    'r2-15': { rowId: 'r2-15', riskLevel: 'Pass', feedback: 'High availability.', evidenceRequired: false },
};

// Report 3: High Risk Vendor (Score 0) - Rapid Assessment (5 Qs)
const R3_ROWS: QuestionnaireRow[] = [
    { id: 'r3-1', question: RAPID_QUESTIONS.q1, answer: 'What is SOC2?', category: 'Compliance' },
    { id: 'r3-2', question: RAPID_QUESTIONS.q2, answer: 'Financial records and HR data.', category: 'Data Privacy' },
    { id: 'r3-3', question: RAPID_QUESTIONS.q5, answer: 'No, data is on internal network only.', category: 'Encryption' },
    { id: 'r3-4', question: RAPID_QUESTIONS.q7, answer: 'No, we use complex passwords.', category: 'Access Control' },
    { id: 'r3-5', question: RAPID_QUESTIONS.q11, answer: 'We call IT support.', category: 'IR' },
];
const R3_RESULTS: Record<string, AnalysisResult> = {
    'r3-1': { rowId: 'r3-1', riskLevel: 'High', feedback: 'Lack of awareness of basic standards.', evidenceRequired: false, complianceFlag: 'Education Required' },
    'r3-2': { rowId: 'r3-2', riskLevel: 'High', feedback: 'Sensitive data processed without adequate controls.', evidenceRequired: false },
    'r3-3': { rowId: 'r3-3', riskLevel: 'High', feedback: 'Data must be encrypted regardless of network location.', evidenceRequired: true, complianceFlag: 'Critical Gap' },
    'r3-4': { rowId: 'r3-4', riskLevel: 'High', feedback: 'Passwords are insufficient. MFA is mandatory.', evidenceRequired: false, complianceFlag: 'Weak Auth' },
    'r3-5': { rowId: 'r3-5', riskLevel: 'High', feedback: 'No formal process defined.', evidenceRequired: true },
};

// Report 4: Modern Startup (Score 80) - Rapid Assessment (5 Qs)
const R4_ROWS: QuestionnaireRow[] = [
    { id: 'r4-1', question: RAPID_QUESTIONS.q1, answer: 'We are too small for SOC2.', category: 'Compliance' },
    { id: 'r4-2', question: RAPID_QUESTIONS.q2, answer: 'Application logs and user profiles.', category: 'Data Privacy' },
    { id: 'r4-3', question: RAPID_QUESTIONS.q5, answer: 'Yes, ChaCha20-Poly1305 everywhere.', category: 'Encryption' },
    { id: 'r4-4', question: RAPID_QUESTIONS.q7, answer: 'Yes, Okta for everything.', category: 'Access Control' },
    { id: 'r4-5', question: RAPID_QUESTIONS.q11, answer: 'We rely on AWS availability zones.', category: 'IR' },
];
const R4_RESULTS: Record<string, AnalysisResult> = {
    'r4-1': { rowId: 'r4-1', riskLevel: 'Medium', feedback: 'Size is not an excuse. Suggest ISO 27001 Essentials or Cyber Essentials Plus.', evidenceRequired: true },
    'r4-2': { rowId: 'r4-2', riskLevel: 'Pass', feedback: 'Low risk data.', evidenceRequired: false },
    'r4-3': { rowId: 'r4-3', riskLevel: 'Pass', feedback: 'Modern, performant encryption standards.', evidenceRequired: false },
    'r4-4': { rowId: 'r4-4', riskLevel: 'Pass', feedback: 'Strong centralized identity management.', evidenceRequired: false },
    'r4-5': { rowId: 'r4-5', riskLevel: 'High', feedback: 'Availability is not Incident Response. Process for breaches is missing.', evidenceRequired: true, complianceFlag: 'Process Gap' },
};

// Report 5: Enterprise Legacy (Score ~78) - NOW RAPID ASSESSMENT VERSION
// Mapped to the Rapid Questions structure to ensure compatibility in "Marketing Analytics RFP"
const R5_RAPID_ROWS: QuestionnaireRow[] = [
    { id: 'r5-1', question: RAPID_QUESTIONS.q1, answer: 'Yes, ISO 27001 and SOC2.', category: 'Compliance' },
    { id: 'r5-2', question: RAPID_QUESTIONS.q2, answer: 'Customer Support Tickets.', category: 'Data Privacy' },
    { id: 'r5-3', question: RAPID_QUESTIONS.q5, answer: 'Yes, 3DES encryption.', category: 'Encryption' },
    { id: 'r5-4', question: RAPID_QUESTIONS.q7, answer: 'Yes, SMS 2FA.', category: 'Access Control' },
    { id: 'r5-5', question: RAPID_QUESTIONS.q11, answer: 'Yes, fully documented in Handbook.', category: 'IR' },
];
const R5_RAPID_RESULTS: Record<string, AnalysisResult> = {
    'r5-1': { rowId: 'r5-1', riskLevel: 'Pass', feedback: 'Highly certified.', evidenceRequired: false },
    'r5-2': { rowId: 'r5-2', riskLevel: 'Pass', feedback: 'Low risk.', evidenceRequired: false },
    'r5-3': { rowId: 'r5-3', riskLevel: 'Medium', feedback: '3DES is deprecated/weak. Migrate to AES.', evidenceRequired: false, complianceFlag: 'Legacy Tech' },
    'r5-4': { rowId: 'r5-4', riskLevel: 'Medium', feedback: 'SMS is vulnerable to SIM swapping. Prefer app/hardware tokens.', evidenceRequired: false },
    'r5-5': { rowId: 'r5-5', riskLevel: 'Pass', feedback: 'Strong governance.', evidenceRequired: true },
};

// Dummy Reports Array
export const DUMMY_REPORTS: AuditReport[] = [
  {
    id: 'h1',
    fileName: 'Acme_Security_Assessment.csv',
    uploadDate: new Date('2023-10-24'),
    masterQuestionnaireName: 'Enterprise Standard (v1)',
    rows: R1_ROWS, 
    results: R1_RESULTS,
    summary: { total: 15, highRisk: 1, mediumRisk: 5, lowRisk: 1, pass: 8, score: 65 }
  },
  {
    id: 'h2',
    fileName: 'AWS_Cloud_Audit.csv',
    uploadDate: new Date('2023-11-10'),
    masterQuestionnaireName: 'Enterprise Standard (v1)',
    rows: R2_ROWS,
    results: R2_RESULTS,
    summary: { total: 15, highRisk: 0, mediumRisk: 0, lowRisk: 0, pass: 15, score: 100 }
  },
  {
    id: 'h3',
    fileName: 'Legacy_Vendor_V2.csv',
    uploadDate: new Date('2023-09-15'),
    masterQuestionnaireName: 'Rapid Vendor Assessment',
    rows: R3_ROWS,
    results: R3_RESULTS,
    summary: { total: 5, highRisk: 5, mediumRisk: 0, lowRisk: 0, pass: 0, score: 0 }
  },
  {
    id: 'h4',
    fileName: 'HyperGrowth_SaaS_Inc.csv',
    uploadDate: new Date('2023-12-05'),
    masterQuestionnaireName: 'Rapid Vendor Assessment',
    rows: R4_ROWS,
    results: R4_RESULTS,
    summary: { total: 5, highRisk: 1, mediumRisk: 1, lowRisk: 0, pass: 3, score: 80 }
  },
  {
    id: 'h5',
    fileName: 'Global_Consulting_Group.csv',
    uploadDate: new Date('2023-12-08'),
    masterQuestionnaireName: 'Rapid Vendor Assessment', // Changed from Enterprise to Rapid for set consistency
    rows: R5_RAPID_ROWS, // Switched to rapid rows
    results: R5_RAPID_RESULTS, // Switched to rapid results
    summary: { total: 5, highRisk: 0, mediumRisk: 2, lowRisk: 0, pass: 3, score: 85 } // Re-scored for Rapid
  }
];

// Initial Dummy Review Sets
export const INITIAL_REVIEW_SETS: ReviewSet[] = [
    {
        id: 'set-1',
        name: 'Q3 CRM Migration Bid',
        description: 'Comparison of shortlisted vendors for the new Customer Relationship Management system.',
        status: 'Open',
        dateCreated: new Date('2023-11-01'),
        reports: [DUMMY_REPORTS[1], DUMMY_REPORTS[0]] // Compares AWS (Excellent) vs Acme (Average) - Both Enterprise
    },
    {
        id: 'set-2',
        name: 'Legacy System Audit 2023',
        description: 'Annual review of legacy on-premise suppliers.',
        status: 'Closed',
        dateCreated: new Date('2023-09-10'),
        reports: [DUMMY_REPORTS[2]] // Just the legacy vendor - Rapid
    },
    {
        id: 'set-3',
        name: 'Marketing Analytics RFP',
        description: 'Evaluating new tools for the marketing team. Comparing nimble startup vs established player.',
        status: 'Open',
        dateCreated: new Date('2023-12-01'),
        reports: [DUMMY_REPORTS[4], DUMMY_REPORTS[3]] // Global Consulting (Rapid) vs HyperGrowth SaaS (Rapid)
    }
];

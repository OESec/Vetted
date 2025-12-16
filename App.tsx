import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrustBar from './components/TrustBar';
import HowItWorks from './components/HowItWorks';
import Features from './components/Features';
import LivePreview from './components/LivePreview';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import Auth from './components/Auth';

// Dashboard Components
import DashboardLayout from './components/dashboard/DashboardLayout';
import UploadAnalyzer from './components/dashboard/UploadAnalyzer';
import ReportViewer from './components/dashboard/ReportViewer';
import ReviewSetViewer from './components/dashboard/ReviewSetViewer';
import ReportsList from './components/dashboard/ReportsList';
import SettingsView from './components/dashboard/SettingsView';
import CreateReviewSetModal from './components/dashboard/CreateReviewSetModal';

import { AuditReport, AnalysisResult, QuestionnaireRow, ReviewSet, MasterQuestionnaireRow } from './types';
import { TriangleAlert, CircleCheck, FileText, Calendar, FolderOpen, Users, ArrowRight, Plus, Archive, Trash2 } from 'lucide-react';
import Button from './components/Button';
import { supabase } from './supabaseClient';

// --- Fully Hardcoded Dummy Data ---

// Standardized Questions for all vendors (The Master List - Expanded)
const QUESTIONS = {
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

// Initial Master Data matching the questions above
const INITIAL_MASTER_DATA: MasterQuestionnaireRow[] = [
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

// Report 1: Average Vendor (Score ~65)
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

// Report 2: Excellent Vendor (Score 100)
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

// Report 3: High Risk Vendor (Score ~25)
const R3_ROWS: QuestionnaireRow[] = [
    { id: 'r3-1', question: QUESTIONS.q1, answer: 'What is SOC2?', category: 'Compliance' },
    { id: 'r3-2', question: QUESTIONS.q2, answer: 'Financial records and HR data.', category: 'Data Privacy' },
    { id: 'r3-3', question: QUESTIONS.q3, answer: 'Yes, full employee records.', category: 'Data Privacy' },
    { id: 'r3-4', question: QUESTIONS.q4, answer: 'Servers in our headquarters (Beijing).', category: 'Infrastructure' },
    { id: 'r3-5', question: QUESTIONS.q5, answer: 'No, data is on internal network only.', category: 'Encryption' },
    { id: 'r3-6', question: QUESTIONS.q6, answer: 'HTTP for internal tools.', category: 'Encryption' },
    { id: 'r3-7', question: QUESTIONS.q7, answer: 'No, we use complex passwords.', category: 'Access Control' },
    { id: 'r3-8', question: QUESTIONS.q8, answer: 'No.', category: 'Vulnerability' },
    { id: 'r3-9', question: QUESTIONS.q9, answer: 'No.', category: 'Vulnerability' },
    { id: 'r3-10', question: QUESTIONS.q10, answer: 'No.', category: 'HR Security' },
    { id: 'r3-11', question: QUESTIONS.q11, answer: 'We call IT support.', category: 'IR' },
    { id: 'r3-12', question: QUESTIONS.q12, answer: 'We keep everything.', category: 'Data Governance' },
    { id: 'r3-13', question: QUESTIONS.q13, answer: 'Ad-hoc updates.', category: 'SDLC' },
    { id: 'r3-14', question: QUESTIONS.q14, answer: 'Shared database tables.', category: 'Architecture' },
    { id: 'r3-15', question: QUESTIONS.q15, answer: 'No.', category: 'BC/DR' },
];
const R3_RESULTS: Record<string, AnalysisResult> = {
    'r3-1': { rowId: 'r3-1', riskLevel: 'High', feedback: 'Lack of awareness of basic standards.', evidenceRequired: false, complianceFlag: 'Education Required' },
    'r3-2': { rowId: 'r3-2', riskLevel: 'High', feedback: 'Sensitive data processed without adequate controls.', evidenceRequired: false },
    'r3-3': { rowId: 'r3-3', riskLevel: 'High', feedback: 'Special category data requires strict controls (Encryption, Access).', evidenceRequired: true },
    'r3-4': { rowId: 'r3-4', riskLevel: 'High', feedback: 'Hosting in China presents significant data sovereignty risks.', evidenceRequired: false, complianceFlag: 'Geopolitical Risk' },
    'r3-5': { rowId: 'r3-5', riskLevel: 'High', feedback: 'Data must be encrypted regardless of network location.', evidenceRequired: true, complianceFlag: 'Critical Gap' },
    'r3-6': { rowId: 'r3-6', riskLevel: 'High', feedback: 'Cleartext protocols are unacceptable.', evidenceRequired: false },
    'r3-7': { rowId: 'r3-7', riskLevel: 'High', feedback: 'Passwords are insufficient. MFA is mandatory.', evidenceRequired: false, complianceFlag: 'Weak Auth' },
    'r3-8': { rowId: 'r3-8', riskLevel: 'High', feedback: 'No pen test program.', evidenceRequired: false },
    'r3-9': { rowId: 'r3-9', riskLevel: 'High', feedback: 'No vulnerability management.', evidenceRequired: false },
    'r3-10': { rowId: 'r3-10', riskLevel: 'High', feedback: 'Insider threat risk.', evidenceRequired: false },
    'r3-11': { rowId: 'r3-11', riskLevel: 'High', feedback: 'No formal process defined.', evidenceRequired: true },
    'r3-12': { rowId: 'r3-12', riskLevel: 'High', feedback: 'Infinite retention violates GDPR/privacy laws.', evidenceRequired: false },
    'r3-13': { rowId: 'r3-13', riskLevel: 'Medium', feedback: 'Risk of instability and unauthorized changes.', evidenceRequired: true },
    'r3-14': { rowId: 'r3-14', riskLevel: 'Medium', feedback: 'Weak segregation.', evidenceRequired: false },
    'r3-15': { rowId: 'r3-15', riskLevel: 'High', feedback: 'No continuity plan.', evidenceRequired: true },
};

// Report 4: Modern Startup (Good Tech, Weak Process) (Score ~72)
const R4_ROWS: QuestionnaireRow[] = [
    { id: 'r4-1', question: QUESTIONS.q1, answer: 'We are too small for SOC2.', category: 'Compliance' },
    { id: 'r4-2', question: QUESTIONS.q2, answer: 'Application logs and user profiles.', category: 'Data Privacy' },
    { id: 'r4-3', question: QUESTIONS.q3, answer: 'No.', category: 'Data Privacy' },
    { id: 'r4-4', question: QUESTIONS.q4, answer: 'AWS US-West.', category: 'Infrastructure' },
    { id: 'r4-5', question: QUESTIONS.q5, answer: 'Yes, ChaCha20-Poly1305 everywhere.', category: 'Encryption' },
    { id: 'r4-6', question: QUESTIONS.q6, answer: 'Yes, TLS 1.3.', category: 'Encryption' },
    { id: 'r4-7', question: QUESTIONS.q7, answer: 'Yes, Okta for everything.', category: 'Access Control' },
    { id: 'r4-8', question: QUESTIONS.q8, answer: 'We use automated tools.', category: 'Vulnerability' },
    { id: 'r4-9', question: QUESTIONS.q9, answer: 'Automated CI/CD security scans.', category: 'Vulnerability' },
    { id: 'r4-10', question: QUESTIONS.q10, answer: 'Yes.', category: 'HR Security' },
    { id: 'r4-11', question: QUESTIONS.q11, answer: 'We rely on AWS availability zones.', category: 'IR' },
    { id: 'r4-12', question: QUESTIONS.q12, answer: 'No formal policy.', category: 'Data Governance' },
    { id: 'r4-13', question: QUESTIONS.q13, answer: 'GitOps - code is reviewed.', category: 'SDLC' },
    { id: 'r4-14', question: QUESTIONS.q14, answer: 'Separate databases per tenant.', category: 'Architecture' },
    { id: 'r4-15', question: QUESTIONS.q15, answer: 'AWS RDS Automated Backups.', category: 'BC/DR' },
];
const R4_RESULTS: Record<string, AnalysisResult> = {
    'r4-1': { rowId: 'r4-1', riskLevel: 'Medium', feedback: 'Size is not an excuse. Suggest ISO 27001 Essentials or Cyber Essentials Plus.', evidenceRequired: true },
    'r4-2': { rowId: 'r4-2', riskLevel: 'Pass', feedback: 'Low risk data.', evidenceRequired: false },
    'r4-3': { rowId: 'r4-3', riskLevel: 'Pass', feedback: 'Compliant.', evidenceRequired: false },
    'r4-4': { rowId: 'r4-4', riskLevel: 'Medium', feedback: 'US Residency requires transfer risk assessment.', evidenceRequired: true },
    'r4-5': { rowId: 'r4-5', riskLevel: 'Pass', feedback: 'Modern, performant encryption standards.', evidenceRequired: false },
    'r4-6': { rowId: 'r4-6', riskLevel: 'Pass', feedback: 'Compliant.', evidenceRequired: false },
    'r4-7': { rowId: 'r4-7', riskLevel: 'Pass', feedback: 'Strong centralized identity management.', evidenceRequired: false },
    'r4-8': { rowId: 'r4-8', riskLevel: 'Medium', feedback: 'Automated tools are not a penetration test. Human testing required.', evidenceRequired: true },
    'r4-9': { rowId: 'r4-9', riskLevel: 'Pass', feedback: 'Strong devsecops.', evidenceRequired: false },
    'r4-10': { rowId: 'r4-10', riskLevel: 'Pass', feedback: 'Compliant.', evidenceRequired: false },
    'r4-11': { rowId: 'r4-11', riskLevel: 'High', feedback: 'Availability is not Incident Response. Process for breaches is missing.', evidenceRequired: true, complianceFlag: 'Process Gap' },
    'r4-12': { rowId: 'r4-12', riskLevel: 'Medium', feedback: 'Need retention policy.', evidenceRequired: true },
    'r4-13': { rowId: 'r4-13', riskLevel: 'Pass', feedback: 'GitOps provides good audit trail.', evidenceRequired: false },
    'r4-14': { rowId: 'r4-14', riskLevel: 'Pass', feedback: 'Excellent segregation.', evidenceRequired: false },
    'r4-15': { rowId: 'r4-15', riskLevel: 'Medium', feedback: 'Backups exist but need documented RTO/RPO.', evidenceRequired: true },
};

// Report 5: Enterprise Legacy (Strong Process, Old Tech) (Score ~78)
const R5_ROWS: QuestionnaireRow[] = [
    { id: 'r5-1', question: QUESTIONS.q1, answer: 'Yes, ISO 27001 and SOC2.', category: 'Compliance' },
    { id: 'r5-2', question: QUESTIONS.q2, answer: 'Customer Support Tickets.', category: 'Data Privacy' },
    { id: 'r5-3', question: QUESTIONS.q3, answer: 'No.', category: 'Data Privacy' },
    { id: 'r5-4', question: QUESTIONS.q4, answer: 'On-Premise, London Data Center.', category: 'Infrastructure' },
    { id: 'r5-5', question: QUESTIONS.q5, answer: 'Yes, 3DES encryption.', category: 'Encryption' },
    { id: 'r5-6', question: QUESTIONS.q6, answer: 'Yes, TLS 1.2.', category: 'Encryption' },
    { id: 'r5-7', question: QUESTIONS.q7, answer: 'Yes, SMS 2FA.', category: 'Access Control' },
    { id: 'r5-8', question: QUESTIONS.q8, answer: 'Yes, annually.', category: 'Vulnerability' },
    { id: 'r5-9', question: QUESTIONS.q9, answer: 'Yes, monthly.', category: 'Vulnerability' },
    { id: 'r5-10', question: QUESTIONS.q10, answer: 'Yes.', category: 'HR Security' },
    { id: 'r5-11', question: QUESTIONS.q11, answer: 'Yes, fully documented in Handbook.', category: 'IR' },
    { id: 'r5-12', question: QUESTIONS.q12, answer: 'Yes, 7 year retention.', category: 'Data Governance' },
    { id: 'r5-13', question: QUESTIONS.q13, answer: 'CAB meetings weekly.', category: 'SDLC' },
    { id: 'r5-14', question: QUESTIONS.q14, answer: 'Soft segregation.', category: 'Architecture' },
    { id: 'r5-15', question: QUESTIONS.q15, answer: 'Yes, tape backups.', category: 'BC/DR' },
];
const R5_RESULTS: Record<string, AnalysisResult> = {
    'r5-1': { rowId: 'r5-1', riskLevel: 'Pass', feedback: 'Highly certified.', evidenceRequired: false },
    'r5-2': { rowId: 'r5-2', riskLevel: 'Pass', feedback: 'Low risk.', evidenceRequired: false },
    'r5-3': { rowId: 'r5-3', riskLevel: 'Pass', feedback: 'Compliant.', evidenceRequired: false },
    'r5-4': { rowId: 'r5-4', riskLevel: 'Pass', feedback: 'UK Residency matches preference.', evidenceRequired: false },
    'r5-5': { rowId: 'r5-5', riskLevel: 'Medium', feedback: '3DES is deprecated/weak. Migrate to AES.', evidenceRequired: false, complianceFlag: 'Legacy Tech' },
    'r5-6': { rowId: 'r5-6', riskLevel: 'Pass', feedback: 'Acceptable.', evidenceRequired: false },
    'r5-7': { rowId: 'r5-7', riskLevel: 'Medium', feedback: 'SMS is vulnerable to SIM swapping. Prefer app/hardware tokens.', evidenceRequired: false },
    'r5-8': { rowId: 'r5-8', riskLevel: 'Pass', feedback: 'Compliant.', evidenceRequired: false },
    'r5-9': { rowId: 'r5-9', riskLevel: 'Pass', feedback: 'Compliant.', evidenceRequired: false },
    'r5-10': { rowId: 'r5-10', riskLevel: 'Pass', feedback: 'Compliant.', evidenceRequired: false },
    'r5-11': { rowId: 'r5-11', riskLevel: 'Pass', feedback: 'Strong governance.', evidenceRequired: true },
    'r5-12': { rowId: 'r5-12', riskLevel: 'Pass', feedback: 'Documented.', evidenceRequired: false },
    'r5-13': { rowId: 'r5-13', riskLevel: 'Medium', feedback: 'Heavy process, ensures stability but slows fixes.', evidenceRequired: false },
    'r5-14': { rowId: 'r5-14', riskLevel: 'Medium', feedback: 'Software logic segregation is weaker than physical.', evidenceRequired: false },
    'r5-15': { rowId: 'r5-15', riskLevel: 'Medium', feedback: 'Tape is slow to recover. Recommend cloud/disk backup.', evidenceRequired: false },
};

// Dummy Reports Array
const DUMMY_REPORTS: AuditReport[] = [
  {
    id: 'h1',
    fileName: 'Acme_Security_Assessment.csv',
    uploadDate: new Date('2023-10-24'),
    rows: R1_ROWS, 
    results: R1_RESULTS,
    summary: { total: 15, highRisk: 1, mediumRisk: 5, lowRisk: 1, pass: 8, score: 65 }
  },
  {
    id: 'h2',
    fileName: 'AWS_Cloud_Audit.csv',
    uploadDate: new Date('2023-11-10'),
    rows: R2_ROWS,
    results: R2_RESULTS,
    summary: { total: 15, highRisk: 0, mediumRisk: 0, lowRisk: 0, pass: 15, score: 100 }
  },
  {
    id: 'h3',
    fileName: 'Legacy_Vendor_V2.csv',
    uploadDate: new Date('2023-09-15'),
    rows: R3_ROWS,
    results: R3_RESULTS,
    summary: { total: 15, highRisk: 11, mediumRisk: 2, lowRisk: 0, pass: 2, score: 25 }
  },
  {
    id: 'h4',
    fileName: 'HyperGrowth_SaaS_Inc.csv',
    uploadDate: new Date('2023-12-05'),
    rows: R4_ROWS,
    results: R4_RESULTS,
    summary: { total: 15, highRisk: 1, mediumRisk: 4, lowRisk: 0, pass: 10, score: 72 }
  },
  {
    id: 'h5',
    fileName: 'Global_Consulting_Group.csv',
    uploadDate: new Date('2023-12-08'),
    rows: R5_ROWS,
    results: R5_RESULTS,
    summary: { total: 15, highRisk: 0, mediumRisk: 5, lowRisk: 0, pass: 10, score: 78 }
  }
];

// Initial Dummy Review Sets
const INITIAL_REVIEW_SETS: ReviewSet[] = [
    {
        id: 'set-1',
        name: 'Q3 CRM Migration Bid',
        description: 'Comparison of shortlisted vendors for the new Customer Relationship Management system.',
        status: 'Open',
        dateCreated: new Date('2023-11-01'),
        reports: [DUMMY_REPORTS[1], DUMMY_REPORTS[0]] // Compares AWS (Excellent) vs Acme (Average)
    },
    {
        id: 'set-2',
        name: 'Legacy System Audit 2023',
        description: 'Annual review of legacy on-premise suppliers.',
        status: 'Closed',
        dateCreated: new Date('2023-09-10'),
        reports: [DUMMY_REPORTS[2]] // Just the legacy vendor
    },
    {
        id: 'set-3',
        name: 'Marketing Analytics RFP',
        description: 'Evaluating new tools for the marketing team. Comparing nimble startup vs established player.',
        status: 'Open',
        dateCreated: new Date('2023-12-01'),
        reports: [DUMMY_REPORTS[4], DUMMY_REPORTS[3]] // Global Consulting (78) vs HyperGrowth SaaS (72)
    }
];

function App() {
  const [view, setView] = useState<'landing' | 'dashboard' | 'auth'>('landing');
  const [dashboardTab, setDashboardTab] = useState<'overview' | 'reports' | 'upload' | 'settings'>('overview');
  
  // State for Data
  const [reviewSets, setReviewSets] = useState<ReviewSet[]>(INITIAL_REVIEW_SETS);
  const [reports, setReports] = useState<AuditReport[]>(DUMMY_REPORTS);
  const [masterQuestionnaire, setMasterQuestionnaire] = useState<MasterQuestionnaireRow[]>(INITIAL_MASTER_DATA);
  const [session, setSession] = useState<any>(null);
  
  // State for UI Interaction
  const [activeReviewSet, setActiveReviewSet] = useState<ReviewSet | null>(null);
  const [currentReport, setCurrentReport] = useState<AuditReport | null>(null);
  const [isCreateSetModalOpen, setIsCreateSetModalOpen] = useState(false);
  const [pendingSetUploadId, setPendingSetUploadId] = useState<string | null>(null);

  // Load from Supabase on mount
  useEffect(() => {
    // 1. Check if user is already logged in from a previous session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
          setView('dashboard');
          fetchUserData(session.user.id);
      }
    });

    // 2. Listen for auth changes (Login, Logout, Auto-refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
          setView('dashboard');
          fetchUserData(session.user.id);
      } else {
          // If the user logs out, they are handled by handleLogout, 
          // but if the session expires, we might want to auto-redirect.
          // For now, we leave them be or they will see the auth screen if they try to act.
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (userId: string) => {
      // Row Level Security protects this, so we just ask for the single row associated with the user
      const { data, error } = await supabase
          .from('organization_settings')
          .select('questionnaire_data')
          .single();
      
      if (data && data.questionnaire_data) {
          const qData = data.questionnaire_data;
          // Handle Legacy Array
          if (Array.isArray(qData)) {
              setMasterQuestionnaire(qData as MasterQuestionnaireRow[]);
          } 
          // Handle New Object Format (Multi-Set)
          else if (qData.sets && Array.isArray(qData.sets)) {
             // Find the active set to use as the Master Questionnaire for analysis
             const activeSet = qData.sets.find((s: any) => s.id === qData.activeSetId) || qData.sets[0];
             if (activeSet && activeSet.rows) {
                 setMasterQuestionnaire(activeSet.rows);
             }
          }
      }
  };

  // Transitions
  const handleLogin = () => {
    if (session) {
      setView('dashboard');
    } else {
      setView('auth');
    }
  };
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setView('landing');
    setCurrentReport(null);
    setActiveReviewSet(null);
    setDashboardTab('overview');
  };

  const handleAnalysisComplete = (report: AuditReport) => {
    // 1. Add to global reports
    setReports(prev => [report, ...prev]);

    // 2. Check if this was a targeted upload for a specific Review Set
    if (pendingSetUploadId) {
      // Add report to the specific set
      const updatedSets = reviewSets.map(set => {
        if (set.id === pendingSetUploadId) {
          return { ...set, reports: [report, ...set.reports] };
        }
        return set;
      });
      setReviewSets(updatedSets);
      
      // Auto-open the set view again (Seamless Flow)
      const targetSet = updatedSets.find(s => s.id === pendingSetUploadId);
      if (targetSet) {
        setActiveReviewSet(targetSet);
      }
      
      // Reset flow
      setPendingSetUploadId(null);
      // We don't set currentReport here because we want to see the Set View, not the individual report
      setCurrentReport(null);
    } else {
      // Standard flow: Just show the report result
      setCurrentReport(report);
    }
  };

  const handleBackToDashboard = () => {
      // If we are looking at a report inside a set, go back to the set
      if (activeReviewSet && currentReport) {
          setCurrentReport(null);
      } else {
          // Otherwise clear everything
          setCurrentReport(null);
          setActiveReviewSet(null);
          setPendingSetUploadId(null); // Clear any pending state just in case
      }
  };

  const handleOpenReviewSet = (set: ReviewSet) => {
      setActiveReviewSet(set);
      setCurrentReport(null);
  };

  const handleOpenReport = (report: AuditReport) => {
      setCurrentReport(report);
  };

  const handleTabChange = (tab: 'overview' | 'reports' | 'upload' | 'settings') => {
      setDashboardTab(tab);
      setCurrentReport(null);
      setActiveReviewSet(null);
      setPendingSetUploadId(null);
  };

  // --- CRUD Handlers ---

  const handleCreateReviewSet = (name: string, description: string) => {
    const newSet: ReviewSet = {
        id: `set-${Date.now()}`,
        name,
        description,
        status: 'Open',
        dateCreated: new Date(),
        reports: []
    };
    setReviewSets([newSet, ...reviewSets]);
    setIsCreateSetModalOpen(false);
    
    // Auto-open the new set
    setActiveReviewSet(newSet);
    setCurrentReport(null);
  };

  const handleRequestUploadForSet = () => {
    if (activeReviewSet) {
      setPendingSetUploadId(activeReviewSet.id);
      setActiveReviewSet(null); // Temporarily close set view
      setDashboardTab('upload'); // Switch to upload view
    }
  };

  const handleArchiveSet = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to archive this review set?")) {
        setReviewSets(prev => prev.map(s => s.id === id ? { ...s, status: 'Archived' } : s));
    }
  };

  // Rendering Dashboard Content
  const renderDashboardContent = () => {
    // 1. Viewing a Single Report (Highest Priority view)
    if (currentReport) {
        return <ReportViewer report={currentReport} onBack={handleBackToDashboard} />;
    }

    // 2. Viewing a Review Set (Comparison View)
    if (activeReviewSet) {
        return (
            <ReviewSetViewer 
                reviewSet={activeReviewSet} 
                onBack={handleBackToDashboard} 
                onViewReport={handleOpenReport}
                onAddReport={handleRequestUploadForSet}
            />
        );
    }

    // 3. Tab: Overview (List of Review Sets)
    if (dashboardTab === 'overview') {
        const activeSets = reviewSets.filter(s => s.status !== 'Archived');
        
        return (
            <div className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <p className="text-gray-500 text-sm font-medium">Active Reviews</p>
                        <p className="text-3xl font-bold text-neutralDark mt-1">{reviewSets.filter(s => s.status === 'Open').length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <p className="text-gray-500 text-sm font-medium">Suppliers Assessed</p>
                        <p className="text-3xl font-bold text-primary mt-1">{reports.length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <p className="text-gray-500 text-sm font-medium">Avg Risk Score</p>
                        <p className="text-3xl font-bold text-success mt-1">
                            {reports.length > 0 ? Math.round(reports.reduce((acc, curr) => acc + curr.summary.score, 0) / reports.length) : 0}/100
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-lg text-neutralDark">Recent Review Sets</h3>
                        <Button 
                            variant="primary" 
                            size="sm" 
                            onClick={() => setIsCreateSetModalOpen(true)}
                        >
                            <Plus size={16} className="mr-2" /> Create New Set
                        </Button>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {activeSets.length === 0 ? (
                            <div className="p-12 text-center text-gray-500">
                                <FolderOpen size={48} className="mx-auto text-gray-300 mb-4" />
                                <p>No active review sets. Create one to get started.</p>
                            </div>
                        ) : (
                            activeSets.map((set) => (
                                <div 
                                    key={set.id} 
                                    onClick={() => handleOpenReviewSet(set)}
                                    className="p-6 hover:bg-gray-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer group relative"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <FolderOpen className="text-primary group-hover:scale-110 transition-transform" size={20} />
                                            <h4 className="text-lg font-bold text-neutralDark group-hover:text-primary transition-colors">{set.name}</h4>
                                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${set.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                                {set.status}
                                            </span>
                                        </div>
                                        <p className="text-gray-500 text-sm mb-2">{set.description}</p>
                                        <div className="flex items-center text-xs text-gray-400 gap-4">
                                            <span className="flex items-center"><Calendar size={12} className="mr-1"/> Created {set.dateCreated.toLocaleDateString()}</span>
                                            <span className="flex items-center"><Users size={12} className="mr-1"/> {set.reports.length} Suppliers</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="w-full md:w-auto"
                                        >
                                            View Comparison <ArrowRight size={16} className="ml-2" />
                                        </Button>
                                        <button 
                                            onClick={(e) => handleArchiveSet(set.id, e)}
                                            className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Archive Set"
                                        >
                                            <Archive size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // 4. Tab: Upload (New Analysis)
    if (dashboardTab === 'upload') {
        return <UploadAnalyzer onAnalysisComplete={handleAnalysisComplete} />;
    }

    // 5. Tab: Reports (Flat History List)
    if (dashboardTab === 'reports') {
        return (
            <ReportsList 
                reports={reports} 
                reviewSets={reviewSets} 
                onViewReport={handleOpenReport} 
            />
        );
    }
    
    // 6. Tab: Settings
    if (dashboardTab === 'settings') {
        return <SettingsView masterQuestionnaire={masterQuestionnaire} onUpdateMaster={setMasterQuestionnaire} />;
    }
    
    return null;
  };

  // Main Render
  if (view === 'auth') {
      return <Auth onBack={() => setView('landing')} />;
  }

  if (view === 'dashboard') {
    return (
      <DashboardLayout 
        onLogout={handleLogout} 
        activeTab={dashboardTab} 
        onTabChange={handleTabChange}
        userEmail={session?.user?.email}
        onLogoClick={() => setView('landing')}
      >
        {renderDashboardContent()}
        <CreateReviewSetModal 
            isOpen={isCreateSetModalOpen} 
            onClose={() => setIsCreateSetModalOpen(false)} 
            onCreate={handleCreateReviewSet} 
        />
      </DashboardLayout>
    );
  }

  return (
    <div className="font-sans text-neutralDark bg-neutralLight min-h-screen">
      <Navbar onNavigateToApp={handleLogin} />
      <main>
        <Hero onNavigateToApp={handleLogin} />
        <TrustBar />
        <HowItWorks />
        <Features />
        <LivePreview />
        <Testimonials />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}

export default App;
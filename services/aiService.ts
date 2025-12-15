import { GoogleGenAI, Type } from "@google/genai";
import { QuestionnaireRow, AnalysisResult } from '../types';

// Few-shot training examples to simulate "Historical Data"
const TRAINING_EXAMPLES = `
EXAMPLE 1:
Question: "Do you encrypt data at rest?"
Answer: "We use a proprietary hashing algorithm."
Analysis: {
  "riskLevel": "High",
  "feedback": "Proprietary encryption is a security anti-pattern. Industry standard AES-256 is required.",
  "evidenceRequired": true,
  "complianceFlag": "Non-compliant with encryption standards"
}

EXAMPLE 2:
Question: "Do you conduct background checks on employees?"
Answer: "Yes, for all employees."
Analysis: {
  "riskLevel": "Pass",
  "feedback": "Compliant response.",
  "evidenceRequired": false,
  "complianceFlag": null
}

EXAMPLE 3:
Question: "How do you handle incident response?"
Answer: "We have a process in place."
Analysis: {
  "riskLevel": "Medium",
  "feedback": "Vague response. Needs details on SLA, communication channels, and retrospective process.",
  "evidenceRequired": true,
  "complianceFlag": "Missing Incident Response Plan"
}
`;

const SYSTEM_INSTRUCTION = `
You are an expert Information Security Auditor for enterprise vendor risk management.
You have been trained on historical security questionnaires and compliance outcomes (SOC2, ISO 27001).

Your task is to review new supplier questionnaire answers and provide structured feedback.

${TRAINING_EXAMPLES}

Rules for Analysis:
1. **High Risk**: Missing critical controls (Encryption, MFA, Background Checks), proprietary crypto, or admitted non-compliance.
2. **Medium Risk**: Vague answers ("We follow best practices"), missing specific details (e.g., frequency of pen tests), or partial compliance.
3. **Low Risk**: Minor process gaps that do not directly threaten data integrity.
4. **Pass**: Answer is specific, verifiable, and meets standard security controls.

Output must be strict JSON matching the schema.
`;

export const analyzeQuestionnaire = async (rows: QuestionnaireRow[]): Promise<Record<string, AnalysisResult>> => {
  // Initialize AI client here to avoid top-level environment access issues
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // We limit the batch size to ensure the model pays attention to every row.
  // For a real app, this would loop or queue. Here we take the first 50.
  const batch = rows.slice(0, 50); 

  const promptData = batch.map(r => ({
    id: r.id,
    question: r.question,
    answer: r.answer
  }));

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      results: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            riskLevel: { type: Type.STRING, enum: ['High', 'Medium', 'Low', 'Pass'] },
            feedback: { type: Type.STRING },
            evidenceRequired: { type: Type.BOOLEAN },
            complianceFlag: { type: Type.STRING, nullable: true }
          },
          required: ['id', 'riskLevel', 'feedback', 'evidenceRequired']
        }
      }
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: JSON.stringify(promptData),
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const json = JSON.parse(text);
    
    // Map back to a record keyed by ID
    const resultsMap: Record<string, AnalysisResult> = {};
    if (json.results && Array.isArray(json.results)) {
        json.results.forEach((res: any) => {
            // Normalize the output to ensure it matches our types
            resultsMap[res.id] = {
                rowId: res.id,
                riskLevel: res.riskLevel,
                feedback: res.feedback,
                evidenceRequired: res.evidenceRequired,
                complianceFlag: res.complianceFlag || undefined
            };
        });
    }
    
    return resultsMap;

  } catch (error) {
    console.error("AI Analysis Failed:", error);
    // Return empty or fallback results in case of failure
    const fallback: Record<string, AnalysisResult> = {};
    rows.forEach(r => {
        fallback[r.id] = {
            rowId: r.id,
            riskLevel: 'Medium',
            feedback: "AI Analysis failed to process this row. Please review manually.",
            evidenceRequired: true,
            complianceFlag: "Analysis Error"
        };
    });
    return fallback;
  }
};
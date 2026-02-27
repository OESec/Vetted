import { GoogleGenAI, Type } from "@google/genai";
import { QuestionnaireRow, AnalysisResult, AuditReport, ReviewSet } from '../types';

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

// Initialize AI client (Assuming API_KEY is available in environment or handled via proxy in production)
// Note: For this frontend-only demo, we rely on the process.envshim or hardcoded key if needed, 
// but sticking to the request of using process.env.API_KEY as per instructions.
const getClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeQuestionnaire = async (rows: QuestionnaireRow[]): Promise<Record<string, AnalysisResult>> => {
  const ai = getClient();

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

export const sendGlobalChatMessage = async (
  query: string,
  history: { role: string; parts: { text: string }[] }[],
  contextData: { reports: AuditReport[]; reviewSets: ReviewSet[] }
): Promise<string> => {
    const ai = getClient();

    // Simplify Context Data to reduce token usage while keeping essential info
    const simplifiedContext = {
        availableReports: contextData.reports.map(r => ({
            id: r.id,
            vendor: r.fileName,
            score: r.summary.score,
            criticalRisks: r.summary.highRisk,
            date: r.uploadDate.toLocaleDateString(),
            // Include results sample for context
            topRisks: Object.values(r.results).filter(res => res.riskLevel === 'High' || res.riskLevel === 'Medium').slice(0, 5)
        })),
        reviewSets: contextData.reviewSets.map(s => ({
            name: s.name,
            status: s.status,
            vendorsInvolved: s.reports.map(r => r.fileName)
        }))
    };

    const chatSystemInstruction = `
    You are Vetted AI, a specialized security analyst assistant embedded in the Vetted platform.
    
    You have read-access to the user's dashboard data, including:
    1. Uploaded Audit Reports (Security Questionnaires)
    2. Review Sets (Comparisons of vendors)
    
    Current Dashboard Context:
    ${JSON.stringify(simplifiedContext, null, 2)}
    
    Your capabilities:
    - Compare vendors based on their security scores and specific risks.
    - Summarize findings from specific reports.
    - Identify high-risk vendors that need attention.
    - Explain security concepts (SOC2, ISO27001, etc.).
    
    Guidelines:
    - Be concise and professional.
    - Cite the specific vendor name when discussing risks.
    - If you don't see a report in the context, say "I don't see a report for that vendor in your dashboard."
    - Do not invent data. Use the provided JSON context context.
    `;

    try {
        const chatSession = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: chatSystemInstruction,
            },
            history: history
        });

        const result = await chatSession.sendMessage({ message: query });
        return result.text || "I couldn't generate a response. Please try again.";
    } catch (error) {
        console.error("Chat Error:", error);
        return "I encountered an error communicating with the AI service.";
    }
};
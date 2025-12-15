import { QuestionnaireRow } from '../types';

export const parseCSV = (text: string): Promise<QuestionnaireRow[]> => {
  return new Promise((resolve, reject) => {
    try {
      // Normalize line endings
      const normalizedText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
      
      // Robust CSV parser that handles quoted fields with commas/newlines
      const parseLine = (line: string): string[] => {
        const result: string[] = [];
        let start = 0;
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
          if (line[i] === '"') {
            inQuotes = !inQuotes;
          } else if (line[i] === ',' && !inQuotes) {
            let field = line.substring(start, i).trim();
            // Remove surrounding quotes and handle escaped quotes
            if (field.startsWith('"') && field.endsWith('"')) {
              field = field.substring(1, field.length - 1).replace(/""/g, '"');
            }
            result.push(field);
            start = i + 1;
          }
        }
        
        // Push last field
        let lastField = line.substring(start).trim();
        if (lastField.startsWith('"') && lastField.endsWith('"')) {
          lastField = lastField.substring(1, lastField.length - 1).replace(/""/g, '"');
        }
        result.push(lastField);
        
        return result;
      };

      const lines = normalizedText.split('\n').filter(line => line.trim() !== '');
      
      if (lines.length < 2) {
         reject(new Error("File appears empty or missing headers."));
         return;
      }

      const headers = parseLine(lines[0]).map(h => h.toLowerCase());
      
      const questionIndex = headers.findIndex(h => h.includes('question'));
      const answerIndex = headers.findIndex(h => h.includes('answer'));

      if (questionIndex === -1 || answerIndex === -1) {
        reject(new Error("Invalid Schema: CSV must contain 'Question' and 'Answer' columns."));
        return;
      }

      const data: QuestionnaireRow[] = [];

      for (let i = 1; i < lines.length; i++) {
        const rowValues = parseLine(lines[i]);

        // Skip malformed rows that don't match header length roughly
        if (rowValues.length < Math.min(questionIndex, answerIndex)) continue;

        data.push({
          id: `row-${i}`,
          question: rowValues[questionIndex] || "Unknown Question",
          answer: rowValues[answerIndex] || "No Answer",
          category: headers.includes('category') ? rowValues[headers.indexOf('category')] : 'General',
          supplier: headers.includes('supplier') ? rowValues[headers.indexOf('supplier')] : 'Unknown',
        });
      }

      resolve(data);
    } catch (e: any) {
      reject(new Error("Failed to parse CSV: " + e.message));
    }
  });
};
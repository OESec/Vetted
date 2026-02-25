import { QuestionnaireRow } from '../types';

interface ColumnMapping {
  question: string;
  answer: string;
  category?: string;
  supplier?: string;
}

// This function is for reading headers only, without full parsing
export const getCSVHeaders = (text: string): Promise<string[]> => {
    return new Promise((resolve, reject) => {
        try {
            const normalizedText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
            const firstLine = normalizedText.split('\n')[0];
            if (!firstLine) {
                reject(new Error("Cannot read headers from an empty file."));
                return;
            }
            // Using the same robust line parser for headers
            const parseLine = (line: string): string[] => {
                const result: string[] = [];
                let start = 0;
                let inQuotes = false;
                for (let i = 0; i < line.length; i++) {
                    if (line[i] === '"') {
                        inQuotes = !inQuotes;
                    } else if (line[i] === ',' && !inQuotes) {
                        let field = line.substring(start, i).trim();
                        if (field.startsWith('"') && field.endsWith('"')) {
                            field = field.substring(1, field.length - 1).replace(/""/g, '"');
                        }
                        result.push(field);
                        start = i + 1;
                    }
                }
                let lastField = line.substring(start).trim();
                if (lastField.startsWith('"') && lastField.endsWith('"')) {
                    lastField = lastField.substring(1, lastField.length - 1).replace(/""/g, '"');
                }
                result.push(lastField);
                return result;
            };
            resolve(parseLine(firstLine));
        } catch (e: any) {
            reject(new Error("Failed to parse CSV headers: " + e.message));
        }
    });
};


export const parseMappedCSV = (text: string, mapping: ColumnMapping): Promise<QuestionnaireRow[]> => {
  return new Promise((resolve, reject) => {
    try {
      const normalizedText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
      
      const parseLine = (line: string): string[] => {
        const result: string[] = [];
        let start = 0;
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
          if (line[i] === '"') {
            inQuotes = !inQuotes;
          } else if (line[i] === ',' && !inQuotes) {
            let field = line.substring(start, i).trim();
            if (field.startsWith('"') && field.endsWith('"')) {
              field = field.substring(1, field.length - 1).replace(/""/g, '"');
            }
            result.push(field);
            start = i + 1;
          }
        }
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

      const headers = parseLine(lines[0]);
      
      const questionIndex = headers.indexOf(mapping.question);
      const answerIndex = headers.indexOf(mapping.answer);
      const categoryIndex = mapping.category ? headers.indexOf(mapping.category) : -1;
      const supplierIndex = mapping.supplier ? headers.indexOf(mapping.supplier) : -1;

      if (questionIndex === -1 || answerIndex === -1) {
        reject(new Error(`Mapping failed: Could not find mapped columns "${mapping.question}" or "${mapping.answer}" in the file headers.`));
        return;
      }

      const data: QuestionnaireRow[] = [];

      for (let i = 1; i < lines.length; i++) {
        const rowValues = parseLine(lines[i]);

        if (rowValues.length <= Math.max(questionIndex, answerIndex)) continue;

        data.push({
          id: `row-${i}`,
          question: rowValues[questionIndex] || "Unknown Question",
          answer: rowValues[answerIndex] || "No Answer",
          category: categoryIndex !== -1 ? rowValues[categoryIndex] : 'General',
          supplier: supplierIndex !== -1 ? rowValues[supplierIndex] : 'Unknown',
        });
      }

      resolve(data);
    } catch (e: any) {
      reject(new Error("Failed to parse CSV: " + e.message));
    }
  });
};

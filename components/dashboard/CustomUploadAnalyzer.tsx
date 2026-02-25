import React, { useState } from 'react';
import { CloudUpload, FileSpreadsheet, Loader2, TriangleAlert, FileText, FlaskConical, Download } from 'lucide-react';
import Button from '../Button';
import { getCSVHeaders, parseMappedCSV } from '../../utils/mappedCsvParser';
import { analyzeQuestionnaire } from '../../services/aiService';
import { AuditReport, QuestionnaireRow } from '../../types';

interface UploadAnalyzerProps {
  onAnalysisComplete: (report: AuditReport) => void;
}

const SAMPLE_CSV_DATA = `Question,Answer,Category,Supplier
"Do you encrypt data at rest?","We use base64 encoding for obfuscation.",Encryption,Vendor A
"Is MFA enforced for all employees?","Yes, we use Google Authenticator for all staff access.",Access Control,Vendor A
"Do you perform annual penetration tests?","We do internal scans occasionally.",Vulnerability Mgmt,Vendor A
"Do you have a documented Incident Response Plan?","Yes, updated last quarter.",Incident Response,Vendor A
"Where is customer data hosted?","On-premise servers in our basement.",Infrastructure,Vendor A
"Do you conduct background checks?","No, we trust our employees.",HR Security,Vendor A`;

const TEMPLATE_CSV_DATA = `Question,Answer,Category,Supplier
"Do you encrypt data at rest?","[Enter Supplier Answer Here]","Encryption","[Supplier Name]"
"Is MFA enforced?","[Enter Supplier Answer Here]","Access Control","[Supplier Name]"
`;

// Simple UUID fallback
const generateId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

const CustomUploadAnalyzer: React.FC<UploadAnalyzerProps> = ({ onAnalysisComplete }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<{ question: string; answer: string; category?: string; supplier?: string }>({ question: '', answer: '' });

  const resetState = () => {
      setFile(null);
      setError(null);
      setHeaders([]);
      setMapping({ question: '', answer: '' });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = async (f: File) => {
    resetState();
    if (f.type !== 'text/csv' && !f.name.endsWith('.csv')) {
      setError("Please upload a CSV file.");
      return;
    }
    
    try {
      const text = await f.text();
      const csvHeaders = await getCSVHeaders(text);
      setHeaders(csvHeaders);
      setFile(f);

      // Auto-map if possible
      const lowerCaseHeaders = csvHeaders.map(h => h.toLowerCase());
      const questionHeader = csvHeaders[lowerCaseHeaders.findIndex(h => h.includes('question'))];
      const answerHeader = csvHeaders[lowerCaseHeaders.findIndex(h => h.includes('answer'))];
      if (questionHeader && answerHeader) {
        setMapping({ question: questionHeader, answer: answerHeader });
      }

    } catch (e: any) {
        setError(e.message || "Could not read file headers.");
    }
  };

  const handleSampleData = () => {
     const blob = new Blob([SAMPLE_CSV_DATA], { type: 'text/csv' });
     const sampleFile = new File([blob], "sample_security_questionnaire.csv", { type: "text/csv" });
     setFile(sampleFile);
  };

  const handleDownloadTemplate = () => {
    const blob = new Blob([TEMPLATE_CSV_DATA], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "security_questionnaire_template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const processFile = async () => {
    if (!file || !mapping.question || !mapping.answer) {
        setError("Please select columns for both 'Question' and 'Answer'.");
        return;
    }

    setIsLoading(true);
    try {
      // 1. Parse with mapping
      setLoadingStep('Parsing custom CSV structure...');
      const text = await file.text();
      const rows = await parseMappedCSV(text, mapping);

      if (rows.length === 0) {
        throw new Error("No data found in file.");
      }

      // 2. Analyze
      setLoadingStep(`Analysing ${rows.length} responses against compliance models...`);
      const results = await analyzeQuestionnaire(rows);

      // 3. Compile Report (same as original)
      setLoadingStep('Generating Risk Report...');
      let high = 0, medium = 0, low = 0, pass = 0;
      Object.values(results).forEach(r => {
        if (r.riskLevel === 'High') high++;
        else if (r.riskLevel === 'Medium') medium++;
        else if (r.riskLevel === 'Low') low++;
        else pass++;
      });
      const total = rows.length;
      const score = Math.max(0, 100 - (high * 15) - (medium * 5) - (low * 1));

      const report: AuditReport = {
        id: generateId(),
        fileName: file.name,
        uploadDate: new Date(),
        masterQuestionnaireName: 'Custom Mapped Assessment',
        rows,
        results,
        summary: { total, highRisk: high, mediumRisk: medium, lowRisk: low, pass, score }
      };

      onAnalysisComplete(report);

    } catch (e: any) {
      setError(e.message || "An error occurred processing the file.");
      setIsLoading(false);
    }
  };

  const handleMappingChange = (type: 'question' | 'answer', value: string) => {
    setMapping(prev => ({ ...prev, [type]: value }));
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center mb-8">
           <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
            <FileText size={24} />
          </div>
          <h2 className="text-2xl font-bold text-neutralDark">Upload Custom Audit</h2>
          <p className="text-gray-500 mt-2">Map your file's columns to the required fields to begin analysis.</p>
        </div>

        {!isLoading ? (
          <div className="space-y-6">
            {!file ? (
              <div 
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-10 text-center transition-all ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'}`}
              >
                  <CloudUpload size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-lg font-medium text-neutralDark">Drag & drop your CSV here</p>
                  <p className="text-sm text-gray-400 mb-6">We'll help you map the columns next.</p>
                  <label className="cursor-pointer">
                    <span className="bg-white border border-gray-300 text-neutralDark px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors shadow-sm">
                      Browse Files
                    </span>
                    <input type="file" className="hidden" accept=".csv" onChange={handleFileInput} />
                  </label>
              </div>
            ) : (
              <div className="space-y-6">
                {/* File Info */}
                <div className="flex items-center bg-gray-50 p-4 rounded-lg border">
                    <FileSpreadsheet size={32} className="text-success mr-4" />
                    <div>
                        <p className="font-bold text-neutralDark">{file.name}</p>
                        <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB - {headers.length} columns detected</p>
                    </div>
                    <button onClick={resetState} className="ml-auto text-sm text-gray-500 hover:text-red-500">Change File</button>
                </div>

                {/* Mapping UI */}
                <div className="border rounded-lg p-6 space-y-4 bg-white">
                    <h3 className="font-bold text-lg text-neutralDark">Map Columns</h3>
                    <p className="text-sm text-gray-500">Match the required fields to the columns from your uploaded file. </p>
                    
                    {/* Question Mapping */}
                    <div className="grid grid-cols-3 items-center gap-4">
                        <label className="font-medium text-sm text-gray-600 text-right">Question Column <span className="text-red-500">*</span></label>
                        <select 
                            value={mapping.question}
                            onChange={(e) => handleMappingChange('question', e.target.value)}
                            className="col-span-2 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                        >
                            <option value="" disabled>Select a column...</option>
                            {headers.map(h => <option key={h} value={h}>{h}</option>)}
                        </select>
                    </div>

                    {/* Answer Mapping */}
                    <div className="grid grid-cols-3 items-center gap-4">
                        <label className="font-medium text-sm text-gray-600 text-right">Answer Column <span className="text-red-500">*</span></label>
                        <select 
                            value={mapping.answer}
                            onChange={(e) => handleMappingChange('answer', e.target.value)}
                            className="col-span-2 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                        >
                            <option value="" disabled>Select a column...</option>
                            {headers.map(h => <option key={h} value={h}>{h}</option>)}
                        </select>
                    </div>
                </div>
                
                <div className="flex justify-end">
                    <Button onClick={processFile} disabled={!mapping.question || !mapping.answer}>Run Analysis</Button>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-lg flex items-center">
                <TriangleAlert size={18} className="mr-2" />
                {error}
              </div>
            )}
          </div>
        ) : (
          <div className="py-20 text-center">
            <Loader2 size={48} className="text-primary animate-spin mx-auto mb-6" />
            <h3 className="text-xl font-bold text-neutralDark mb-2">{loadingStep}</h3>
            <p className="text-gray-400">This may take a few moments...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomUploadAnalyzer;

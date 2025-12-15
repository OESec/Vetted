import React, { useState } from 'react';
import { CloudUpload, FileSpreadsheet, Loader2, TriangleAlert, FileText, FlaskConical, Download } from 'lucide-react';
import Button from '../Button';
import { parseCSV } from '../../utils/csvParser';
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

const UploadAnalyzer: React.FC<UploadAnalyzerProps> = ({ onAnalysisComplete }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>('');

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

  const validateAndSetFile = (f: File) => {
    setError(null);
    if (f.type !== 'text/csv' && !f.name.endsWith('.csv')) {
      setError("Please upload a CSV file.");
      return;
    }
    setFile(f);
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
    if (!file) return;

    setIsLoading(true);
    try {
      // 1. Parse
      setLoadingStep('Parsing CSV structure...');
      const text = await file.text();
      const rows = await parseCSV(text);

      if (rows.length === 0) {
        throw new Error("No data found in file.");
      }

      // 2. Analyze
      setLoadingStep(`Analyzing ${rows.length} responses against compliance models...`);
      const results = await analyzeQuestionnaire(rows);

      // 3. Compile Report
      setLoadingStep('Generating Risk Report...');
      
      let high = 0, medium = 0, low = 0, pass = 0;
      Object.values(results).forEach(r => {
        if (r.riskLevel === 'High') high++;
        else if (r.riskLevel === 'Medium') medium++;
        else if (r.riskLevel === 'Low') low++;
        else pass++;
      });
      
      const total = rows.length;
      // Simple score calculation: Start at 100, deduct for risks
      const score = Math.max(0, 100 - (high * 15) - (medium * 5) - (low * 1));

      const report: AuditReport = {
        id: generateId(),
        fileName: file.name,
        uploadDate: new Date(),
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

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
            <FileText size={24} />
          </div>
          <h2 className="text-2xl font-bold text-neutralDark">New Security Audit</h2>
          <p className="text-gray-500 mt-2">Upload a completed vendor questionnaire (CSV) to begin automated review.</p>
        </div>

        {/* Upload Area */}
        {!isLoading ? (
          <div className="space-y-6">
            <div 
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-10 text-center transition-all ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'}`}
            >
              {file ? (
                <div className="flex flex-col items-center">
                  <FileSpreadsheet size={48} className="text-success mb-4" />
                  <p className="font-bold text-lg text-neutralDark">{file.name}</p>
                  <p className="text-sm text-gray-500 mb-6">{(file.size / 1024).toFixed(1)} KB</p>
                  <div className="flex space-x-3">
                     <button onClick={() => setFile(null)} className="text-sm text-gray-500 hover:text-red-500">Remove</button>
                     <Button onClick={processFile} icon>Run Analysis</Button>
                  </div>
                </div>
              ) : (
                <>
                  <CloudUpload size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-lg font-medium text-neutralDark">Drag & drop your CSV here</p>
                  <p className="text-sm text-gray-400 mb-6">Must contain "Question" and "Answer" columns</p>
                  
                  <div className="flex flex-col items-center space-y-3">
                     <label className="cursor-pointer">
                        <span className="bg-white border border-gray-300 text-neutralDark px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors shadow-sm">
                        Browse Files
                        </span>
                        <input type="file" className="hidden" accept=".csv" onChange={handleFileInput} />
                     </label>
                     
                     <div className="relative flex items-center w-full max-w-xs py-2">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="flex-shrink-0 mx-4 text-gray-300 text-xs">OR</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                     </div>

                     <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={handleDownloadTemplate}
                        className="text-xs text-gray-600"
                      >
                        <Download size={14} className="mr-2" /> Download CSV Template
                      </Button>
                  </div>
                </>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-lg flex items-center">
                <TriangleAlert size={18} className="mr-2" />
                {error}
              </div>
            )}
            
             {!file && (
                <div className="text-center pt-2">
                   <button onClick={handleSampleData} className="inline-flex items-center text-sm text-primary hover:underline">
                      <FlaskConical size={14} className="mr-1"/> Load Sample Questionnaire for Testing
                   </button>
                </div>
             )}

            <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
              <h4 className="font-bold text-sm text-blue-900 mb-1">Demo Instructions:</h4>
              <p className="text-sm text-blue-800">
                Ensure your CSV has headers named exactly <strong>Question</strong> and <strong>Answer</strong>.
                <br/>
                Example: <code>Question,Answer</code>
              </p>
            </div>
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

export default UploadAnalyzer;
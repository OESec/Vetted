import React, { useState } from 'react';
import { UploadCloud, FileSpreadsheet, Download, CheckCircle, AlertTriangle, Trash2, Save, FlaskConical } from 'lucide-react';
import Button from '../Button';
import { parseCSV } from '../../utils/csvParser';
import { MasterQuestionnaireRow } from '../../types';

interface SettingsViewProps {
  masterQuestionnaire: MasterQuestionnaireRow[];
  onUpdateMaster: (rows: MasterQuestionnaireRow[]) => void;
}

const MASTER_TEMPLATE_CSV = `Question,Pass Answer,Consider Answer,Fail Answer
"Do you encrypt data at rest?","Yes, we use AES-256 with managed keys.","Yes, but keys are not rotated regularly.","No, data is stored in plain text."
"Is MFA enforced?","Yes, hardware keys or app-based MFA for all access.","Yes, but SMS only or admins only.","No, password only."
"Do you perform pentests?","Yes, annually by third party.","Yes, internal scans only.","No."
"Do you conduct background checks?","Yes, criminal and credit checks for all employees.","Yes, but only for specific roles.","No background checks performed."
"Do you have a documented Incident Response Plan?","Yes, tested annually.","Yes, but not tested.","No formal plan."`;

const SettingsView: React.FC<SettingsViewProps> = ({ masterQuestionnaire, onUpdateMaster }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setIsDragging(true);
    else if (e.type === 'dragleave') setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    setError(null);
    setSuccess(null);
    if (!file.name.endsWith('.csv')) {
      setError("Please upload a CSV file.");
      return;
    }

    try {
      const text = await file.text();
      const rawRows = await parseCSV(text);
      
      // Map generic rows to MasterQuestionnaireRow
      // Expected headers roughly: Question, Pass Answer, Consider Answer, Fail Answer
      // We'll try to find them loosely
      const mappedRows: MasterQuestionnaireRow[] = rawRows.map(r => {
        // Find keys in the row that match our expectations loosely (case-insensitive)
        const keys = Object.keys(r);
        const findKey = (term: string) => keys.find(k => k.toLowerCase().includes(term.toLowerCase()));

        const qKey = findKey('question');
        const passKey = findKey('pass');
        const considerKey = findKey('consider');
        const failKey = findKey('fail');

        if (!qKey || !passKey || !failKey) {
            // If strictly required columns are missing for a row, it might be an issue, 
            // but we'll fallback to empty strings or handle it in validation below
        }

        return {
          question: r[qKey || ''] || "Untitled Question",
          passAnswer: r[passKey || ''] || "",
          considerAnswer: r[considerKey || ''] || r[findKey('partial') || ''] || "",
          failAnswer: r[failKey || ''] || ""
        };
      });

      // Basic Validation
      const validRows = mappedRows.filter(r => r.question && (r.passAnswer || r.failAnswer));
      
      if (validRows.length === 0) {
        throw new Error("Could not identify questions and grading criteria in the CSV. Please check headers.");
      }

      onUpdateMaster(validRows);
      setSuccess(`Successfully imported ${validRows.length} master questions.`);
    } catch (err: any) {
      setError(err.message || "Failed to parse master spreadsheet.");
    }
  };

  const handleDownloadTemplate = () => {
    const blob = new Blob([MASTER_TEMPLATE_CSV], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "master_questionnaire_template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleSampleData = () => {
    const blob = new Blob([MASTER_TEMPLATE_CSV], { type: 'text/csv' });
    const file = new File([blob], "sample_master_criteria.csv", { type: 'text/csv' });
    processFile(file);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-neutralDark">Platform Settings</h2>
        <p className="text-gray-500">Configure your automated review criteria and knowledge base.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-neutralDark flex items-center gap-2">
              <FileSpreadsheet size={20} className="text-primary"/> 
              Master Questionnaire
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Upload your standard questionnaire with defined Pass/Fail/Consider criteria. 
              The AI will use this as the "Gold Standard" for grading.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleDownloadTemplate}>
            <Download size={16} className="mr-2" /> Template
          </Button>
        </div>

        <div className="p-8">
          {masterQuestionnaire.length > 0 ? (
            <div className="space-y-6">
               <div className="flex items-center justify-between bg-green-50 text-green-800 px-4 py-3 rounded-lg border border-green-100">
                  <div className="flex items-center gap-2">
                      <CheckCircle size={18} />
                      <span className="font-medium">Active Master Questionnaire: {masterQuestionnaire.length} Questions Loaded</span>
                  </div>
                  <button onClick={() => onUpdateMaster([])} className="text-sm hover:underline text-green-700 flex items-center gap-1">
                      <Trash2 size={14} /> Clear
                  </button>
               </div>
               
               <div className="border rounded-lg overflow-hidden">
                   <table className="min-w-full divide-y divide-gray-200">
                       <thead className="bg-gray-50">
                           <tr>
                               <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase">Question</th>
                               <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase text-green-600">Pass Criteria</th>
                               <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase text-orange-500">Consider</th>
                               <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase text-red-600">Fail Criteria</th>
                           </tr>
                       </thead>
                       <tbody className="bg-white divide-y divide-gray-200">
                           {masterQuestionnaire.slice(0, 5).map((row, i) => (
                               <tr key={i}>
                                   <td className="px-4 py-2 text-sm text-gray-900">{row.question}</td>
                                   <td className="px-4 py-2 text-sm text-gray-600">{row.passAnswer}</td>
                                   <td className="px-4 py-2 text-sm text-gray-600">{row.considerAnswer}</td>
                                   <td className="px-4 py-2 text-sm text-gray-600">{row.failAnswer}</td>
                               </tr>
                           ))}
                           {masterQuestionnaire.length > 5 && (
                               <tr>
                                   <td colSpan={4} className="px-4 py-2 text-center text-xs text-gray-400">
                                       ...and {masterQuestionnaire.length - 5} more rows
                                   </td>
                               </tr>
                           )}
                       </tbody>
                   </table>
               </div>
               
               <div className="text-center">
                   <p className="text-sm text-gray-500 mb-2">Need to update?</p>
                   <Button variant="secondary" size="sm" onClick={() => onUpdateMaster([])}>Upload New Version</Button>
               </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div 
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-10 text-center transition-all ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'}`}
              >
                <UploadCloud size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-lg font-medium text-neutralDark">Drag & drop Master CSV here</p>
                <p className="text-sm text-gray-400 mb-6">
                  Must include columns for <strong>Question</strong>, <strong>Pass Answer</strong>, <strong>Consider Answer</strong>, and <strong>Fail Answer</strong>.
                </p>
                
                <div className="flex flex-col items-center space-y-3">
                  <label className="cursor-pointer">
                    <span className="bg-white border border-gray-300 text-neutralDark px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors shadow-sm inline-block">
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
                
                {error && (
                  <div className="mt-6 bg-red-50 border border-red-100 text-red-600 p-3 rounded-lg flex items-center justify-center">
                    <AlertTriangle size={16} className="mr-2" />
                    {error}
                  </div>
                )}
              </div>

              <div className="text-center pt-2">
                 <button onClick={handleSampleData} className="inline-flex items-center text-sm text-primary hover:underline">
                    <FlaskConical size={14} className="mr-1"/> Load Sample Master Data for Testing
                 </button>
              </div>

              <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
                <h4 className="font-bold text-sm text-blue-900 mb-1">Demo Instructions:</h4>
                <p className="text-sm text-blue-800">
                  Your Master CSV defines the "Gold Standard" answers. It must contain headers:
                  <br/>
                  <code>Question, Pass Answer, Consider Answer, Fail Answer</code>
                  <br/>
                  The AI uses these examples to grade incoming vendor questionnaires.
                </p>
              </div>
            </div>
          )}
          
          {success && (
             <div className="mt-4 bg-green-50 border border-green-100 text-green-600 p-3 rounded-lg flex items-center justify-center animate-fade-in-up">
               <CheckCircle size={16} className="mr-2" />
               {success}
             </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-end">
         <Button onClick={() => alert("Settings saved successfully!")} icon>Save Changes</Button>
      </div>
    </div>
  );
};

export default SettingsView;
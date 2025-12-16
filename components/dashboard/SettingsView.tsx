import React, { useState, useEffect } from 'react';
import { CloudUpload, FileSpreadsheet, Download, CircleCheck, TriangleAlert, Trash2, Save, FlaskConical, Loader2, Plus, Edit2, Check, X, Folder } from 'lucide-react';
import Button from '../Button';
import { MasterQuestionnaireRow, QuestionnaireSet, OrganizationSettingsData } from '../../types';
import { supabase } from '../../supabaseClient';

interface SettingsViewProps {
  masterQuestionnaire: MasterQuestionnaireRow[];
  onUpdateMaster: (rows: MasterQuestionnaireRow[]) => void;
}

const MASTER_TEMPLATE_CSV = `Question,Pass Answer,Consider Answer,Fail Answer
"Do you have SOC2 Type II certification?","Yes, active SOC2 Type II report available.","SOC2 Type I only or ISO 27001.","No certification."
"Is data encrypted at rest?","Yes, AES-256.","Yes, but older standard (e.g. 3DES).","No encryption."
"Is Multi-Factor Authentication (MFA) enforced for all access?","Yes, enforced for all users.","Admins only.","No MFA."
"Do you perform annual penetration testing?","Yes, by third-party.","Internal scans only.","No."
"Do you conduct background checks on all employees?","Yes, all employees.","Key roles only.","No."
"Do you have a documented Incident Response Plan?","Yes, tested annually.","Yes, untested.","No."`;

const MAX_SETS = 5;

const SettingsView: React.FC<SettingsViewProps> = ({ masterQuestionnaire, onUpdateMaster }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Multi-set state
  const [sets, setSets] = useState<QuestionnaireSet[]>([]);
  const [activeSetId, setActiveSetId] = useState<string>('default');

  // Load sets on mount
  useEffect(() => {
    fetchSets();
  }, []);

  const fetchSets = async () => {
     const { data: { user } } = await supabase.auth.getUser();
     if (!user) {
         // Fallback for demo/no-auth mode: wrap current masterQuestionnaire as default
         setSets([{ id: 'default', name: 'Master Questionnaire (Default)', lastUpdated: new Date(), rows: masterQuestionnaire }]);
         return;
     }

     const { data, error } = await supabase
          .from('organization_settings')
          .select('questionnaire_data')
          .eq('user_id', user.id)
          .single();

     if (data && data.questionnaire_data) {
         const qData = data.questionnaire_data;
         if (Array.isArray(qData)) {
             // Migrate legacy array to sets structure
             const defaultSet: QuestionnaireSet = {
                 id: 'default',
                 name: 'Master Questionnaire (Default)',
                 lastUpdated: new Date(),
                 rows: qData as MasterQuestionnaireRow[]
             };
             setSets([defaultSet]);
             setActiveSetId('default');
         } else if (qData.sets && Array.isArray(qData.sets)) {
             // Load new structure
             setSets(qData.sets);
             setActiveSetId(qData.activeSetId || qData.sets[0]?.id || 'default');
         }
     } else {
         // Initialize if empty
         const defaultSet: QuestionnaireSet = {
             id: 'default',
             name: 'Master Questionnaire (Default)',
             lastUpdated: new Date(),
             rows: masterQuestionnaire
         };
         setSets([defaultSet]);
     }
  };

  const activeSet = sets.find(s => s.id === activeSetId) || sets[0];

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

  // Local raw CSV parser to preserve all columns
  const parseRawCSV = (text: string): Promise<Record<string, string>[]> => {
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

        const headers = parseLine(lines[0]).map(h => h.trim());
        const data: Record<string, string>[] = [];

        for (let i = 1; i < lines.length; i++) {
          const rowValues = parseLine(lines[i]);
          const rowObj: Record<string, string> = {};
          
          headers.forEach((header, index) => {
             rowObj[header] = rowValues[index] || '';
          });
          
          data.push(rowObj);
        }
        resolve(data);
      } catch (e: any) {
        reject(new Error("Failed to parse CSV: " + e.message));
      }
    });
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
      const rawRows = await parseRawCSV(text);
      
      const mappedRows: MasterQuestionnaireRow[] = rawRows.map(r => {
        // Case insensitive key lookup
        const keys = Object.keys(r);
        const findKey = (term: string) => keys.find(k => k.toLowerCase().includes(term.toLowerCase()));

        const qKey = findKey('question');
        const passKey = findKey('pass');
        const considerKey = findKey('consider');
        const failKey = findKey('fail');

        return {
          question: r[qKey || ''] || "Untitled Question",
          passAnswer: r[passKey || ''] || "",
          considerAnswer: r[considerKey || ''] || "",
          failAnswer: r[failKey || ''] || ""
        };
      });

      // Strict Validation for Master File
      const validRows = mappedRows.filter(r => 
          r.question && 
          r.question !== "Untitled Question" &&
          (r.passAnswer || r.failAnswer)
      );
      
      if (validRows.length === 0) {
        throw new Error("Could not identify questions and grading criteria in the CSV. Please check headers (Question, Pass Answer, Consider Answer, Fail Answer).");
      }

      // Update the active set
      const updatedSets = sets.map(s => {
          if (s.id === activeSetId) {
              return { ...s, rows: validRows, lastUpdated: new Date() };
          }
          return s;
      });
      setSets(updatedSets);
      
      // Update Parent App State immediately
      onUpdateMaster(validRows);
      
      // Persist to Cloud
      await saveSetsToDatabase(updatedSets, activeSetId);

      setSuccess(`Successfully imported and saved ${validRows.length} questions to "${activeSet?.name}".`);
    } catch (err: any) {
      setError(err.message || "Failed to parse master spreadsheet.");
    }
  };

  const saveSetsToDatabase = async (currentSets: QuestionnaireSet[], currentActiveId: string) => {
    setIsSaving(true);
    try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
           console.warn("No user logged in. Data saved to local memory only.");
           return;
        }

        const payload: OrganizationSettingsData = {
            activeSetId: currentActiveId,
            sets: currentSets
        };

        const { error } = await supabase
            .from('organization_settings')
            .upsert({ 
                user_id: user.id, 
                questionnaire_data: payload 
            }, { onConflict: 'user_id' });

        if (error) throw error;
    } catch (err: any) {
        console.error("Database Save Error:", err);
        setError("Saved locally, but failed to sync to cloud: " + err.message);
    } finally {
        setIsSaving(false);
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
  
  // -- New Functionality --

  const handleAddSet = () => {
      if (sets.length >= MAX_SETS) return;
      const newId = `set-${Date.now()}`;
      const newSet: QuestionnaireSet = {
          id: newId,
          name: `Master Questionnaire ${sets.length + 1}`,
          lastUpdated: new Date(),
          rows: [] // Empty start
      };
      const updatedSets = [...sets, newSet];
      setSets(updatedSets);
      setActiveSetId(newId);
      // Don't auto-save just yet, let them add data? 
      // Actually syncing state is safer.
      saveSetsToDatabase(updatedSets, newId);
      onUpdateMaster([]); // New set is empty
  };

  const handleSwitchSet = (id: string) => {
      setActiveSetId(id);
      const targetSet = sets.find(s => s.id === id);
      if (targetSet) {
          onUpdateMaster(targetSet.rows);
          // Persist the active selection
          saveSetsToDatabase(sets, id);
      }
      setError(null);
      setSuccess(null);
      setIsEditing(false);
  };

  const handleRowChange = (index: number, field: keyof MasterQuestionnaireRow, value: string) => {
      if (!activeSet) return;
      const newRows = [...activeSet.rows];
      newRows[index] = { ...newRows[index], [field]: value };
      
      const updatedSets = sets.map(s => s.id === activeSetId ? { ...s, rows: newRows } : s);
      setSets(updatedSets);
  };

  const handleSaveEdit = async () => {
      if (!activeSet) return;
      setIsEditing(false);
      onUpdateMaster(activeSet.rows);
      await saveSetsToDatabase(sets, activeSetId);
      setSuccess("Changes saved successfully.");
  };
  
  const handleCancelEdit = () => {
      // Revert to what is in DB/Memory before edit? 
      // For simplicity, we assume sets state is the source of truth. 
      // If user wants to cancel, we might need a backup. 
      // Since this is a simple app, we'll just toggle off. 
      // Ideally we would revert, but let's just commit what we have or reload.
      setIsEditing(false);
      // Re-fetch to revert changes?
      fetchSets();
  };

  const handleRenameSet = (name: string) => {
      const updatedSets = sets.map(s => s.id === activeSetId ? { ...s, name } : s);
      setSets(updatedSets);
      saveSetsToDatabase(updatedSets, activeSetId);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-neutralDark dark:text-white">Platform Settings</h2>
           <p className="text-gray-500 dark:text-gray-400">Configure your automated review criteria and knowledge base.</p>
        </div>
        
        {/* Set Selector */}
        <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700">
            {sets.map(s => (
                <button
                    key={s.id}
                    onClick={() => handleSwitchSet(s.id)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all flex items-center ${
                        activeSetId === s.id 
                        ? 'bg-primary text-white shadow-sm' 
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                    }`}
                >
                   <Folder size={14} className="mr-2" />
                   {s.name.length > 15 ? s.name.substring(0, 15) + '...' : s.name}
                </button>
            ))}
            {sets.length < MAX_SETS && (
                <button 
                    onClick={handleAddSet}
                    className="px-2 py-1.5 text-gray-400 hover:text-primary hover:bg-blue-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                    title="Add another Master Questionnaire"
                >
                    <Plus size={18} />
                </button>
            )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            {isEditing ? (
                 <input 
                    type="text" 
                    value={activeSet?.name}
                    onChange={(e) => handleRenameSet(e.target.value)}
                    className="font-bold text-neutralDark text-lg bg-white dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded px-2 py-1 focus:ring-2 focus:ring-primary outline-none"
                 />
            ) : (
                <h3 className="font-bold text-neutralDark dark:text-white flex items-center gap-2 text-lg">
                  <FileSpreadsheet size={20} className="text-primary"/> 
                  {activeSet?.name}
                </h3>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {activeSet?.rows.length || 0} Criteria Defined • Last updated {new Date().toLocaleDateString()}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
             {isEditing ? (
                 <>
                    <Button variant="ghost" size="sm" onClick={handleCancelEdit} className="text-gray-500 dark:text-gray-400">
                        <X size={16} className="mr-1" /> Cancel
                    </Button>
                    <Button variant="primary" size="sm" onClick={handleSaveEdit}>
                        <Check size={16} className="mr-1" /> Save Changes
                    </Button>
                 </>
             ) : (
                 <>
                     <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)} className="dark:bg-gray-700 dark:text-white dark:border-gray-600">
                        <Edit2 size={16} className="mr-2" /> Edit Manually
                     </Button>
                     <Button variant="outline" size="sm" onClick={handleDownloadTemplate} className="dark:text-white dark:border-gray-600 dark:hover:bg-gray-700">
                        <Download size={16} className="mr-2" /> Template
                     </Button>
                 </>
             )}
          </div>
        </div>

        <div className="p-8">
          {activeSet && activeSet.rows.length > 0 ? (
            <div className="space-y-6">
               <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400 px-4 py-3 rounded-lg border border-green-100 dark:border-green-900/50">
                  <div className="flex items-center gap-2">
                      <CircleCheck size={18} />
                      <span className="font-medium">Active Questionnaire Loaded</span>
                  </div>
                  {!isEditing && (
                      <button 
                        onClick={() => {
                            const empty = sets.map(s => s.id === activeSetId ? { ...s, rows: [] } : s);
                            setSets(empty);
                            saveSetsToDatabase(empty, activeSetId);
                            onUpdateMaster([]);
                        }} 
                        className="text-sm hover:underline text-green-700 dark:text-green-400 flex items-center gap-1"
                      >
                          <Trash2 size={14} /> Clear All
                      </button>
                  )}
               </div>
               
               <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                   <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                       <thead className="bg-gray-50 dark:bg-gray-900">
                           <tr>
                               <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase w-12">#</th>
                               <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase w-1/3">Question</th>
                               <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase text-green-600 dark:text-green-400">Pass Criteria</th>
                               <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase text-orange-500 dark:text-orange-400">Consider</th>
                               <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase text-red-600 dark:text-red-400">Fail Criteria</th>
                           </tr>
                       </thead>
                       <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                           {(isEditing || isExpanded ? activeSet.rows : activeSet.rows.slice(0, 5)).map((row, i) => (
                               <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                   <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 font-medium align-top">
                                       {i + 1}
                                   </td>
                                   <td className="px-4 py-2 text-sm text-gray-900 dark:text-white align-top">
                                       {isEditing ? (
                                           <textarea 
                                             rows={2}
                                             className="w-full p-2 border rounded text-sm focus:ring-1 focus:ring-primary outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                             value={row.question}
                                             onChange={(e) => handleRowChange(i, 'question', e.target.value)}
                                           />
                                       ) : row.question}
                                   </td>
                                   <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 align-top">
                                       {isEditing ? (
                                           <textarea 
                                             rows={2}
                                             className="w-full p-2 border rounded text-sm focus:ring-1 focus:ring-green-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                             value={row.passAnswer}
                                             onChange={(e) => handleRowChange(i, 'passAnswer', e.target.value)}
                                           />
                                       ) : row.passAnswer}
                                   </td>
                                   <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 align-top">
                                       {isEditing ? (
                                           <textarea 
                                             rows={2}
                                             className="w-full p-2 border rounded text-sm focus:ring-1 focus:ring-orange-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                             value={row.considerAnswer}
                                             onChange={(e) => handleRowChange(i, 'considerAnswer', e.target.value)}
                                           />
                                       ) : row.considerAnswer}
                                   </td>
                                   <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 align-top">
                                       {isEditing ? (
                                           <textarea 
                                             rows={2}
                                             className="w-full p-2 border rounded text-sm focus:ring-1 focus:ring-red-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                             value={row.failAnswer}
                                             onChange={(e) => handleRowChange(i, 'failAnswer', e.target.value)}
                                           />
                                       ) : row.failAnswer}
                                   </td>
                               </tr>
                           ))}
                           {!isEditing && activeSet.rows.length > 5 && !isExpanded && (
                               <tr 
                                  onClick={() => setIsExpanded(true)}
                                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                               >
                                   <td colSpan={5} className="px-4 py-3 text-center text-xs text-gray-500 dark:text-gray-400 font-medium group-hover:text-primary">
                                       ...and {activeSet.rows.length - 5} more rows (Click to expand)
                                   </td>
                               </tr>
                           )}
                           {!isEditing && activeSet.rows.length > 5 && isExpanded && (
                               <tr 
                                  onClick={() => setIsExpanded(false)}
                                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                               >
                                   <td colSpan={5} className="px-4 py-3 text-center text-xs text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300">
                                       Show less
                                   </td>
                               </tr>
                           )}
                       </tbody>
                   </table>
               </div>
               
               {!isEditing && (
                   <div className="text-center">
                       <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Need to replace entirely?</p>
                       <label className="cursor-pointer inline-block">
                            <span className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-neutralDark dark:text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm inline-flex items-center">
                                <CloudUpload size={14} className="mr-2"/> Upload New CSV
                            </span>
                            <input type="file" className="hidden" accept=".csv" onChange={handleFileInput} />
                        </label>
                   </div>
               )}
            </div>
          ) : (
            <div className="space-y-6">
              <div 
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-10 text-center transition-all ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 dark:border-gray-600 hover:border-primary/50 dark:hover:border-primary/50'}`}
              >
                <CloudUpload size={48} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-lg font-medium text-neutralDark dark:text-white">Drag & drop Master CSV here</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">
                  For "{activeSet?.name}"
                </p>
                
                <div className="flex flex-col items-center space-y-3">
                  <label className="cursor-pointer">
                    <span className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-neutralDark dark:text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm inline-block">
                    Browse Files
                    </span>
                    <input type="file" className="hidden" accept=".csv" onChange={handleFileInput} />
                  </label>
                  
                  <div className="relative flex items-center w-full max-w-xs py-2">
                     <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                     <span className="flex-shrink-0 mx-4 text-gray-300 dark:text-gray-600 text-xs">OR</span>
                     <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                  </div>

                  <Button 
                     variant="secondary" 
                     size="sm"
                     onClick={handleDownloadTemplate}
                     className="text-xs text-gray-600 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600"
                   >
                     <Download size={14} className="mr-2" /> Download CSV Template
                   </Button>
                </div>
                
                {error && (
                  <div className="mt-6 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 p-3 rounded-lg flex items-center justify-center">
                    <TriangleAlert size={16} className="mr-2" />
                    {error}
                  </div>
                )}
              </div>

              <div className="text-center pt-2">
                 <button onClick={handleSampleData} className="inline-flex items-center text-sm text-primary hover:underline">
                    <FlaskConical size={14} className="mr-1"/> Load Sample Master Data for Testing
                 </button>
              </div>
            </div>
          )}
          
          {success && (
             <div className="mt-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/50 text-green-600 dark:text-green-400 p-3 rounded-lg flex items-center justify-center animate-fade-in-up">
               <CircleCheck size={16} className="mr-2" />
               {success}
             </div>
          )}

          {isSaving && (
             <div className="mt-4 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                 <Loader2 size={16} className="animate-spin mr-2" /> Saving to cloud...
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
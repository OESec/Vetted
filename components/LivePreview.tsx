import React, { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, Check, TriangleAlert, X, Loader2 } from 'lucide-react';

const LivePreview: React.FC = () => {
  const [stage, setStage] = useState<'upload' | 'processing' | 'results'>('upload');
  const [progress, setProgress] = useState(0);

  const startDemo = () => {
    setStage('processing');
    let p = 0;
    const interval = setInterval(() => {
      p += 2; // Speed of progress
      if (p > 100) {
        clearInterval(interval);
        setStage('results');
      }
      setProgress(p);
    }, 30);
  };

  const resetDemo = () => {
    setStage('upload');
    setProgress(0);
  };

  return (
    <section className="py-20 bg-neutralLight overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:flex lg:items-start lg:space-x-12">
          
          {/* Text Side */}
          <div className="lg:w-1/3 mb-10 lg:mb-0">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-neutralDark mb-6">
              See it in action
            </h2>
            <p className="text-lg text-neutralDark/70 mb-8">
              Experience the speed of automated analysis. Try our interactive demo to see how Vetted parses spreadsheets and flags risks in seconds.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-lg text-primary mt-1">
                  <Upload size={18} />
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-neutralDark">Smart Import</h4>
                  <p className="text-sm text-neutralDark/60">Upload messy Excels. We handle headers and formatting.</p>
                </div>
              </div>
              <div className="flex items-start">
                 <div className="bg-warning/10 p-2 rounded-lg text-warning mt-1">
                  <TriangleAlert size={18} />
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-neutralDark">Risk Flagging</h4>
                  <p className="text-sm text-neutralDark/60">Auto-detection of "No", "Partial", and missing evidence.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Component Side */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden min-h-[500px] flex flex-col relative">
              {/* Window Controls */}
              <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="text-xs font-mono text-gray-400">app.vetted.ai</div>
                <div></div>
              </div>

              {/* Content Area */}
              <div className="flex-1 p-8 flex flex-col items-center justify-center relative bg-slate-50">
                
                {stage === 'upload' && (
                  <div 
                    onClick={startDemo}
                    className="w-full max-w-md p-10 border-2 border-dashed border-gray-300 rounded-xl bg-white hover:bg-gray-50 hover:border-primary transition-all cursor-pointer flex flex-col items-center text-center group"
                  >
                    <div className="w-16 h-16 bg-blue-50 text-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Upload size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-neutralDark mb-2">Upload Questionnaire</h3>
                    <p className="text-neutralDark/50 mb-6">Click to simulate uploading a .xlsx file</p>
                    <span className="text-xs text-primary font-bold uppercase tracking-wide">Try Demo</span>
                  </div>
                )}

                {stage === 'processing' && (
                  <div className="w-full max-w-md text-center">
                    <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-6" />
                    <h3 className="text-xl font-bold text-neutralDark mb-2">Analyzing Responses...</h3>
                    <p className="text-neutralDark/50 mb-6">Matching against security policies</p>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                      <div className="bg-primary h-2.5 rounded-full transition-all duration-100" style={{ width: `${progress}%` }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-2">
                      <span>Parsing rows</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                  </div>
                )}

                {stage === 'results' && (
                  <div className="w-full h-full flex flex-col absolute inset-0 bg-white animate-fade-in-up">
                    <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white">
                      <div>
                        <h3 className="text-lg font-bold text-neutralDark flex items-center">
                          <FileSpreadsheet className="mr-2 text-primary" size={20}/>
                          Vendor_Assessment_v2.xlsx
                        </h3>
                        <span className="text-xs text-gray-500">Processed just now</span>
                      </div>
                      <div className="flex items-center space-x-3">
                         <div className="px-3 py-1 bg-red-50 text-red-600 text-sm font-bold rounded-full border border-red-100 flex items-center">
                            <TriangleAlert size={14} className="mr-1"/> 2 Critical
                         </div>
                         <button onClick={resetDemo} className="text-sm text-gray-500 hover:text-primary underline">Reset Demo</button>
                      </div>
                    </div>

                    <div className="flex-1 overflow-auto custom-scrollbar p-0">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 sticky top-0 z-10">
                          <tr>
                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider w-1/2">Question</th>
                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Response</th>
                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {[
                            { id: '1.2', q: 'Do you encrypt data at rest?', a: 'Yes, AES-256', s: 'pass' },
                            { id: '1.3', q: 'Do you conduct annual penetration testing?', a: 'Yes', s: 'pass' },
                            { id: '2.1', q: 'Is MFA enforced for all employees?', a: 'Only for admins', s: 'fail' },
                            { id: '2.4', q: 'Do you have a documented BCP?', a: 'In progress', s: 'warn' },
                            { id: '3.1', q: 'Are background checks performed?', a: 'Yes', s: 'pass' },
                            { id: '4.2', q: 'Data retention policy duration?', a: 'Undefined', s: 'fail' },
                          ].map((row, idx) => (
                            <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                              <td className="px-6 py-4 text-sm text-gray-500 font-mono">{row.id}</td>
                              <td className="px-6 py-4 text-sm text-neutralDark font-medium">{row.q}</td>
                              <td className="px-6 py-4 text-sm text-gray-600">{row.a}</td>
                              <td className="px-6 py-4">
                                {row.s === 'pass' && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"><Check size={12} className="mr-1"/> Pass</span>}
                                {row.s === 'fail' && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800"><X size={12} className="mr-1"/> Fail</span>}
                                {row.s === 'warn' && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800"><TriangleAlert size={12} className="mr-1"/> Review</span>}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LivePreview;
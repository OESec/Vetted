import React, { useState } from 'react';
import { ReviewSet, AuditReport } from '../../types';
import { ArrowLeft, Award, TriangleAlert, CircleCheck, ChevronRight, ChartBar, FilePlus, Upload, ShieldCheck, ShieldAlert, ChevronDown } from 'lucide-react';
import Button from '../Button';

interface ReviewSetViewerProps {
  reviewSet: ReviewSet;
  onBack: () => void;
  onViewReport: (report: AuditReport) => void;
  onAddReport: () => void;
  onUpdateStatus: (id: string, status: 'Open' | 'Closed' | 'Archived') => void;
}

const ReviewSetViewer: React.FC<ReviewSetViewerProps> = ({ reviewSet, onBack, onViewReport, onAddReport, onUpdateStatus }) => {
  // Logic to find the best report
  const sortedReports = [...reviewSet.reports].sort((a, b) => b.summary.score - a.summary.score);
  const bestReport = sortedReports[0];
  const singleMode = sortedReports.length === 1;

  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div>
        <button onClick={onBack} className="text-sm text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary mb-2 flex items-center">
            <ArrowLeft size={14} className="mr-1"/> Back to Dashboard
        </button>
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-200 dark:border-gray-700 pb-6">
            <div>
                <h2 className="text-3xl font-bold text-neutralDark dark:text-white">{reviewSet.name}</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-2xl">{reviewSet.description}</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-3">
                <div className="relative">
                    <button 
                        onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium cursor-pointer hover:opacity-80 transition-opacity ${
                            reviewSet.status === 'Open' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}
                    >
                        Status: {reviewSet.status} <ChevronDown size={14} className="ml-1" />
                    </button>
                    {isStatusMenuOpen && (
                        <div className="absolute top-full mt-2 left-0 bg-white dark:bg-gray-800 shadow-xl rounded-lg border border-gray-200 dark:border-gray-700 p-2 z-10 w-40">
                            {reviewSet.status === 'Closed' && (
                                <button 
                                    onClick={() => {
                                        onUpdateStatus(reviewSet.id, 'Open');
                                        setIsStatusMenuOpen(false);
                                    }}
                                    className="w-full text-left px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                                >
                                    Reopen
                                </button>
                            )}
                            {reviewSet.status === 'Open' && (
                                <button 
                                    onClick={() => {
                                        onUpdateStatus(reviewSet.id, 'Closed');
                                        setIsStatusMenuOpen(false);
                                    }}
                                    className="w-full text-left px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                                >
                                    Close Review
                                </button>
                            )}
                            <button 
                                onClick={() => setIsStatusMenuOpen(false)}
                                className="w-full text-left px-3 py-2 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>

                {reviewSet.reports.length > 0 && (
                    <Button 
                        size="sm" 
                        onClick={onAddReport} 
                        disabled={reviewSet.status === 'Closed'}
                        className={reviewSet.status === 'Closed' ? 'opacity-50 cursor-not-allowed bg-gray-400' : ''}
                    >
                        <Upload size={14} className="mr-2" /> Add Report
                    </Button>
                )}
            </div>
        </div>
      </div>

      {reviewSet.reports.length === 0 ? (
        <div className="bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-16 text-center">
            <div className="w-20 h-20 bg-white dark:bg-gray-700 shadow-sm rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                <FilePlus size={40} />
            </div>
            <h3 className="text-xl font-bold text-neutralDark dark:text-white">This review set is empty</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mt-2 mb-8">
                Upload your first vendor questionnaire to start the comparison.
            </p>
            <Button size="lg" onClick={onAddReport} icon disabled={reviewSet.status === 'Closed'} className={reviewSet.status === 'Closed' ? 'opacity-50 cursor-not-allowed bg-gray-400' : ''}>
                Upload Audit Report
            </Button>
        </div>
      ) : (
        <>
          {/* AI Insight Box */}
          <div className="bg-gradient-to-br from-indigo-50 to-white dark:from-gray-800 dark:to-gray-900 border border-indigo-100 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
            <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-xl shadow-lg ${singleMode ? 'bg-blue-600 text-white' : 'bg-indigo-600 text-white'}`}>
                    {singleMode ? <ShieldCheck size={28} /> : <Award size={28} />}
                </div>
                <div>
                    <h3 className={`text-lg font-bold ${singleMode ? 'text-blue-900 dark:text-blue-100' : 'text-indigo-900 dark:text-indigo-100'}`}>
                        {singleMode ? 'Analysis Summary' : 'AI Recommendation'}
                    </h3>
                    <p className={`${singleMode ? 'text-blue-800 dark:text-blue-200' : 'text-indigo-800 dark:text-indigo-200'} mt-1`}>
                        {singleMode ? (
                           <>
                             <strong>{bestReport.fileName.replace('.csv', '')}</strong> has a security score of <span className="font-bold">{bestReport.summary.score}/100</span>.
                             {bestReport.summary.score > 80 
                               ? " This vendor demonstrates a strong security posture with minimal risks detected."
                               : bestReport.summary.score > 60 
                               ? " Several medium risks were identified that may require remediation."
                               : " Critical gaps were found. Proceed with caution."}
                           </>
                        ) : (
                           <>
                             Based on security score and risk profile, <strong>{bestReport.fileName.replace('.csv', '')}</strong> is the strongest candidate. 
                             They scored <span className="font-bold">{bestReport.summary.score}/100</span> with fewer critical risks than competitors.
                           </>
                        )}
                    </p>
                </div>
            </div>
          </div>

          {/* Comparison/Analysis Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center space-x-2">
                <ChartBar size={18} className="text-gray-400" />
                <h3 className="font-bold text-gray-700 dark:text-gray-200">{singleMode ? 'Supplier Analysis' : 'Supplier Comparison Matrix'}</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Vendor File</th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Security Score</th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Risk Profile</th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Analysis</th>
                    <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {sortedReports.map((report, idx) => {
                    const isWinner = !singleMode && idx === 0;
                    
                    return (
                        <tr key={report.id} className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${isWinner ? 'bg-green-50/30 dark:bg-green-900/10' : ''}`}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className={`w-2 h-10 rounded-l-md mr-3 ${isWinner ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                                    <div>
                                        <div className="text-sm font-bold text-neutralDark dark:text-white">{report.fileName.replace(/_/g, ' ').replace('.csv', '')}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">Submitted: {report.uploadDate.toLocaleDateString()}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
                                    report.summary.score > 80 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                                    report.summary.score > 60 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                }`}>
                                    {report.summary.score}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex justify-center space-x-4">
                                    <div className="text-center" title="High Risk">
                                        <span className="text-red-600 dark:text-red-400 font-bold block">{report.summary.highRisk}</span>
                                        <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase">Critical</span>
                                    </div>
                                    <div className="text-center" title="Medium Risk">
                                        <span className="text-orange-500 dark:text-orange-400 font-bold block">{report.summary.mediumRisk}</span>
                                        <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase">Medium</span>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                {singleMode ? (
                                    <div className={`flex items-center justify-center text-sm font-medium ${report.summary.score > 70 ? 'text-blue-700 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'}`}>
                                        {report.summary.score > 70 ? (
                                            <><ShieldCheck size={16} className="mr-1.5" /> High Compliance</>
                                        ) : (
                                            <><ShieldAlert size={16} className="mr-1.5" /> Review Required</>
                                        )}
                                    </div>
                                ) : isWinner ? (
                                    <div className="flex items-center justify-center text-green-700 dark:text-green-400 text-sm font-medium">
                                        <CircleCheck size={16} className="mr-1.5" /> Recommended Choice
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
                                        <span className="mr-1.5 text-red-400">-{bestReport.summary.score - report.summary.score} pts</span> vs Top
                                    </div>
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-primary hover:bg-blue-50 dark:hover:bg-gray-700"
                                    onClick={() => onViewReport(report)}
                                >
                                    View Details <ChevronRight size={16} className="ml-1" />
                                </Button>
                            </td>
                        </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ReviewSetViewer;
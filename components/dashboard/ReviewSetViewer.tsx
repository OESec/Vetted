
import React from 'react';
import { ReviewSet, AuditReport } from '../../types';
import { ArrowLeft, Award, AlertTriangle, CheckCircle, ChevronRight, BarChart, FilePlus } from 'lucide-react';
import Button from '../Button';

interface ReviewSetViewerProps {
  reviewSet: ReviewSet;
  onBack: () => void;
  onViewReport: (report: AuditReport) => void;
}

const ReviewSetViewer: React.FC<ReviewSetViewerProps> = ({ reviewSet, onBack, onViewReport }) => {
  // Logic to find the best report
  const sortedReports = [...reviewSet.reports].sort((a, b) => b.summary.score - a.summary.score);
  const bestReport = sortedReports[0];

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div>
        <button onClick={onBack} className="text-sm text-gray-500 hover:text-primary mb-2 flex items-center">
            <ArrowLeft size={14} className="mr-1"/> Back to Dashboard
        </button>
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-200 pb-6">
            <div>
                <h2 className="text-3xl font-bold text-neutralDark">{reviewSet.name}</h2>
                <p className="text-gray-500 mt-2 max-w-2xl">{reviewSet.description}</p>
            </div>
            <div className="mt-4 md:mt-0">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    reviewSet.status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                    Status: {reviewSet.status}
                </span>
            </div>
        </div>
      </div>

      {reviewSet.reports.length === 0 ? (
        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                <FilePlus size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-700">No Reports Yet</h3>
            <p className="text-gray-500 max-w-md mx-auto mt-2">
                This review set is empty. Upload new vendor audits or add existing reports to start comparing.
            </p>
        </div>
      ) : (
        <>
          {/* Recommendation Engine */}
          <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-start space-x-4">
                <div className="bg-indigo-600 text-white p-3 rounded-xl shadow-lg">
                    <Award size={28} />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-indigo-900">AI Recommendation</h3>
                    <p className="text-indigo-800 mt-1">
                        Based on security score and risk profile, <strong>{bestReport.fileName.replace('.csv', '')}</strong> is the strongest candidate. 
                        They scored <span className="font-bold">{bestReport.summary.score}/100</span> with fewer critical risks than competitors.
                    </p>
                </div>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center space-x-2">
                <BarChart size={18} className="text-gray-400" />
                <h3 className="font-bold text-gray-700">Supplier Comparison Matrix</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Vendor File</th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Security Score</th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Risk Profile</th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Analysis</th>
                    <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedReports.map((report, idx) => {
                    const isWinner = idx === 0;
                    return (
                        <tr key={report.id} className={`hover:bg-gray-50 transition-colors ${isWinner ? 'bg-green-50/30' : ''}`}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className={`w-2 h-10 rounded-l-md mr-3 ${isWinner ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                    <div>
                                        <div className="text-sm font-bold text-neutralDark">{report.fileName.replace(/_/g, ' ').replace('.csv', '')}</div>
                                        <div className="text-xs text-gray-500">Submitted: {report.uploadDate.toLocaleDateString()}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
                                    report.summary.score > 80 ? 'bg-green-100 text-green-700' : 
                                    report.summary.score > 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                }`}>
                                    {report.summary.score}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex justify-center space-x-4">
                                    <div className="text-center" title="High Risk">
                                        <span className="text-red-600 font-bold block">{report.summary.highRisk}</span>
                                        <span className="text-[10px] text-gray-400 uppercase">Critical</span>
                                    </div>
                                    <div className="text-center" title="Medium Risk">
                                        <span className="text-orange-500 font-bold block">{report.summary.mediumRisk}</span>
                                        <span className="text-[10px] text-gray-400 uppercase">Medium</span>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                {isWinner ? (
                                    <div className="flex items-center text-green-700 text-sm font-medium">
                                        <CheckCircle size={16} className="mr-1.5" /> Recommended Choice
                                    </div>
                                ) : (
                                    <div className="flex items-center text-gray-500 text-sm">
                                        <span className="mr-1.5 text-red-400">-{bestReport.summary.score - report.summary.score} pts</span> vs Top
                                    </div>
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-primary hover:bg-blue-50"
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

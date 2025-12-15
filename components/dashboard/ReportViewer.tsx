
import React from 'react';
import { AuditReport, AnalysisResult, Decision } from '../../types';
import { AlertTriangle, CheckCircle, HelpCircle, AlertOctagon, Download, FileText, Printer, XCircle, MinusCircle } from 'lucide-react';
import Button from '../Button';

interface ReportViewerProps {
  report: AuditReport;
  onBack: () => void;
}

const ReportViewer: React.FC<ReportViewerProps> = ({ report, onBack }) => {
  const getRiskBadge = (risk: AnalysisResult['riskLevel']) => {
    switch(risk) {
      case 'High': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><AlertOctagon size={12} className="mr-1"/> High Risk</span>;
      case 'Medium': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800"><AlertTriangle size={12} className="mr-1"/> Medium Risk</span>;
      case 'Low': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><HelpCircle size={12} className="mr-1"/> Low Risk</span>;
      case 'Pass': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle size={12} className="mr-1"/> Pass</span>;
      default: return null;
    }
  };

  const getDecision = (risk: AnalysisResult['riskLevel']): Decision => {
    if (risk === 'High') return 'FAIL';
    if (risk === 'Pass') return 'PASS';
    return 'CONSIDER'; // Medium or Low
  };

  const getDecisionBadge = (decision: Decision) => {
    switch(decision) {
      case 'FAIL': return <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-bold bg-red-600 text-white shadow-sm"><XCircle size={14} className="mr-1.5"/> FAIL</span>;
      case 'PASS': return <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-bold bg-green-600 text-white shadow-sm"><CheckCircle size={14} className="mr-1.5"/> PASS</span>;
      case 'CONSIDER': return <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-bold bg-amber-500 text-white shadow-sm"><MinusCircle size={14} className="mr-1.5"/> CONSIDER</span>;
    }
  };

  const handleExportCSV = () => {
    if (!report.rows || report.rows.length === 0) {
      alert("No data rows available to export.");
      return;
    }

    const headers = ['ID', 'Question', 'Answer', 'Category', 'Risk Level', 'Decision', 'Feedback', 'Evidence Required'];
    const csvRows = [headers.join(',')];
    
    report.rows.forEach(row => {
        const result = report.results[row.id];
        if(result) {
            const safe = (str: string | undefined) => `"${(str || '').replace(/"/g, '""')}"`;
            const decision = getDecision(result.riskLevel);
            csvRows.push([
                safe(row.id),
                safe(row.question),
                safe(row.answer),
                safe(row.category),
                safe(result.riskLevel),
                safe(decision),
                safe(result.feedback),
                result.evidenceRequired ? 'Yes' : 'No'
            ].join(','));
        }
    });
    
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.fileName.replace('.csv', '')}_analysis_report.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in-up print:space-y-4">
      {/* Header Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button onClick={onBack} className="text-sm text-gray-500 hover:text-primary mb-1 no-print">← Back</button>
          <h2 className="text-2xl font-bold text-neutralDark flex items-center">
            {report.fileName}
            <span className="ml-4 text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded print:border print:border-gray-300">
              {report.uploadDate.toLocaleDateString()}
            </span>
          </h2>
        </div>
        <div className="flex space-x-3 no-print">
          <Button onClick={handleExportCSV} variant="secondary" size="sm" className="flex items-center">
            <Download size={16} className="mr-2" /> Export CSV
          </Button>
          <Button onClick={handleExportPDF} variant="secondary" size="sm" className="flex items-center">
            <Printer size={16} className="mr-2" /> Print / Save PDF
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 print:grid-cols-4">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm print:border-gray-300 print:shadow-none break-inside-avoid">
          <p className="text-sm text-gray-500">Security Score</p>
          <p className={`text-3xl font-bold ${report.summary.score > 80 ? 'text-green-600' : report.summary.score > 60 ? 'text-yellow-600' : 'text-red-600'}`}>
            {report.summary.score}/100
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm print:border-gray-300 print:shadow-none break-inside-avoid">
          <p className="text-sm text-gray-500">Critical Risks</p>
          <p className="text-3xl font-bold text-red-600">{report.summary.highRisk}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm print:border-gray-300 print:shadow-none break-inside-avoid">
          <p className="text-sm text-gray-500">Warnings</p>
          <p className="text-3xl font-bold text-orange-500">{report.summary.mediumRisk + report.summary.lowRisk}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm print:border-gray-300 print:shadow-none break-inside-avoid">
          <p className="text-sm text-gray-500">Pass Rate</p>
          <p className="text-3xl font-bold text-success">{Math.round((report.summary.pass / report.summary.total) * 100)}%</p>
        </div>
      </div>

      {/* Detail Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden print:border-0 print:shadow-none">
        <div className="overflow-x-auto print:overflow-visible">
          <table className="min-w-full divide-y divide-gray-200 print:divide-gray-300">
            <thead className="bg-gray-50 print:bg-gray-100">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[28%]">Question</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[20%]">Supplier Answer</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[25%]">AI Assessment</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Decision</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 print:divide-gray-300">
              {report.rows.length === 0 ? (
                 <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500 italic">No detailed row data available for this report.</td></tr>
              ) : (
                report.rows.map((row) => {
                  const result = report.results[row.id];
                  if (!result) return (
                    <tr key={row.id}>
                        <td className="px-6 py-4 text-sm text-red-500" colSpan={5}>Missing analysis for row {row.id}</td>
                    </tr>
                  );

                  return (
                    <tr key={row.id} className="break-inside-avoid border-b border-gray-100 print:border-gray-300">
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium align-top">
                        {row.question}
                        <div className="text-xs text-gray-400 mt-1">{row.category}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 align-top italic">
                        "{row.answer}"
                      </td>
                      <td className="px-6 py-4 text-sm align-top">
                        <p className="text-gray-800 mb-1">{result.feedback}</p>
                        {result.complianceFlag && (
                          <span className="text-xs font-semibold text-red-600 block mt-1">🚩 {result.complianceFlag}</span>
                        )}
                        {result.evidenceRequired && (
                          <span className="text-xs font-semibold text-blue-600 block mt-1">📎 Evidence Requested</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap align-top">
                        {getRiskBadge(result.riskLevel)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap align-top">
                        {getDecisionBadge(getDecision(result.riskLevel))}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportViewer;

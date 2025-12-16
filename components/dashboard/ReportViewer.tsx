import React, { useState, useMemo, useEffect } from 'react';
import { AuditReport, AnalysisResult, Decision } from '../../types';
import { 
  TriangleAlert, 
  CircleCheck, 
  CircleHelp, 
  OctagonAlert, 
  Download, 
  Printer, 
  CircleX, 
  CircleMinus,
  Info,
  ArrowUpDown,
  Search,
  Filter,
  Check,
  Moon,
  Sun
} from 'lucide-react';
import Button from '../Button';

interface ReportViewerProps {
  report: AuditReport;
  onBack: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

type SortKey = 'riskLevel' | 'decision';
type SortDirection = 'asc' | 'desc';

const ReportViewer: React.FC<ReportViewerProps> = ({ report, onBack, isDarkMode, onToggleTheme }) => {
  // Filter & Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    High: true,
    Medium: true,
    Low: true,
    Pass: true
  });

  // Sort State
  const [sortConfig, setSortConfig] = useState<{ key: SortKey | null; direction: SortDirection }>({
    key: null,
    direction: 'asc'
  });

  // Tooltip State
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);

  // --- Helpers ---

  const getRiskBadge = (risk: AnalysisResult['riskLevel']) => {
    switch(risk) {
      case 'High': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"><OctagonAlert size={12} className="mr-1"/> High Risk</span>;
      case 'Medium': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"><TriangleAlert size={12} className="mr-1"/> Medium Risk</span>;
      case 'Low': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"><CircleHelp size={12} className="mr-1"/> Low Risk</span>;
      case 'Pass': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"><CircleCheck size={12} className="mr-1"/> Low Risk</span>;
      default: return null;
    }
  };

  const getDecision = (risk: AnalysisResult['riskLevel']): Decision => {
    if (risk === 'High') return 'UNACCEPTABLE';
    if (risk === 'Pass') return 'ACCEPTED';
    return 'CONSIDER'; // Medium or Low
  };

  const getDecisionBadge = (decision: Decision) => {
    switch(decision) {
      case 'UNACCEPTABLE': return <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-bold bg-red-600 text-white shadow-sm dark:bg-red-700"><CircleX size={14} className="mr-1.5"/> UNACCEPTABLE</span>;
      case 'ACCEPTED': return <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-bold bg-green-600 text-white shadow-sm dark:bg-green-700"><CircleCheck size={14} className="mr-1.5"/> ACCEPTED</span>;
      case 'CONSIDER': return <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-bold bg-amber-500 text-white shadow-sm dark:bg-amber-600"><CircleMinus size={14} className="mr-1.5"/> CONSIDER</span>;
    }
  };

  // --- Sorting & Filtering Logic ---

  const toggleFilter = (level: keyof typeof filters) => {
    setFilters(prev => ({ ...prev, [level]: !prev[level] }));
  };

  const handleSort = (key: SortKey) => {
    let direction: SortDirection = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const processedRows = useMemo(() => {
    let rows = [...report.rows];

    // 1. Search (Guardrails: simple string matching, no regex execution)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      rows = rows.filter(row => 
        row.question.toLowerCase().includes(term) ||
        row.answer.toLowerCase().includes(term) ||
        (row.category || '').toLowerCase().includes(term)
      );
    }

    // 2. Filter by Risk Level
    rows = rows.filter(row => {
      const risk = report.results[row.id]?.riskLevel;
      return risk && filters[risk as keyof typeof filters];
    });

    // 3. Sort
    if (sortConfig.key) {
      rows.sort((a, b) => {
        const resA = report.results[a.id];
        const resB = report.results[b.id];
        if (!resA || !resB) return 0;

        let valA = 0;
        let valB = 0;

        if (sortConfig.key === 'riskLevel') {
          // High > Medium > Low > Pass
          const map = { High: 3, Medium: 2, Low: 1, Pass: 0 };
          valA = map[resA.riskLevel];
          valB = map[resB.riskLevel];
        } else if (sortConfig.key === 'decision') {
           // Fail > Consider > Pass
           const decA = getDecision(resA.riskLevel);
           const decB = getDecision(resB.riskLevel);
           const map = { UNACCEPTABLE: 2, CONSIDER: 1, ACCEPTED: 0 };
           valA = map[decA];
           valB = map[decB];
        }

        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return rows;
  }, [report, searchTerm, filters, sortConfig]);

  // --- Handlers ---

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
            // Export the raw risk level string ('Pass') or the display string ('Low Risk')? 
            // Usually exports prefer raw data, but let's map it to match UI request.
            const displayRisk = result.riskLevel === 'Pass' ? 'Low Risk' : result.riskLevel;
            
            csvRows.push([
                safe(row.id),
                safe(row.question),
                safe(row.answer),
                safe(row.category),
                safe(displayRisk),
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

  // --- Render Helpers ---

  const MetricCard = ({ title, value, colorClass, tooltipKey }: { title: string, value: string | number | React.ReactNode, colorClass: string, tooltipKey: string }) => (
    <div 
      className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm print:border-gray-300 print:shadow-none break-inside-avoid relative"
      onMouseEnter={() => setHoveredMetric(tooltipKey)}
      onMouseLeave={() => setHoveredMetric(null)}
    >
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <Info size={14} className="text-gray-400 hover:text-primary cursor-help" />
      </div>
      <div className={`text-3xl font-bold ${colorClass}`}>
        {value}
      </div>
      
      {/* Tooltip Overlay */}
      {hoveredMetric === tooltipKey && (
         <div className="absolute z-20 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-3 bg-neutralDark text-white text-xs rounded-lg shadow-xl pointer-events-none animate-fade-in-up">
           {tooltipKey === 'score' && "Weighted calculation based on critical and high risks found."}
           {tooltipKey === 'critical' && "Issues that pose an immediate threat to data security."}
           {tooltipKey === 'warnings' && "Medium or Low risks that should be remediated."}
           {tooltipKey === 'pass' && "Percentage of controls that met the security standard."}
           <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-neutralDark"></div>
         </div>
      )}
    </div>
  );

  return (
    <div className={`space-y-6 animate-fade-in-up print:space-y-4 ${isDarkMode ? 'dark' : ''}`}>
      {/* Header Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button onClick={onBack} className="text-sm text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary mb-1 no-print">← Back</button>
          <h2 className="text-2xl font-bold text-neutralDark dark:text-white flex items-center">
            {report.fileName}
            <span className="ml-4 text-sm font-normal text-gray-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 px-2 py-1 rounded print:border print:border-gray-300">
              {report.uploadDate.toLocaleDateString()}
            </span>
          </h2>
        </div>
        <div className="flex space-x-3 no-print items-center">
          <Button onClick={handleExportCSV} variant="secondary" size="sm" className="flex items-center dark:bg-gray-700 dark:text-white dark:border-gray-600">
            <Download size={16} className="mr-2" /> Export CSV
          </Button>
          <Button onClick={handleExportPDF} variant="secondary" size="sm" className="flex items-center dark:bg-gray-700 dark:text-white dark:border-gray-600">
            <Printer size={16} className="mr-2" /> Print / Save PDF
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 print:grid-cols-4">
        <MetricCard 
          title="Security Score" 
          value={`${report.summary.score}/100`}
          colorClass={report.summary.score > 80 ? 'text-green-600 dark:text-green-400' : report.summary.score > 60 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}
          tooltipKey="score"
        />
        <MetricCard 
          title="Critical Risks" 
          value={report.summary.highRisk}
          colorClass="text-red-600 dark:text-red-400"
          tooltipKey="critical"
        />
        <MetricCard 
          title="Warnings" 
          value={report.summary.mediumRisk + report.summary.lowRisk}
          colorClass="text-orange-500 dark:text-orange-400"
          tooltipKey="warnings"
        />
        <MetricCard 
          title="Pass Rate" 
          value={`${Math.round((report.summary.pass / report.summary.total) * 100)}%`}
          colorClass="text-success dark:text-green-400"
          tooltipKey="pass"
        />
      </div>

      {/* Detail Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden print:border-0 print:shadow-none min-h-[500px]">
        
        {/* Table Controls (Search & Filter) */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search questions, answers, categories..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="relative">
             <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center px-4 py-2 text-sm font-medium border rounded-lg transition-colors ${
                  isFilterOpen || Object.values(filters).some(v => !v) 
                  ? 'bg-primary/10 text-primary border-primary' 
                  : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
             >
               <Filter size={16} className="mr-2" />
               Filter
             </button>
             
             {isFilterOpen && (
               <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 p-2 animate-fade-in-up">
                 <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-2 py-1 uppercase mb-1">Show Risk Levels</div>
                 {(['High', 'Medium', 'Low', 'Pass'] as const).map((level) => (
                    <label 
                        key={level} 
                        className="flex items-center px-2 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer"
                        onClick={(e) => {
                            e.preventDefault();
                            toggleFilter(level);
                        }}
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center mr-3 ${
                        filters[level] ? 'bg-primary border-primary' : 'border-gray-300 dark:border-gray-500'
                      }`}>
                        {filters[level] && <Check size={12} className="text-white" />}
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-200">
                          {level === 'Pass' ? 'Low Risk (Pass)' : level}
                      </span>
                    </label>
                 ))}
               </div>
             )}
          </div>
        </div>

        <div className="overflow-x-auto print:overflow-visible">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 print:divide-gray-300">
            <thead className="bg-gray-50 dark:bg-gray-900 print:bg-gray-100">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-12">#</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[28%]">Question</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[20%]">Supplier Answer</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[25%]">AI Assessment</th>
                <th 
                  scope="col" 
                  onClick={() => handleSort('riskLevel')}
                  className="px-6 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group select-none"
                >
                  <div className="flex items-center">
                    Risk Level
                    <ArrowUpDown size={12} className={`ml-1 ${sortConfig.key === 'riskLevel' ? 'text-primary' : 'text-gray-300'}`} />
                  </div>
                </th>
                <th 
                  scope="col" 
                  onClick={() => handleSort('decision')}
                  className="px-6 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group select-none"
                >
                   <div className="flex items-center">
                    Decision
                    <ArrowUpDown size={12} className={`ml-1 ${sortConfig.key === 'decision' ? 'text-primary' : 'text-gray-300'}`} />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 print:divide-gray-300">
              {processedRows.length === 0 ? (
                 <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400 italic">
                      No rows found matching your criteria.
                    </td>
                 </tr>
              ) : (
                processedRows.map((row, index) => {
                  const result = report.results[row.id];
                  if (!result) return null;

                  return (
                    <tr key={row.id} className="break-inside-avoid border-b border-gray-100 dark:border-gray-700 print:border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 font-mono align-top">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium align-top">
                        {row.question}
                        <div className="text-xs text-gray-400 mt-1">{row.category}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 align-top italic">
                        "{row.answer}"
                      </td>
                      <td className="px-6 py-4 text-sm align-top">
                        <p className="text-gray-800 dark:text-gray-200 mb-1">{result.feedback}</p>
                        {result.complianceFlag && (
                          <span className="text-xs font-semibold text-red-600 dark:text-red-400 block mt-1">🚩 {result.complianceFlag}</span>
                        )}
                        {result.evidenceRequired && (
                          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 block mt-1">📎 Evidence Requested</span>
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
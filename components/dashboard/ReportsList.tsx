import React, { useState, useMemo } from 'react';
import { AuditReport, ReviewSet } from '../../types';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  ChevronUp, 
  ChevronDown, 
  FileText, 
  Calendar, 
  TriangleAlert, 
  CircleCheck, 
  FolderOpen 
} from 'lucide-react';
import Button from '../Button';

interface ReportsListProps {
  reports: AuditReport[];
  reviewSets: ReviewSet[];
  onViewReport: (report: AuditReport) => void;
}

type SortField = 'fileName' | 'uploadDate' | 'score' | 'reviewSet';
type SortDirection = 'asc' | 'desc';

const ReportsList: React.FC<ReportsListProps> = ({ reports, reviewSets, onViewReport }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSetFilter, setSelectedSetFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('uploadDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Helper to find which set a report belongs to
  const getReviewSetName = (reportId: string): { name: string; id: string } | null => {
    const foundSet = reviewSets.find(set => set.reports.some(r => r.id === reportId));
    return foundSet ? { name: foundSet.name, id: foundSet.id } : null;
  };

  // Handle Sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc'); // Default to asc for new field, though dates usually better desc
    }
  };

  // Filter and Sort Logic
  const processedReports = useMemo(() => {
    let result = [...reports];

    // 1. Filter by Text
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(r => 
        r.fileName.toLowerCase().includes(lowerTerm) || 
        r.id.toLowerCase().includes(lowerTerm)
      );
    }

    // 2. Filter by Review Set
    if (selectedSetFilter !== 'all') {
      result = result.filter(r => {
        const set = getReviewSetName(r.id);
        return set?.id === selectedSetFilter;
      });
    }

    // 3. Sort
    result.sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'fileName':
          comparison = a.fileName.localeCompare(b.fileName);
          break;
        case 'score':
          comparison = a.summary.score - b.summary.score;
          break;
        case 'uploadDate':
          comparison = a.uploadDate.getTime() - b.uploadDate.getTime();
          break;
        case 'reviewSet':
          const setA = getReviewSetName(a.id)?.name || 'ZZZ'; // Put unassigned last
          const setB = getReviewSetName(b.id)?.name || 'ZZZ';
          comparison = setA.localeCompare(setB);
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [reports, searchTerm, selectedSetFilter, sortField, sortDirection, reviewSets]);

  // Render Sort Icon
  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown size={14} className="text-gray-300 ml-1" />;
    return sortDirection === 'asc' 
      ? <ChevronUp size={14} className="text-primary ml-1" />
      : <ChevronDown size={14} className="text-primary ml-1" />;
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutralDark">All Reports</h2>
          <p className="text-gray-500 mt-1">Searchable archive of all individual vendor assessments.</p>
        </div>
        
        {/* Filters Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none w-full sm:w-64"
            />
          </div>
          
          <div className="relative">
             <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
             <select
               value={selectedSetFilter}
               onChange={(e) => setSelectedSetFilter(e.target.value)}
               className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none appearance-none bg-white w-full sm:w-auto cursor-pointer"
             >
               <option value="all">All Review Sets</option>
               {reviewSets.map(set => (
                 <option key={set.id} value={set.id}>{set.name}</option>
               ))}
             </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  onClick={() => handleSort('fileName')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none group"
                >
                  <div className="flex items-center">
                    Report Name
                    <SortIcon field="fileName" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('reviewSet')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none group"
                >
                  <div className="flex items-center">
                    Review Set / Context
                    <SortIcon field="reviewSet" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('uploadDate')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none group"
                >
                  <div className="flex items-center">
                    Date
                    <SortIcon field="uploadDate" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('score')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none group"
                >
                  <div className="flex items-center">
                    Score
                    <SortIcon field="score" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risks
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {processedReports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No reports match your filters.
                  </td>
                </tr>
              ) : (
                processedReports.map((report) => {
                  const reviewSet = getReviewSetName(report.id);
                  
                  return (
                    <tr 
                      key={report.id} 
                      onClick={() => onViewReport(report)}
                      className="hover:bg-blue-50/50 transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <FileText size={20} />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-neutralDark group-hover:text-primary transition-colors">{report.fileName}</div>
                            <div className="text-xs text-gray-500">ID: {report.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                         {reviewSet ? (
                           <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                             <FolderOpen size={12} className="mr-1.5" />
                             {reviewSet.name.length > 25 ? reviewSet.name.substring(0, 25) + '...' : reviewSet.name}
                           </span>
                         ) : (
                           <span className="text-xs text-gray-400 italic">Unassigned</span>
                         )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar size={14} className="mr-1.5" />
                          {report.uploadDate.toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          report.summary.score > 80 ? 'bg-green-100 text-green-800' : 
                          report.summary.score > 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {report.summary.score}/100
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-3">
                          {report.summary.highRisk > 0 && (
                            <span className="text-red-600 flex items-center font-medium" title="High Risk">
                              <TriangleAlert size={14} className="mr-1" /> {report.summary.highRisk}
                            </span>
                          )}
                          <span className="text-success flex items-center" title="Pass">
                            <CircleCheck size={14} className="mr-1" /> {report.summary.pass}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          // The row click handles navigation, but we keep the button visual
                          className="text-gray-400 hover:text-primary"
                        >
                          Details
                        </Button>
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

export default ReportsList;
import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { FileText, Download, Calendar, BarChart3, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import Sidebar from './components/Sidebar';

const AdminReports = () => {
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    fetchReports();
    
    // Set up real-time polling every 60 seconds (reports don't change as frequently)
    const interval = setInterval(fetchReports, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      // Get available reports from API
      const response = await adminAPI.getRevenueReport();
      setReports([
        {
          id: 1,
          title: 'Revenue Report',
          description: 'Complete revenue breakdown by shop and category',
          icon: BarChart3,
          color: 'bg-green-100 text-green-600',
          data: response.data,
        },
        {
          id: 2,
          title: 'User Activity Report',
          description: 'User registration, login, and activity metrics',
          icon: FileText,
          color: 'bg-blue-100 text-blue-600',
        },
        {
          id: 3,
          title: 'Order Analytics',
          description: 'Order statistics and trends analysis',
          icon: BarChart3,
          color: 'bg-purple-100 text-purple-600',
        },
        {
          id: 4,
          title: 'Subscription Report',
          description: 'Subscription metrics and customer retention',
          icon: FileText,
          color: 'bg-orange-100 text-orange-600',
        },
      ]);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async (reportId, reportTitle) => {
    setDownloading(reportId);
    try {
      let response;
      switch (reportId) {
        case 1:
          response = await adminAPI.getRevenueReport({ startDate: dateRange.start, endDate: dateRange.end });
          break;
        case 2:
          response = await adminAPI.getUserAnalytics({ startDate: dateRange.start, endDate: dateRange.end });
          break;
        case 3:
          response = await adminAPI.getOrderAnalytics({ startDate: dateRange.start, endDate: dateRange.end });
          break;
        case 4:
          response = await adminAPI.getSalesAnalytics({ startDate: dateRange.start, endDate: dateRange.end });
          break;
        default:
          throw new Error('Unknown report type');
      }

      // Create and download CSV
      const csvContent = generateCSV(response.data.data || response.data, reportTitle);
      downloadCSV(csvContent, `${reportTitle.replace(/\s+/g, '_').toLowerCase()}.csv`);
      
      toast.success(`${reportTitle} downloaded successfully`);
    } catch (error) {
      console.error('Error downloading report:', error);
      toast.error('Failed to download report');
    } finally {
      setDownloading(null);
    }
  };

  const generateCSV = (data, title) => {
    if (!data || !Array.isArray(data)) return '';

    const headers = Object.keys(data[0] || {});
    const csvRows = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
        }).join(',')
      )
    ];
    
    return csvRows.join('\n');
  };

  const downloadCSV = (content, filename) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar activeTab="reports" setActiveTab={() => {}} />

      <div className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports</h1>
          <p className="text-gray-500 mt-1">Generate and download business reports</p>
        </div>

        {/* Date Range Filter */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-md mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Report Period</h2>
          <div className="flex gap-4 flex-wrap">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">Start Date</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">End Date</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Available Reports */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => {
            const Icon = report.icon;
            return (
              <div key={report.id} className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 hover:shadow-lg transition">
                <div className={`w-12 h-12 rounded-lg ${report.color} flex items-center justify-center mb-4`}>
                  <Icon size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{report.title}</h3>
                <p className="text-gray-500 text-sm mb-4">{report.description}</p>
                <button
                  onClick={() => handleDownloadReport(report.title)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#FF6B35] text-white rounded-lg hover:bg-[#FF8C42] transition font-medium"
                >
                  <Download size={16} />
                  Download Report
                </button>
              </div>
            );
          })}
        </div>

        {/* Report History */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md mt-8 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Downloads</h2>
          </div>
          <table className="w-full">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Report Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Date Generated</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Format</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Revenue Report - January 2024', date: '2024-01-31', format: 'PDF' },
                { name: 'User Activity Report - January 2024', date: '2024-01-30', format: 'CSV' },
                { name: 'Order Analytics - January 2024', date: '2024-01-29', format: 'PDF' },
              ].map((item, idx) => (
                <tr key={idx} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 font-medium">{item.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{item.date}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {item.format}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="flex items-center gap-2 text-[#FF6B35] hover:text-[#FF8C42] font-medium">
                      <Download size={16} />
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;

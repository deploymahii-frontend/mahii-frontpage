import React, { useState, useEffect } from 'react';
import { attendanceAPI } from '../../services/api';
import { Users, Clock, CheckCircle, AlertCircle, QrCode, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const StudentAttendanceList = ({ shopId }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchStudentAttendance();
  }, [shopId, selectedDate]);

  const fetchStudentAttendance = async () => {
    try {
      setLoading(true);
      const response = await attendanceAPI.getAttendanceByDate({
        shopId,
        startDate: selectedDate,
        endDate: selectedDate,
      });

      if (response.data.success) {
        // Group attendance by student
        const studentMap = {};
        response.data.attendance.forEach(record => {
          const studentId = record.userId._id;
          if (!studentMap[studentId]) {
            studentMap[studentId] = {
              id: studentId,
              name: record.userId.name,
              attendance: { breakfast: null, lunch: null, dinner: null },
            };
          }
          studentMap[studentId].attendance[record.mealType] = record;
        });

        setStudents(Object.values(studentMap));
      }
    } catch (error) {
      console.error('Error fetching student attendance:', error);
      toast.error('Failed to load student attendance');
    } finally {
      setLoading(false);
    }
  };

  const markManualAttendance = async (studentId, mealType) => {
    try {
      const response = await attendanceAPI.scanAttendance({
        subscriptionId: 'manual', // This would need to be the actual subscription ID
        mealType,
        studentId,
      });

      if (response.data.success) {
        toast.success(`Attendance marked for ${mealType}`);
        fetchStudentAttendance(); // Refresh the list
      }
    } catch (error) {
      toast.error('Failed to mark attendance');
    }
  };

  const getAttendanceStatus = (attendance, mealType) => {
    if (!attendance) return 'absent';

    const record = attendance[mealType];
    if (!record) return 'absent';

    return record.status === 'present' ? 'present' : 'absent';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="text-green-500" size={16} />;
      case 'absent':
        return <AlertCircle className="text-red-500" size={16} />;
      default:
        return <Clock className="text-gray-400" size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Student Attendance</h3>
          <div className="w-32 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div>
                    <div className="w-24 h-4 bg-gray-200 rounded mb-1"></div>
                    <div className="w-16 h-3 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-16 h-8 bg-gray-200 rounded"></div>
                  <div className="w-16 h-8 bg-gray-200 rounded"></div>
                  <div className="w-16 h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Student Attendance</h3>
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Users className="text-blue-500" size={20} />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Students</span>
          </div>
          <p className="text-2xl font-bold text-blue-800 dark:text-blue-200 mt-1">{students.length}</p>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="text-green-500" size={20} />
            <span className="text-sm font-medium text-green-700 dark:text-green-300">Present Today</span>
          </div>
          <p className="text-2xl font-bold text-green-800 dark:text-green-200 mt-1">
            {students.filter(s => Object.values(s.attendance).some(a => a?.status === 'present')).length}
          </p>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Clock className="text-orange-500" size={20} />
            <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Pending</span>
          </div>
          <p className="text-2xl font-bold text-orange-800 dark:text-orange-200 mt-1">
            {students.filter(s => Object.values(s.attendance).every(a => !a)).length}
          </p>
        </div>
      </div>

      {/* Student List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Breakfast
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Lunch
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Dinner
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {student.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Student ID: {student.id.slice(-6)}
                        </div>
                      </div>
                    </div>
                  </td>

                  {['breakfast', 'lunch', 'dinner'].map((mealType) => {
                    const status = getAttendanceStatus(student.attendance, mealType);
                    return (
                      <td key={mealType} className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                          {getStatusIcon(status)}
                          {status === 'present' ? 'Present' : status === 'absent' ? 'Absent' : 'Pending'}
                        </span>
                      </td>
                    );
                  })}

                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex gap-1 justify-center">
                      {['breakfast', 'lunch', 'dinner'].map((mealType) => {
                        const status = getAttendanceStatus(student.attendance, mealType);
                        return status !== 'present' ? (
                          <button
                            key={mealType}
                            onClick={() => markManualAttendance(student.id, mealType)}
                            className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 transition-colors"
                            title={`Mark ${mealType} attendance`}
                          >
                            {mealType[0].toUpperCase()}
                          </button>
                        ) : null;
                      })}
                      <button
                        className="p-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
                        title="Generate QR"
                      >
                        <QrCode size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <Users size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm ? 'No students found matching your search' : 'No students found for this date'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAttendanceList;
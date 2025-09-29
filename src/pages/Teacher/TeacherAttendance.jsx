// pages/Attendance.jsx
import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import api from "../../utils/api";

function Attendance() {
  const now = new Date();
  const date = now.getDate();
  const month = now.toLocaleString("default", { month: "long" });
  const day = now.toLocaleString("default", { weekday: "long" });
  const year = now.getFullYear();
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [saving, setSaving] = useState(false);
  const [classFilter, setClassFilter] = useState("SE");
  const [divFilter, setDivFilter] = useState("A");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedTimetable, setSelectedTimetable] = useState(null);
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    fetchStudentsAndSchedule();
  }, [classFilter, divFilter]);

  useEffect(() => {
    if (selectedSubject && selectedTimetable) {
      fetchAttendanceData();
    }
  }, [selectedSubject, selectedTimetable]);

  const fetchStudentsAndSchedule = async () => {
    try {
      const response = await api.get(`/teacher/students?class_name=${classFilter}&div=${divFilter}`);
      if (response.data.success) {
        console.log('Students and schedule response:', response.data.data);
        setStudents(response.data.data.students);
        setTodaySchedule(response.data.data.todaySchedule);
        
        // Auto-select first available lecture if available
        if (response.data.data.todaySchedule.length > 0) {
          const firstLecture = response.data.data.todaySchedule[0];
          console.log('Auto-selecting first lecture:', firstLecture);
          setSelectedSubject(firstLecture.subject_id);
          setSelectedTimetable(firstLecture.timetable_id);
        } else {
          console.log('No lectures found for today');
        }
      }
    } catch (error) {
      console.error('Error fetching students and schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceData = async () => {
    if (!selectedSubject || !selectedTimetable) return;
    
    try {
      const response = await api.get(
        `/teacher/attendance-data?attendance_date=${today}&class_name=${classFilter}&div=${divFilter}&subject_id=${selectedSubject}&timetable_id=${selectedTimetable}`
      );
      if (response.data.success) {
        const attendanceMap = {};
        let submitted = false;
        response.data.data.forEach(record => {
          if (record.student_rollno) {
            attendanceMap[record.student_rollno] = {
              status: record.status || 'Present',
              submitted: record.submitted || false
            };
            if (record.submitted) submitted = true;
          }
        });
        setAttendanceData(attendanceMap);
        setIsSubmitted(submitted);
      }
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    }
  };

  const markAttendance = async (studentRollno, status) => {
    if (isSubmitted) {
      alert('Attendance has already been submitted and cannot be changed.');
      return;
    }

    if (!selectedSubject || !selectedTimetable) {
      alert('Please select a lecture first');
      return;
    }

    console.log('Marking attendance with:', {
      student_rollno: studentRollno,
      subject_id: selectedSubject,
      timetable_id: selectedTimetable,
      status: status,
      attendance_date: today
    });

    try {
      const response = await api.post('/teacher/attendance', {
        student_rollno: studentRollno,
        subject_id: selectedSubject,
        timetable_id: selectedTimetable,
        status: status,
        attendance_date: today
      });

      if (response.data.success) {
        setAttendanceData(prev => ({
          ...prev,
          [studentRollno]: { ...prev[studentRollno], status }
        }));
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
      alert('Failed to mark attendance');
    }
  };

  const saveAllAttendance = async () => {
    if (isSubmitted) {
      alert('Attendance has already been submitted.');
      return;
    }

    setSaving(true);
    try {
      const response = await api.post('/teacher/submit', {
        subject_id: selectedSubject,
        timetable_id: selectedTimetable,
        attendance_date: today
      });

      if (response.data.success) {
        setIsSubmitted(true);
        alert('Attendance submitted successfully!');
      }
    } catch (error) {
      console.error('Error submitting attendance:', error);
      alert('Failed to submit attendance');
    } finally {
      setSaving(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Present":
        return "bg-green-500 border-green-600 text-white font-semibold";
      case "Late":
        return "bg-yellow-500 border-yellow-600 text-white font-semibold";
      case "Absent":
        return "bg-red-500 border-red-600 text-white font-semibold";
      default:
        return "bg-white border-gray-300 text-black";
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.student_rollno.toString().includes(searchTerm)
  );

  const presentCount = Object.values(attendanceData).filter(a => a.status === 'Present').length;
  const absentCount = Object.values(attendanceData).filter(a => a.status === 'Absent').length;
  const lateCount = Object.values(attendanceData).filter(a => a.status === 'Late').length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading attendance...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-100">
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex flex-col md:flex-row">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Main Content */}
        <div className="flex-1 mt-8 px-4 md:ml-8 md:mr-8 space-y-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-2xl lg:text-3xl font-bold text-black">
                  Daily Attendance {isSubmitted && <span className="text-green-600">(Submitted)</span>}
                </h1>
                <p className="text-gray-600 text-base sm:text-lg">
                  {day}, {month} {date}, {year}
                </p>
              </div>

              {/* Subject Selection */}
              {todaySchedule.length > 0 && (
                <div className="flex flex-col gap-2 mb-4">
                  <label className="text-sm font-medium text-gray-700">Select Lecture:</label>
                  <select 
                    value={selectedTimetable || ''}
                    onChange={(e) => {
                      const timetableId = parseInt(e.target.value);
                      const lecture = todaySchedule.find(l => l.timetable_id === timetableId);
                      if (lecture) {
                        setSelectedTimetable(timetableId);
                        setSelectedSubject(lecture.subject_id);
                      }
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-md"
                  >
                    <option value="">Select a lecture</option>
                    {todaySchedule.map(lecture => (
                      <option key={lecture.timetable_id} value={lecture.timetable_id}>
                        Lecture {lecture.lecture_no} - {lecture.subject_name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
                <div className="flex gap-2">
                  <span className="text-green-600 font-medium">Present: {presentCount}</span>
                  <span className="text-red-600 font-medium">Absent: {absentCount}</span>
                  <span className="text-yellow-600 font-medium">Late: {lateCount}</span>
                </div>
                <p className="text-gray-700 font-medium text-base sm:text-lg">
                  Total {filteredStudents.length} 
                </p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 lg:gap-3 w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="Search by name or roll number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-3 sm:px-4 py-2 border border-gray-300 w-full sm:w-[300px] lg:w-[350px] lg:h-[40px] rounded-lg lg:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base sm:text-lg lg:border-2 lg:border-blue-300"
                  />
                  <button 
                    onClick={saveAllAttendance}
                    disabled={saving || isSubmitted}
                    className="bg-blue-600 flex items-center justify-center text-white px-4 sm:px-6 lg:px-8 py-2 lg:py-2.5 rounded-lg lg:rounded-xl hover:bg-blue-700 transition-colors active:scale-95 duration-200 cursor-pointer text-base sm:text-lg w-full sm:w-auto lg:h-[40px] lg:font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Saving...' : isSubmitted ? 'Submitted' : 'Save '}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* No Lecture Selected Message */}
          {(!selectedSubject || !selectedTimetable) && (
            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-yellow-800 mb-2">No Lecture Selected</h3>
              <p className="text-yellow-700">
                {todaySchedule.length === 0 
                  ? "You don't have any lectures scheduled for today." 
                  : "Please select a lecture from the dropdown above to mark attendance."
                }
              </p>
            </div>
          )}

          {/* Table */}
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
            <div className="overflow-x-auto lg:overflow-y-auto lg:max-h-96">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700 text-base sm:text-lg">
                      Roll No.
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 text-base sm:text-lg">
                      Student Name
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 text-base sm:text-lg">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 text-base sm:text-lg">
                      Actions
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 text-base sm:text-lg hidden lg:table-cell">
                      Class
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => {
                    const attendance = attendanceData[student.student_rollno] || { status: 'Present' };
                    return (
                      <tr key={student.student_rollno} className="border-b border-gray-100">
                        <td className="py-3 px-4 text-base sm:text-lg">{student.student_rollno}</td>
                        <td className="py-3 px-4 text-base sm:text-lg">{student.name}</td>
                        <td className="py-3 px-4">
                          <div
                            className={`w-16 sm:w-20 h-6 sm:h-8 text-sm sm:text-lg rounded border flex items-center justify-center ${getStatusStyle(attendance.status)}`}
                          >
                            {attendance.status}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-col gap-1 sm:flex-row sm:gap-2">
                            {["Present", "Late", "Absent"].map((type) => (
                              <button
                                key={type}
                                onClick={() => markAttendance(student.student_rollno, type)}
                                disabled={isSubmitted}
                                className={`px-2 sm:px-3 py-1 text-white text-xs sm:text-base lg:text-lg rounded active:scale-95 duration-70 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                                  type === "Present" ? "bg-green-300 hover:bg-green-700" : type === "Late" ? "bg-yellow-300 hover:bg-yellow-700" : "bg-red-300 hover:bg-red-700"
                                }`}
                              >
                                {type}
                              </button>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4 hidden lg:table-cell text-base sm:text-lg">
                          {student.class} {student.div}
                        </td>
                      </tr>
                    );
                  })}
                  
                  {filteredStudents.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center py-8 text-gray-500">
                        No students found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Attendance;

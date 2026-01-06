import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';

function TeacherTimetable() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [timetableData, setTimetableData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = [
    { lecture: 1, time: '9:30-10:30' },
    { lecture: 2, time: '10:30-11:30' },
    { lecture: 3, time: '11:30-12:30' },
    { lecture: 4, time: '12:30-1:00' },
    { lecture: 5, time: '1:00-2:00' },
    { lecture: 6, time: '2:00-3:00' },
    { lecture: 7, time: '3:00-4:00' },
    
  ];

  useEffect(() => {
    fetchTimetable();
  }, []);

  const fetchTimetable = async () => {
    try {
      const response = await api.get('/timetable/teacher/weekly-timetable');
      if (response.data.success) {
        const transformedData = {
          timetable: response.data.timetable,
          timeSlots: response.data.timeSlots
        };
        setTimetableData(transformedData);
      }
    } catch (error) {
      console.error('Error fetching timetable:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSubjectForSlot = (day, lectureNo) => {
    if (!timetableData?.timetable[day]) return null;
    const slot = timetableData.timetable[day][lectureNo];
    if (!slot) return null;
    
    return {
      subject_name: slot.subject,
      class_name: slot.class,
      type: slot.type,
      batch: slot.batch,
      time: slot.time
    };
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-xl">Loading timetable...</div>
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
                  My Weekly Timetable
                </h1>
                <p className="text-gray-600 text-base sm:text-lg">
                  {user?.name} | {user?.designation}
                </p>
              </div>
            </div>
          </div>

          {/* Timetable Grid */}
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="border border-gray-300 p-3 text-center font-semibold">
                      Time/Day
                    </th>
                    {timeSlots.map((slot) => (
                      <th key={slot.lecture} className="border border-gray-300 p-3 text-center font-semibold">
                        <div className="text-sm">Lecture {slot.lecture}</div>
                        <div className="text-xs text-gray-600">{slot.time}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {days.map((day) => (
                    <tr key={day} className="hover:bg-gray-50">
                      <td className="border border-gray-300 p-3 font-semibold bg-blue-50 text-center">
                        {day}
                      </td>
                      {timeSlots.map((slot) => {
                        const subject = getSubjectForSlot(day, slot.lecture);
                        const isBreak = slot.lecture === 4  // Break after 3rd lecture except Friday
                        
                        if (isBreak && !subject) {
                          return (
                            <td key={slot.lecture} className="border border-gray-300 p-3 text-center bg-yellow-50">
                              <div className="text-sm font-medium text-gray-600">Break</div>
                            </td>
                          );
                        }
                        
                        return (
                         <td
                          key={slot.lecture}
                             className={`border p-2 text-center ${
                                  subject
                                  ? subject.type === 'PRACTICAL' || subject.type === 'PRACT'
                                    ? 'bg-blue-50 border-blue-300'
                                    : 'bg-green-50 border-green-300'
                                  : 'bg-gray-50 border-gray-300'
                              }`}
>
                            {subject ? (
                              <div className="text-xs">
                               <div
                               className={`font-semibold ${
                                   subject.type === 'PRACTICAL' || subject.type === 'PRACT'
                                   ? 'text-blue-800'
                                   : 'text-green-800'
                               }`}
                               >
                             {subject.subject_name}
                                </div>

                              <div
                        className={`${
                    subject.type === 'PRACTICAL' || subject.type === 'PRACT'
                      ? 'text-blue-600'
                      : 'text-green-600'
                               }`}
                               >
                               {subject.class_name} {subject.batch ? `(${subject.batch})` : ''}
                               </div>

                              <div
                                className={`mt-1 inline-block px-2 py-1 rounded-full text-xs ${
                                  subject.type === 'PRACTICAL' || subject.type === 'PRACT'
                                    ? 'bg-blue-200 text-blue-800'
                                    : 'bg-green-200 text-green-800'
                                }`}
                              >
                                      {subject.type}
                                </div>

                              </div>
                            ) : (
                              <div className="text-gray-400">Free</div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Legend */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-lg mb-3">Info</h3>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-50 border border-green-300 rounded"></div>
                <span className="text-sm">Lectures</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-50 border border-blue-300 rounded"></div>
                <span className="text-sm">Practical</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-50 border border-gray-300 rounded"></div>
                <span className="text-sm">Break Time</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-50 border border-gray-300 rounded"></div>
                <span className="text-sm">Free Period</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherTimetable;
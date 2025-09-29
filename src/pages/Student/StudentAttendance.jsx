import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import StudentSidebar from '../../components/StudentSidebar';
import api from '../../utils/api';

function StudentAttendance() {
  const [activeBtn, setActiveBtn] = useState('Overall');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [attendanceData, setAttendanceData] = useState({
    overall: null,
    monthly: [],
    subjectWise: [],
    monthlySubjectWise: []
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchAllAttendanceData();
  }, []);
  
  const fetchAllAttendanceData = async () => {
    try {
      const [overallRes, monthlyRes, subjectWiseRes] = await Promise.all([
        api.get('/student/attendance/overall'),
        api.get('/student/attendance/monthly'),
        api.get('/student/attendance/subject-wise')
      ]);
      
      setAttendanceData({
        overall: overallRes.data.success ? overallRes.data.data : null,
        monthly: monthlyRes.data.success ? monthlyRes.data.data : [],
        subjectWise: subjectWiseRes.data.success ? subjectWiseRes.data.data : [],
        monthlySubjectWise: []
      });
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const changecolor = (btn) => activeBtn === btn ? "border-2 border-black text-black bg-white" : "bg-white text-gray-600";
  
  const getAttendanceStatus = (percentage) => {
    if (percentage >= 85) return { label: 'Excellent', color: 'bg-green-600' };
    if (percentage >= 75) return { label: 'Good', color: 'bg-blue-600' };
    if (percentage >= 65) return { label: 'Average', color: 'bg-yellow-600' };
    return { label: 'Poor', color: 'bg-red-600' };
  };
  
  const renderOverallView = () => {
    const overall = attendanceData.overall;
    if (!overall) return <div>No attendance data available</div>;
    
    const status = getAttendanceStatus(overall.attendance_percentage || 0);
    
    return (
      <div className="bg-white rounded-2xl p-5 shadow-lg mt-4">
        <div className='mb-5'>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-black">Overall Attendance</h2>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Classes</p>
              <p className="text-xl font-semibold text-black">{overall.total_classes || 0}</p>
            </div>
          </div>
          <p className='text-lg text-gray-600'>Your complete attendance summary</p>
        </div>

        <div className="mb-5 justify-between flex">
          <span className="text-3xl font-bold text-green-600">{overall.attendance_percentage || 0}%</span>
          <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 ${status.color}`}>
            <span className="text-sm font-bold text-white">{status.label}</span>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-4">
          <div 
            className="bg-blue-500 h-4 rounded-full" 
            style={{width: `${overall.attendance_percentage || 0}%`}}
          ></div>
        </div>
        <p className='pt-4 text-gray-600 text-sm'>
          {overall.total_present || 0} out of {overall.total_classes || 0} classes attended
        </p>
      </div>
    );
  };
  
  const renderMonthlyView = () => {
    return (
      <div className="bg-white rounded-2xl p-5 shadow-lg mt-4">
        <h2 className="text-2xl font-bold text-black mb-4">Monthly Attendance</h2>
        {attendanceData.monthly.length === 0 ? (
          <p className="text-gray-600">No monthly data available</p>
        ) : (
          <div className="space-y-4">
            {attendanceData.monthly.map((month, index) => {
              const status = getAttendanceStatus(month.attendance_percentage || 0);
              return (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-lg">{month.month}</h3>
                    <p className="text-sm text-gray-600">
                      {month.present_classes} of {month.total_classes} classes attended
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 ${status.color}`}>
                      <span className="text-sm font-bold text-white">{month.attendance_percentage || 0}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };
  
  const renderSubjectWiseView = () => {
    return (
      <div className="bg-white rounded-2xl p-5 shadow-lg mt-4">
        <h2 className="text-2xl font-bold text-black mb-4">Subject-wise Attendance</h2>
        {attendanceData.subjectWise.length === 0 ? (
          <p className="text-gray-600">No subject-wise data available</p>
        ) : (
          <div className="space-y-4">
            {attendanceData.subjectWise.map((subject, index) => {
              const status = getAttendanceStatus(subject.attendance_percentage || 0);
              return (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-lg">{subject.subject_name}</h3>
                    <p className="text-sm text-gray-600">
                      {subject.present_classes} of {subject.total_classes} classes attended
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 ${status.color}`}>
                      <span className="text-sm font-bold text-white">{subject.attendance_percentage || 0}%</span>
                    </div>
                    <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{width: `${subject.attendance_percentage || 0}%`}}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };
  
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-xl">Loading attendance data...</div>
      </div>
    );
  }
  
  return (
    <div className='h-screen flex flex-col'>
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
      <div className='flex flex-1 bg-gray-100'>
        <StudentSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
        <div className='mx-5 mt-4 w-full bg-gray-100'>
          <h1 className='text-4xl font-bold text-black'>Attendance Analytics</h1>
          <p className='text-xl text-gray-600'>View your attendance in different formats</p>
          <div className='flex justify-between items-center mt-4 w-full bg-gray-200 p-4 rounded-2xl shadow-lg'>
            <button 
              onClick={() => {setActiveBtn("Overall")}}
              className={`flex justify-center items-center shadow-lg h-[40px] p-3 rounded-2xl text-lg w-[360px] cursor-pointer active:scale-95 duration-200 ${changecolor("Overall")}`}>
              Overall
            </button>
            <button 
              onClick={() => {setActiveBtn("Monthly")}}
              className={`flex justify-center items-center shadow-lg h-[40px] p-3 rounded-2xl text-lg w-[360px] cursor-pointer active:scale-95 duration-200 ${changecolor("Monthly")}`}>
              Monthly
            </button>
            <button 
              onClick={() => {setActiveBtn("Subject-wise")}}
              className={`flex justify-center items-center shadow-lg h-[40px] p-3 rounded-2xl text-lg w-[360px] cursor-pointer active:scale-95 duration-200 ${changecolor("Subject-wise")}`}>
              Subject-wise
            </button>
          </div>
          
          {/* Dynamic Content Based on Active Button */}
          {activeBtn === 'Overall' && renderOverallView()}
          {activeBtn === 'Monthly' && renderMonthlyView()}
          {activeBtn === 'Subject-wise' && renderSubjectWiseView()}
        </div>
      </div>
    </div>
  )
}

export default StudentAttendance

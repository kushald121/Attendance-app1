
import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import StudentSidebar from "../../components/StudentSidebar";
import { Link } from "react-router-dom";
import { BarChart3, Users } from 'lucide-react';
import About from "../../components/About";
import Announcements from "../../components/Announcements";
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';

function StudentHome() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [attendanceStats, setAttendanceStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  const now = new Date();
  const date = now.getDate();
  const month = now.toLocaleString("default", { month: "long" });
  const day = now.toLocaleString("default", { weekday: "long" });
  const year = now.getFullYear();
  
  useEffect(() => {
    fetchAttendanceStats();
  }, []);
  
  const fetchAttendanceStats = async () => {
    try {
      const response = await api.get('/student/attendance/overall');
      if (response.data.success) {
        setAttendanceStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching attendance stats:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }
  
  
  return (
    <div className="h-screen flex flex-col">
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className='flex flex-1 bg-gray-100'>
            <StudentSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <main className="flex-1 flex flex-col p-6 w-full">  
                {/* Welcome Section */}
                <section className="mb-6 mx-5">
                    <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">
                      Welcome, {user?.name || 'Student'}!
                    </h1>
                    <p className="text-gray-600 text-2xl">
                      Your college journey made easier.
                    </p>
                </section>
                
                {/* Attendance Stats Cards */}
                <section className="flex mx-5 gap-6 mb-6">
                    <Link to="/student/attendance" className="flex items-center gap-4 h-[140px] w-[450px] rounded-2xl bg-white p-4 shadow-[6px_6px_20px_rgba(0,0,0,0.55)] hover:shadow-xl transition-shadow">
                        <BarChart3 size={28} className="text-blue-600" />
                        <div>
                            <span className="text-2xl text-gray-800 font-semibold block">View Attendance</span>
                            <span className="text-gray-600 text-lg">
                              {attendanceStats ? `${attendanceStats.attendance_percentage || 0}% Overall` : 'Loading...'}
                            </span>
                        </div>
                    </Link>
                    <Link to="/student/attendance" className="flex items-center gap-4 h-[140px] w-[450px] rounded-2xl bg-white p-4 shadow-[6px_6px_20px_rgba(0,0,0,0.55)] hover:shadow-xl transition-shadow">
                        <Users size={28} className="text-blue-600" />
                        <div>
                            <span className="text-2xl text-gray-800 font-semibold block">Classes Attended</span>
                            <span className="text-gray-600 text-lg">
                              {attendanceStats ? `${attendanceStats.total_present || 0} of ${attendanceStats.total_classes || 0} classes` : 'Loading...'}
                            </span>
                        </div>
                    </Link>
                </section>
                
                {/* Announcements */}
                 <h2 className="text-3xl font-bold text-black mx-6 mt-3 mb-6">Announcements</h2>
                <Announcements />                
            </main>
        </div>
        <About/>
    </div>
  )
}

export default StudentHome

          

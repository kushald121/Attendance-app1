
import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { Link } from "react-router-dom";
import { BarChart3, Users } from 'lucide-react';
import About from "../../components/About";
import Announcements from "../../components/Announcements";
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';

function TeacherHome() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  const now = new Date();
  const date = now.getDate();
  const month = now.toLocaleString("default", { month: "long" });
  const day = now.toLocaleString("default", { weekday: "long" });
  const year = now.getFullYear();
  
  useEffect(() => {
    fetchDashboardData();
  }, []);
  
  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/teacher/dashboard');
      if (response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <main className="flex-1 flex flex-col p-6 w-full">  
                {/* Welcome Section */}
                <section className="mb-6 mx-5">
                    <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">
                      Welcome, {dashboardData?.teacher?.name || user?.name || 'Teacher'}!
                    </h1>
                    <p className="text-gray-600 text-2xl">
                      Your college journey made easier
                    </p>
                </section>
                
                {/* Action Cards */}
                <section className="flex mx-5 gap-6 mb-6">
                    <Link to="/teacher/attendance" className="flex items-center gap-4 h-[140px] w-[450px] rounded-2xl bg-white p-4 shadow-[6px_6px_20px_rgba(0,0,0,0.55)] hover:shadow-xl transition-shadow">
                        <BarChart3 size={28} className="text-blue-600" />
                        <div>
                            <span className="text-2xl text-gray-800 font-semibold block">Mark Attendance</span>
                            <span className="text-gray-600 text-lg">{date} {month} {year}</span>
                        </div>
                    </Link>
                    <Link to="/teacher/attendance" className="flex items-center gap-4 h-[140px] w-[450px] rounded-2xl bg-white p-4 shadow-[6px_6px_20px_rgba(0,0,0,0.55)] hover:shadow-xl transition-shadow">
                        <Users size={28} className="text-blue-600" />
                        <div>
                            <span className="text-2xl text-gray-800 font-semibold block">Explore Students</span>
                            <span className="text-gray-600 text-lg">
                              {dashboardData?.totalStudents || 0} students under your subjects
                            </span>
                        </div>
                    </Link>
                </section>
                
                {/* Today's Schedule */}
                {dashboardData?.todaySchedule && dashboardData.todaySchedule.length > 0 && (
                  <section className="mx-5 mb-6">
                    <h2 className="text-2xl font-bold text-black mb-4">Today's Schedule ({day})</h2>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="grid gap-3">
                        {dashboardData.todaySchedule.map((schedule, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <span className="font-semibold text-lg">{schedule.subject_name}</span>
                              <p className="text-gray-600">Class: {schedule.class_name}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-blue-600 font-medium">Lecture {schedule.lecture_no}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                )}
                
                {/* Assigned Subjects */}
                {dashboardData?.teacher?.assignedSubjects && dashboardData.teacher.assignedSubjects.length > 0 && (
                  <section className="mx-5 mb-6">
                    <h2 className="text-2xl font-bold text-black mb-4">Your Subjects</h2>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {dashboardData.teacher.assignedSubjects.map((subject) => (
                          <div key={subject.subject_id} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <span className="font-semibold text-blue-800">{subject.subject_name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                )}
                
                {/* Announcements */}
                 <h2 className="text-3xl font-bold text-black mx-6 mt-3 mb-6">Announcements</h2>
                <Announcements />                
            </main>
        </div>
        <About/>
    </div>
  )
}

export default TeacherHome

          

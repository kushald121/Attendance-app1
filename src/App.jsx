import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './pages/Auth/login'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import TeacherAttendance from './pages/Teacher/TeacherAttendance'
import TeacherHome from './pages/Teacher/TeacherHome'
import TeacherAnnouncements from './pages/Teacher/TeacherAnnouncements'
import TeacherTimetable from './pages/Teacher/TeacherTimetable'
import StudentHome from './pages/Student/StudentHome'
import StudentAttendance from './pages/Student/StudentAttendance'
import StudentAnnouncement from './pages/Student/StudentAnnouncement'
import StudentTimetable from './pages/Student/StudentTimetable'
import { AuthProvider, useAuth } from './contexts/AuthContext'

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/signin" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/signin" replace />;
  }
  
  return children;
};

// App Routes Component
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/signin" element={<Login />} />
      <Route path="/" element={<Navigate to="/signin" replace />} />
      
      {/* Teacher Routes */}
      <Route 
        path="/teacher" 
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherHome />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/teacher/attendance" 
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherAttendance />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/teacher/timetable" 
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherTimetable />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/teacher/announcement" 
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherAnnouncements />
          </ProtectedRoute>
        } 
      />
      
      {/* Student Routes */}
      <Route 
        path="/student" 
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentHome />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/student/attendance" 
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentAttendance />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/student/timetable" 
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentTimetable />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/student/announcement" 
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentAnnouncement />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

function App() {
  const [count, setCount] = useState(0)

  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  )
}

export default App

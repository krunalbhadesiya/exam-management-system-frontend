import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/auth/login';
// import Register from './pages/auth/register';
import AdminDashboard from './pages/admin/dashboard';
import StudenDashboard from './pages/student/dashboard';
import AdminExamMangement from './pages/admin/exam';
import WriteExam from './pages/student/exam/WriteExam';
import AddExam from './pages/admin/addExam';
import { Toaster } from "@/components/ui/toaster"
import EditExam from './pages/admin/editExam';
import AdminReports from './pages/admin/reports';
import AdminStudents from './pages/admin/students';
import PrivateRoute from './components/PrivateRoute';
import ExamInstructions from './pages/student/exam/Instructions';
import StudentReports from './pages/student/reports';
import StudenExam from './pages/student/exam';
import ExamStatus from './pages/student/exam/examStatus';

function MainApp() {

  return (
    <Router>
      <Toaster />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/*" element={<Home />} />

        <Route path="/login" element={<Login />} />
        {/* <Route path="/register" element={<Register />} /> */}


        {/* <Route path="/student/exam/instrections/:id" element={<ExamInstructions />} /> */}

        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute adminRoute={true}>
              <AdminDashboard />
            </PrivateRoute>
          } />
        <Route
          path="/admin/exam"
          element={
            <PrivateRoute adminRoute={true}>
              <AdminExamMangement />
            </PrivateRoute>
          } />
        <Route
          path="/admin/exam/add"
          element={
            <PrivateRoute adminRoute={true}>
              <AddExam />
            </PrivateRoute>
          } />
        <Route
          path="/admin/exam/edit/:id"
          element={
            <PrivateRoute adminRoute={true}>
              <EditExam />
            </PrivateRoute>
          } />
        <Route
          path="/admin/reports"
          element={
            <PrivateRoute adminRoute={true}>
              <AdminReports />
            </PrivateRoute>
          } />
        <Route
          path="/admin/students"
          element={
            <PrivateRoute adminRoute={true}>
              <AdminStudents />
            </PrivateRoute>
          } />


        <Route
          path="/student/dashboard"
          element={
            <PrivateRoute adminRoute={false}>
              <StudenDashboard />
            </PrivateRoute>
          } />
        <Route
          path="/student/exam"
          element={
            <PrivateRoute adminRoute={false}>
              <StudenExam />
            </PrivateRoute>
          } />
        <Route
          path="/student/reports"
          element={
            <PrivateRoute adminRoute={false}>
              <StudentReports />
            </PrivateRoute>
          } />
        <Route
          path="/student/examwrite"
          element={
            <PrivateRoute adminRoute={false}>
              <WriteExam />
            </PrivateRoute>
          } />
        <Route
          path="/student/exam/write/:id"
          element={
            <PrivateRoute adminRoute={false}>
              <WriteExam />
            </PrivateRoute>
          } />
        <Route
          path="/student/exam/write/status/:id"
          element={
            <PrivateRoute adminRoute={false}>
              <ExamStatus />
            </PrivateRoute>
          } />
        <Route
          path="/student/exam/instrections/:id"
          element={
            <PrivateRoute adminRoute={false}>
              <ExamInstructions />
            </PrivateRoute>
          } />
      </Routes>
    </Router>
  )
}

export default MainApp
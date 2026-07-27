import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ClerkProvider } from '@clerk/clerk-react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App.jsx'
import AdminDashboard from './components/admin/AdminDashboard.jsx'
import TeacherDashboard from './components/teacher/TeacherDashboard.jsx'
import StudentDashboard from './components/student/StudentDashboard.jsx'
import { SignedIn, SignedOut } from '@clerk/clerk-react'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} appearance="dark">
        console.log("CLERK KEY:", PUBLISHABLE_KEY);
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/admin" element={
            <>
              <SignedIn><AdminDashboard /></SignedIn>
              <SignedOut><Navigate to="/" replace /></SignedOut>
            </>
          } />
          <Route path="/teacher" element={
            <>
              <SignedIn><TeacherDashboard /></SignedIn>
              <SignedOut><Navigate to="/" replace /></SignedOut>
            </>
          } />
          <Route path="/student" element={
            <>
              <SignedIn><StudentDashboard /></SignedIn>
              <SignedOut><Navigate to="/" replace /></SignedOut>
            </>
          } />
        </Routes>
      </ClerkProvider>
    </BrowserRouter>
  </StrictMode>
)
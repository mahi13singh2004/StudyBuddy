import React, { useEffect, useState } from 'react'
import { Routes, Route } from "react-router-dom"
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import RedirectRoute from './components/RedirectRoute.jsx'
import NotesPage from './components/NotesPage.jsx'
import { useAuthStore } from './store/auth.store.js'
import AIActionPage from './pages/AIActionPage.jsx'
import PDFChatPage from './pages/PDFChatPage.jsx'
import Profile from './pages/Profile.jsx'
import Navbar from './components/Navbar.jsx'
import LoadingScreen from './components/LoadingScreen.jsx'

const App = () => {
  const { checkAuth } = useAuthStore()
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const handleLoadingComplete = () => {
    setIsInitialLoading(false)
  }

  if (isInitialLoading) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/signup" element={<RedirectRoute><Signup /></RedirectRoute>} />
        <Route path="/login" element={<RedirectRoute><Login /></RedirectRoute>} />
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><PDFChatPage /></ProtectedRoute>} />
        <Route path="/ai" element={<ProtectedRoute><AIActionPage /></ProtectedRoute>} />
        <Route path="/notes" element={<ProtectedRoute><NotesPage /></ProtectedRoute>} />
      </Routes>
    </>
  )
}

export default App
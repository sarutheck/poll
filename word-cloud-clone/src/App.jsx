import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { SocketProvider } from './SocketContext'
import HostDashboard from './HostDashboard'
import ParticipantView from './ParticipantView'
import './index.css'

function App() {
  return (
    <SocketProvider>
      <Router>
        <Routes>
          <Route path="/host" element={<HostDashboard />} />
          <Route path="/join" element={<ParticipantView />} />
          <Route path="/" element={<Navigate to="/host" replace />} />
        </Routes>
      </Router>
    </SocketProvider>
  )
}

export default App

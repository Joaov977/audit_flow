import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import CompaniesList from './pages/Companies/CompaniesList'
import AuditsList from './pages/Audits/AuditsList'
import ProtectedRoute from './components/ProtectedRoute'
import FindingsList from './pages/Findings/FindingsList'
import ActionPlansList from './pages/ActionPlans/ActionPlansList'
import ProcessesList from './pages/Processes/ProcessesList'
import AuditTestsList from './pages/AuditTests/AuditTestsList'
import AuditDetail from './pages/Audits/AuditDetail'
import FindingDetail from './pages/Findings/FindingDetail'
import ActionPlanDetail from './pages/ActionPlans/ActionPlanDetail'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/login" replace />} />
      <Route path="/companies" element={<ProtectedRoute><CompaniesList /></ProtectedRoute>} />
        <Route path="/audits" element={<ProtectedRoute><AuditsList /></ProtectedRoute>} />
      <Route path="/audits/:id" element={<ProtectedRoute><AuditDetail /></ProtectedRoute>} />
      <Route path="/findings" element={<ProtectedRoute><FindingsList /></ProtectedRoute>} />
      <Route path="/findings/:id" element={<ProtectedRoute><FindingDetail /></ProtectedRoute>} />
        <Route path="/action-plans" element={<ProtectedRoute><ActionPlansList /></ProtectedRoute>} />
      <Route path="/action-plans/:id" element={<ProtectedRoute><ActionPlanDetail /></ProtectedRoute>} />
        <Route path="/processes" element={<ProtectedRoute><ProcessesList /></ProtectedRoute>} />
        <Route path="/audit-tests" element={<ProtectedRoute><AuditTestsList /></ProtectedRoute>} />
    </Routes>
  )
}

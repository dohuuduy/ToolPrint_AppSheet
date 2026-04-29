import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MainLayout } from './components/layout/MainLayout';
import { Dashboard } from './components/features/dashboard/Dashboard';
import { AppManagement } from './components/features/apps/AppManagement';
import { TemplateManagement } from './components/features/templates/TemplateManagement';
import { HistoryLog } from './components/features/history/HistoryLog';
import { SettingsPage } from './components/features/settings/SettingsPage';
import { ReportingPage } from './components/features/report/ReportingPage';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/apps" element={<AppManagement />} />
            <Route path="/templates" element={<TemplateManagement />} />
            <Route path="/logs" element={<HistoryLog />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/report" element={<ReportingPage />} />
          </Routes>
        </MainLayout>
      </AuthProvider>
    </Router>
  );
}

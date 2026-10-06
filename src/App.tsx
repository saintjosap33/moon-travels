import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from 'zitejs/auth';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Packages from './pages/Packages';
import Destinations from './pages/Destinations';
import Accommodations from './pages/Accommodations';
import Transportation from './pages/Transportation';
import Bookings from './pages/Bookings';
import Payments from './pages/Payments';
import Receipts from './pages/Receipts';
import Income from './pages/Income';
import Reports from './pages/Reports';
import Reviews from './pages/Reviews';
import SchemaExplorer from './pages/SchemaExplorer';
import ERDiagram from './pages/ERDiagram';
import Normalization from './pages/Normalization';
import ViewsIndexes from './pages/ViewsIndexes';
import Transactions from './pages/Transactions';
import QueryLab from './pages/QueryLab';
import Sidebar from './components/Sidebar';
import { Toaster } from 'sonner';

export default function App() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <Router>
      <div className="flex">
        <Sidebar user={user} />
        <main className="main-content flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/accommodations" element={<Accommodations />} />
            <Route path="/transportation" element={<Transportation />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/receipts" element={<Receipts />} />
            <Route path="/income" element={<Income />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/dbms/schema" element={<SchemaExplorer />} />
            <Route path="/dbms/er-diagram" element={<ERDiagram />} />
            <Route path="/dbms/normalization" element={<Normalization />} />
            <Route path="/dbms/views-indexes" element={<ViewsIndexes />} />
            <Route path="/dbms/transactions" element={<Transactions />} />
            <Route path="/dbms/query-lab" element={<QueryLab />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

// src/App.tsx
import React, { useState } from 'react';
import Dashboard from './pages/Dashboard';
import InTransit from './pages/InTransit';
import Inventory from './pages/Inventory';
import Materials from './pages/Materials';
import Reports from './pages/Reports';
import Sales from './pages/Sales';
import Settings from './pages/Settings';
import DashboardLayout from './components/DashboardLayout';

function App() {
  const [currentPage, setCurrentPage] = useState('Dashboard');
  // Используем заглушку для userId, так как нет реальной аутентификации
  // В будущем этот ID будет приходить от Supabase после аутентификации
  const userId = "fake-user-id-sayan-director"; 

  const handleNavigation = (page: string) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    // Передаем userId в каждую страницу для демонстрации
    const commonProps = { userId };

    switch (currentPage) {
      case 'Dashboard':
        return <Dashboard {...commonProps} />;
      case 'InTransit':
        return <InTransit {...commonProps} />;
      case 'Inventory':
        return <Inventory {...commonProps} />;
      case 'Materials':
        return <Materials {...commonProps} />;
      case 'Reports':
        return <Reports {...commonProps} />;
      case 'Sales':
        return <Sales {...commonProps} />;
      case 'Settings':
        return <Settings {...commonProps} />;
      default:
        return <Dashboard {...commonProps} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardLayout onNavigate={handleNavigation} userId={userId}>
        {renderPage()}
      </DashboardLayout>
    </div>
  );
}

export default App;
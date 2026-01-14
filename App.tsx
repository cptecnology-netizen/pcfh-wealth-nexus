import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { DashboardView } from './views/Dashboard';
import { FiscalView } from './views/Fiscal';
import { PhilanthropyView } from './views/Philanthropy';
import { GovernanceView } from './views/Governance';

// Placeholder views for simpler tabs
import { AssetsView } from './views/Assets';
import { RisksView } from './views/Risks';
import { DocumentsView } from './views/Documents';


// Placeholder views for simpler tabs


function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView />;
      case 'fiscal': return <FiscalView />;
      case 'philanthropy': return <PhilanthropyView />;
      case 'governance': return <GovernanceView />;
      case 'assets': return <AssetsView />;
      case 'risks': return <RisksView />;
      case 'documents': return <DocumentsView />;
      default: return <DashboardView />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}

export default App;

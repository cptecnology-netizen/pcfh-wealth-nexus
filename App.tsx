import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { DashboardView } from './views/Dashboard';
import { FiscalView } from './views/Fiscal';
import { PhilanthropyView } from './views/Philanthropy';
import { GovernanceView } from './views/Governance';
import { UploadCloud } from 'lucide-react';

// Placeholder views for simpler tabs
const AssetsPlaceholder = () => (
  <div className="p-10 text-center">
    <h2 className="text-2xl font-bold text-slate-700">Módulo de Ativos</h2>
    <p className="text-slate-500">Lista detalhada de ativos e valuations. (Em desenvolvimento)</p>
  </div>
);

const RisksPlaceholder = () => (
  <div className="p-10 text-center">
    <h2 className="text-2xl font-bold text-slate-700">Gestão de Riscos</h2>
    <p className="text-slate-500">Matriz de riscos e stress testing. (Em desenvolvimento)</p>
  </div>
);

const DocumentsOCR = () => (
  <div className="max-w-3xl mx-auto py-10">
    <h2 className="text-2xl font-bold text-slate-900 mb-6">Ingestão de Documentos (OCR)</h2>
    <div className="border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center bg-slate-50 hover:bg-slate-100 transition cursor-pointer group">
      <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition">
        <UploadCloud size={32} />
      </div>
      <h3 className="text-lg font-semibold text-slate-800">Arraste seus PDFs aqui</h3>
      <p className="text-slate-500 mt-2 text-sm max-w-md mx-auto">
        O sistema processará extratos bancários, faturas e relatórios de investimento usando modelos NLP treinados em Português Angolano.
      </p>
      <button className="mt-6 bg-pcfh-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-pcfh-800 transition">
        Selecionar Arquivos
      </button>
    </div>
    
    <div className="mt-8">
      <h4 className="font-semibold text-slate-700 mb-4">Arquivos Processados Recentemente</h4>
      <div className="bg-white border border-slate-200 rounded-lg divide-y divide-slate-100">
        <div className="p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-green-500"></div>
             <span className="text-sm font-medium">BFA_Extrato_Jan2025.pdf</span>
          </div>
          <span className="text-xs text-slate-500">Processado há 2h</span>
        </div>
        <div className="p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-green-500"></div>
             <span className="text-sm font-medium">Unitel_Dividendo_Nota.pdf</span>
          </div>
          <span className="text-xs text-slate-500">Processado ontem</span>
        </div>
      </div>
    </div>
  </div>
);

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView />;
      case 'fiscal': return <FiscalView />;
      case 'philanthropy': return <PhilanthropyView />;
      case 'governance': return <GovernanceView />;
      case 'assets': return <AssetsPlaceholder />;
      case 'risks': return <RisksPlaceholder />;
      case 'documents': return <DocumentsOCR />;
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

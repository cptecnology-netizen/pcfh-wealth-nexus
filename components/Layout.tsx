import React, { useState } from 'react';
import {
  LayoutDashboard,
  Landmark,
  Scale,
  HeartHandshake,
  ShieldAlert,
  Users,
  FileText,
  Menu,
  Bell,
  Search,
  LogOut
} from 'lucide-react';
import { MOCK_FAMILY } from '../constants';
import { Assistant } from './Assistant';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const SidebarItem = ({ icon: Icon, label, id, active, onClick }: any) => (
  <button
    onClick={() => onClick(id)}
    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors duration-200 rounded-lg mb-1
      ${active
        ? 'bg-pcfh-800 text-pcfh-gold border-r-4 border-pcfh-gold'
        : 'text-slate-400 hover:bg-pcfh-800 hover:text-slate-200'
      }`}
  >
    <Icon size={20} />
    <span>{label}</span>
  </button>
);

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-pcfh-900 text-white transition-all duration-300 flex flex-col shadow-xl z-20`}
      >
        <div className="p-6 flex items-center justify-between border-b border-slate-700">
          {sidebarOpen ? (
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white">PCFH <span className="text-pcfh-gold">NEXUS</span></span>
              <span className="text-xs text-slate-400">Primo Couto Family Holdings</span>
            </div>
          ) : (
            <span className="text-xl font-bold text-pcfh-gold">PCFH</span>
          )}
        </div>

        <nav className="flex-1 py-6 px-3 overflow-y-auto">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" id="dashboard" active={activeTab === 'dashboard'} onClick={setActiveTab} />
          <SidebarItem icon={Landmark} label="Gestão Patrimonial" id="assets" active={activeTab === 'assets'} onClick={setActiveTab} />
          <SidebarItem icon={Scale} label="Fiscal & Jurídico" id="fiscal" active={activeTab === 'fiscal'} onClick={setActiveTab} />
          <SidebarItem icon={HeartHandshake} label="Filantropia" id="philanthropy" active={activeTab === 'philanthropy'} onClick={setActiveTab} />
          <SidebarItem icon={Users} label="Governança Familiar" id="governance" active={activeTab === 'governance'} onClick={setActiveTab} />
          <SidebarItem icon={ShieldAlert} label="Gestão de Riscos" id="risks" active={activeTab === 'risks'} onClick={setActiveTab} />
          <SidebarItem icon={FileText} label="Documentos (OCR)" id="documents" active={activeTab === 'documents'} onClick={setActiveTab} />
        </nav>

        <div className="p-4 border-t border-slate-700/50 backdrop-blur-sm bg-slate-800/20">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src={MOCK_FAMILY[0].avatar} alt="User" className="w-10 h-10 rounded-full border-2 border-pcfh-gold shadow-md" />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-pcfh-900"></div>
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{MOCK_FAMILY[0].name}</p>
                <p className="text-xs text-slate-400 truncate tracking-wide">{MOCK_FAMILY[0].role}</p>
              </div>
            )}
            <button className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-700 rounded-lg">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 shadow-sm">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-slate-500 hover:text-slate-800">
            <Menu size={24} />
          </button>

          <div className="flex items-center gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Pesquisar ativos, protocolos..."
                className="pl-10 pr-4 py-2 border border-slate-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-pcfh-gold w-64"
              />
            </div>
            <button className="relative text-slate-500 hover:text-slate-800">
              <Bell size={24} />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* View Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>

        {/* AI Assistant */}
        <Assistant />
      </main>
    </div>
  );
};

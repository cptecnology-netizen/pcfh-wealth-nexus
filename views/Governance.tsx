import React from 'react';
import { 
  Users, 
  ScrollText, 
  Vote, 
  Clock 
} from 'lucide-react';
import { MOCK_FAMILY, MOCK_PROTOCOLS } from '../constants';

export const GovernanceView: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Governança Familiar</h1>
        <p className="text-slate-500 text-sm mt-1">Protocolos, Conselho de Família e Decisões Estratégicas.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Family Members Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-1">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Users size={18} className="text-pcfh-gold" />
              Conselho de Família
            </h3>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Quórum Ativo</span>
          </div>
          
          <div className="space-y-4">
            {MOCK_FAMILY.map(member => (
              <div key={member.id} className="flex items-center gap-4 p-3 rounded-lg border border-slate-100 hover:border-slate-300 transition">
                <img src={member.avatar} alt={member.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{member.name}</p>
                  <p className="text-xs text-slate-500">{member.role}</p>
                </div>
                {member.votingRights && (
                  <div className="ml-auto" title="Direito a Voto">
                    <Vote size={16} className="text-pcfh-gold" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Protocols List */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-2">
          <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
            <ScrollText size={18} className="text-slate-600" />
            Protocolos e Acordos
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Documento</th>
                  <th className="px-4 py-3 text-center">Versão</th>
                  <th className="px-4 py-3 text-center">Aprovação</th>
                  <th className="px-4 py-3 text-center">Próx. Revisão</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_PROTOCOLS.map(protocol => (
                  <tr key={protocol.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">{protocol.title}</td>
                    <td className="px-4 py-3 text-center text-slate-500">{protocol.version}</td>
                    <td className="px-4 py-3 text-center text-slate-500">{protocol.approvalDate}</td>
                    <td className="px-4 py-3 text-center text-slate-500">
                      <div className="flex items-center justify-center gap-1">
                        <Clock size={12} /> {protocol.nextReview}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        protocol.status === 'Active' ? 'bg-green-100 text-green-700' :
                        protocol.status === 'Draft' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {protocol.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-pcfh-gold hover:text-pcfh-900 text-xs font-semibold">Ver</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Next Meeting / Agenda */}
        <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg lg:col-span-3">
          <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold text-lg">Próxima Reunião Ordinária</h3>
             <button className="bg-white text-slate-900 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-200 transition">Ver Pauta</button>
          </div>
          <div className="flex flex-col md:flex-row gap-8">
             <div className="flex items-center gap-4">
                <div className="bg-pcfh-800 p-3 rounded text-center min-w-[60px]">
                   <span className="block text-xs text-slate-400 uppercase">FEV</span>
                   <span className="block text-2xl font-bold text-white">12</span>
                </div>
                <div>
                   <p className="font-medium">Revisão Trimestral de Performance</p>
                   <p className="text-sm text-slate-400">Sala de Reuniões, Edifício Luanda One / Zoom</p>
                </div>
             </div>
             <div className="h-px md:h-auto md:w-px bg-slate-700"></div>
             <div className="flex-1">
                <p className="text-sm text-slate-400 mb-2 font-medium uppercase text-xs">Itens em Pauta:</p>
                <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                   <li>Aprovação das contas 2024</li>
                   <li>Apresentação da Estratégia de Private Equity Angola</li>
                   <li>Validação do orçamento de filantropia 2025</li>
                </ul>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

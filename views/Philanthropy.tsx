import React from 'react';
import { 
  Heart, 
  Globe, 
  Trophy,
  ExternalLink 
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MOCK_DONATIONS, CURRENCY_FORMATTER } from '../constants';

const data = [
  { name: 'Educação', amount: 8000000 },
  { name: 'Saúde', amount: 12000000 },
  { name: 'Cultura', amount: 5000000 },
  { name: 'Ambiente', amount: 2000000 },
];

export const PhilanthropyView: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Filantropia & Impacto</h1>
          <p className="text-slate-500 text-sm mt-1">Gestão de doações, compliance fiscal e métricas de impacto IRIS+.</p>
        </div>
        <div className="bg-emerald-50 text-emerald-800 px-4 py-2 rounded-lg text-sm font-semibold border border-emerald-200">
          Impacto Total 2025: 4 Causas Apoiadas
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-pink-50 text-pink-600 rounded-lg">
              <Heart size={20} />
            </div>
            <h3 className="text-sm font-medium text-slate-500">Total Doado (YTD)</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">{CURRENCY_FORMATTER.format(27000000)}</p>
          <p className="text-xs text-slate-400 mt-2">+12% vs ano anterior</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Globe size={20} />
            </div>
            <h3 className="text-sm font-medium text-slate-500">Alinhamento ODS</h3>
          </div>
          <div className="flex gap-2 mt-2">
            <span className="w-8 h-8 flex items-center justify-center bg-red-500 text-white font-bold text-xs rounded">1</span>
            <span className="w-8 h-8 flex items-center justify-center bg-green-500 text-white font-bold text-xs rounded">3</span>
            <span className="w-8 h-8 flex items-center justify-center bg-yellow-500 text-white font-bold text-xs rounded">4</span>
          </div>
          <p className="text-xs text-slate-400 mt-3">Erradicação da Pobreza, Saúde, Educação</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Trophy size={20} />
            </div>
            <h3 className="text-sm font-medium text-slate-500">Benefício Fiscal</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">{CURRENCY_FORMATTER.format(4500000)}</p>
          <p className="text-xs text-slate-400 mt-2">Dedução estimada no IRT</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-6">Distribuição por Causa</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `AOA ${value / 1000000}M`} />
                <Tooltip cursor={{fill: '#f1f5f9'}} formatter={(value: number) => CURRENCY_FORMATTER.format(value)} />
                <Bar dataKey="amount" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <h3 className="font-bold text-slate-900 mb-4">Registo de Doações Recentes</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Instituição</th>
                  <th className="px-4 py-3 text-left">Causa</th>
                  <th className="px-4 py-3 text-right">Valor</th>
                  <th className="px-4 py-3 text-center">Métricas IRIS+</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_DONATIONS.map((donation) => (
                  <tr key={donation.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">{donation.institution}</td>
                    <td className="px-4 py-3">
                      <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs">{donation.cause}</span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">{CURRENCY_FORMATTER.format(donation.amount)}</td>
                    <td className="px-4 py-3 text-xs text-slate-500 max-w-xs truncate" title={donation.impactMetrics}>
                      {donation.impactMetrics}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="w-full mt-4 text-center text-sm text-pcfh-gold hover:text-pcfh-900 font-medium flex items-center justify-center gap-1">
            Ver Relatório Completo <ExternalLink size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

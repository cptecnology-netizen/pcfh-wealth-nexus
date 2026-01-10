import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Wallet, 
  PieChart as PieChartIcon,
  ArrowRight,
  HeartHandshake
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { MOCK_ASSETS, MOCK_ALERTS, CURRENCY_FORMATTER, INITIAL_RESERVE_STATE } from '../constants';
import { AssetCategory } from '../types';

const COLORS = ['#0f172a', '#334155', '#475569', '#94a3b8', '#d97706'];

export const DashboardView: React.FC = () => {
  const totalWealth = MOCK_ASSETS.reduce((acc, asset) => acc + asset.value, 0);
  const dataForChart = MOCK_ASSETS.map(asset => ({
    name: asset.category,
    value: asset.value
  }));

  // Reserve Coverage Calculation
  const reserveCoverage = (INITIAL_RESERVE_STATE.currentBalance / (INITIAL_RESERVE_STATE.estimatedObligation || 1)) * 100;
  const isReserveLow = reserveCoverage < 105;
  
  // Calculate Shortfall if low
  const targetReserveAmount = INITIAL_RESERVE_STATE.estimatedObligation * 1.05;
  const shortfall = targetReserveAmount - INITIAL_RESERVE_STATE.currentBalance;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Visão Geral do Património</h1>
          <p className="text-slate-500 text-sm mt-1">Bem-vindo, João. Resumo financeiro e operacional da PCFH.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition">
            Exportar Relatório
          </button>
          <button className="bg-pcfh-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-pcfh-800 transition shadow-lg shadow-pcfh-900/20">
            Nova Operação
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500 text-sm font-medium">Património Líquido Total</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Wallet size={20} />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{CURRENCY_FORMATTER.format(totalWealth)}</div>
          <div className="flex items-center mt-2 text-emerald-600 text-sm font-medium">
            <TrendingUp size={16} className="mr-1" />
            <span>+4.5% (YTD)</span>
          </div>
        </div>

        <div className={`bg-white p-6 rounded-xl border shadow-sm ${isReserveLow ? 'border-red-200 bg-red-50/50' : 'border-slate-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500 text-sm font-medium">Cobertura Reserva Fiscal</span>
            <div className={`p-2 rounded-lg ${isReserveLow ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
              <AlertTriangle size={20} />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{reserveCoverage.toFixed(1)}%</div>
          <div className="flex items-center mt-2 text-slate-500 text-sm">
            <span>Meta: 105% (Obrigação + 5%)</span>
          </div>
          {isReserveLow && (
            <div className="mt-3">
              <span className="text-xs text-red-600 font-semibold bg-red-100 px-2 py-1 rounded inline-block">
                Ação Requerida: Transferência
              </span>
              <p className="text-xs text-red-700 mt-2">
                Défice de <strong>{CURRENCY_FORMATTER.format(shortfall)}</strong> para atingir a meta de segurança.
              </p>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500 text-sm font-medium">Investimentos ESG</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <HeartHandshake size={20} />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{CURRENCY_FORMATTER.format(17000000)}</div>
          <div className="flex items-center mt-2 text-slate-500 text-sm">
            <span>2.1% do PL (Meta: 3%)</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500 text-sm font-medium">Score de Risco</span>
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
              <TrendingDown size={20} />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">Médio</div>
          <div className="flex items-center mt-2 text-slate-500 text-sm">
            <span>Exposição Cambial Elevada</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Asset Allocation Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <PieChartIcon size={20} className="text-slate-400" />
            Alocação de Ativos
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataForChart}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dataForChart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => CURRENCY_FORMATTER.format(value)}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="middle" align="right" layout="vertical" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alerts & Notifications */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <AlertTriangle size={20} className="text-pcfh-gold" />
            Alertas Críticos
          </h3>
          <div className="space-y-4">
            {MOCK_ALERTS.map(alert => (
              <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${
                alert.severity === 'warning' ? 'bg-orange-50 border-orange-400' :
                alert.severity === 'error' ? 'bg-red-50 border-red-500' :
                'bg-blue-50 border-blue-400'
              }`}>
                <p className={`text-sm font-semibold ${
                   alert.severity === 'warning' ? 'text-orange-800' :
                   alert.severity === 'error' ? 'text-red-800' :
                   'text-blue-800'
                }`}>
                  {alert.message}
                </p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-slate-500">{alert.date}</span>
                  {alert.actionRequired && (
                    <button className="text-xs font-medium underline hover:no-underline">Resolver</button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 flex items-center justify-center gap-2 text-sm text-slate-600 hover:text-pcfh-900 font-medium py-2">
            Ver todos os alertas <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
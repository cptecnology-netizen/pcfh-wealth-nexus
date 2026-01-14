import React, { useState } from 'react';
import {
    Building2,
    TrendingUp,
    Briefcase,
    DollarSign,
    Filter,
    Search,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';

export const AssetsView = () => {
    const [filterType, setFilterType] = useState('all');

    // Mock Data for PCFH Assets
    const assets = [
        {
            id: 1,
            name: 'Edifício Luanda Premium',
            type: 'Real Estate',
            location: 'Luanda, Angola',
            value: 12500000,
            change: 3.2,
            lastUpdated: '2025-01-10'
        },
        {
            id: 2,
            name: 'Unitel Holdings',
            type: 'Private Equity',
            location: 'Angola',
            value: 8400000,
            change: 1.5,
            lastUpdated: '2024-12-31'
        },
        {
            id: 3,
            name: 'Global Tech ETF',
            type: 'Public Equity',
            location: 'USA',
            value: 2300000,
            change: 5.8,
            lastUpdated: '2025-01-13'
        },
        {
            id: 4,
            name: 'Reservas em Kwanza',
            type: 'Cash',
            location: 'BFA',
            value: 500000,
            change: -12.0, // inflation impact
            lastUpdated: '2025-01-14'
        },
        {
            id: 5,
            name: 'Fazenda Huíla',
            type: 'Real Estate',
            location: 'Huíla, Angola',
            value: 3200000,
            change: 4.5,
            lastUpdated: '2024-11-30'
        }
    ];

    const filteredAssets = filterType === 'all'
        ? assets
        : assets.filter(a => a.type === filterType);

    const totalValue = assets.reduce((sum, a) => sum + a.value, 0);

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Gestão de Ativos</h1>
                    <p className="text-slate-500 mt-1">Visão consolidada do património PCFH.</p>
                </div>
                <button className="bg-pcfh-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-pcfh-800 transition flex items-center gap-2">
                    <Briefcase size={20} />
                    Novo Ativo
                </button>
            </header>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                            <DollarSign size={24} />
                        </div>
                        <span className="flex items-center text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            <ArrowUpRight size={16} className="mr-1" />
                            +2.4%
                        </span>
                    </div>
                    <h3 className="text-slate-500 text-sm font-medium">Valor Total de Ativos</h3>
                    <p className="text-3xl font-bold text-slate-900 mt-1">
                        {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'USD' }).format(totalValue)}
                    </p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                            <Building2 size={24} />
                        </div>
                        <span className="text-slate-400 text-sm">Maior Alocação</span>
                    </div>
                    <h3 className="text-slate-500 text-sm font-medium">Imobiliário</h3>
                    <p className="text-3xl font-bold text-slate-900 mt-1">54%</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                            <TrendingUp size={24} />
                        </div>
                        <span className="text-slate-400 text-sm">Performance YTD</span>
                    </div>
                    <h3 className="text-slate-500 text-sm font-medium">Retorno Geral</h3>
                    <p className="text-3xl font-bold text-slate-900 mt-1">+4.8%</p>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Buscar ativos..."
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <button className="p-2 border border-slate-300 rounded-lg hover:bg-slate-100 text-slate-600">
                            <Filter size={20} />
                        </button>
                    </div>

                    <div className="flex bg-white p-1 rounded-lg border border-slate-200">
                        {['all', 'Real Estate', 'Private Equity', 'Public Equity'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setFilterType(type)}
                                className={`px-3 py-1.5 text-sm font-medium rounded-md transition ${filterType === type
                                        ? 'bg-slate-900 text-white shadow-sm'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                    }`}
                            >
                                {type === 'all' ? 'Todos' : type}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Nome do Ativo</th>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tipo</th>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Localização</th>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Valor Atual</th>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Variação %</th>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Última Atualização</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {filteredAssets.map((asset) => (
                                <tr key={asset.id} className="hover:bg-slate-50 transition cursor-pointer">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold">
                                                {asset.name.charAt(0)}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-slate-900">{asset.name}</div>
                                                <div className="text-xs text-slate-500">ID: #{1000 + asset.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-slate-100 text-slate-800">
                                            {asset.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        {asset.location}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900 text-right">
                                        {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'USD' }).format(asset.value)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <span className={`text-sm font-medium ${asset.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {asset.change > 0 ? '+' : ''}{asset.change}%
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        {new Date(asset.lastUpdated).toLocaleDateString('pt-AO')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination/Footer */}
                <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
                    <p className="text-sm text-slate-500">Mostrando {filteredAssets.length} de {assets.length} ativos</p>
                </div>
            </div>
        </div>
    );
};

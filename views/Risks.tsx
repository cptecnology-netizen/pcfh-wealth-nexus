import React from 'react';
import {
    ShieldAlert,
    AlertTriangle,
    TrendingDown,
    Activity,
    ArrowRight
} from 'lucide-react';

export const RisksView = () => {
    // Mock Data for Risk Matrix
    const risks = [
        { id: 1, name: 'Desvalorização Cambial (AOA)', prob: 5, impact: 5, category: 'Mercado' },
        { id: 2, name: 'Illiquidez Imobiliária', prob: 4, impact: 4, category: 'Liquidez' },
        { id: 3, name: 'Alterações Fiscais (AGT)', prob: 3, impact: 4, category: 'Regulatório' },
        { id: 4, name: 'Sucessão Operacional', prob: 2, impact: 5, category: 'Governança' },
        { id: 5, name: 'Volatilidade Equity Global', prob: 3, impact: 2, category: 'Mercado' },
        { id: 6, name: 'Riscos de Cibersegurança', prob: 2, impact: 3, category: 'Operacional' },
    ];

    // Stress Testing Scenarios
    const scenarios = [
        {
            name: 'Desvalorização AOA 30%',
            impact: -1250000,
            description: 'Impacto direto nas reservas em Kwanza e ativos locais não indexados.',
            severity: 'high'
        },
        {
            name: 'Correção Mercado Global 20%',
            impact: -460000,
            description: 'Queda nos ETFs e posições de Public Equity internacionais.',
            severity: 'medium'
        },
        {
            name: 'Vacância Imobiliária 50%',
            impact: -320000,
            description: 'Perda de receita de aluguel no portfólio de Luanda.',
            severity: 'medium'
        }
    ];

    const getRiskColor = (prob: number, impact: number) => {
        const score = prob * impact;
        if (score >= 20) return 'bg-red-500 text-white';
        if (score >= 10) return 'bg-orange-400 text-white';
        return 'bg-yellow-400 text-slate-900';
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'high': return 'bg-red-50 text-red-700 border-red-200';
            case 'medium': return 'bg-orange-50 text-orange-700 border-orange-200';
            case 'low': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            default: return 'bg-slate-50 text-slate-700';
        }
    };

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-slate-900">Gestão de Riscos</h1>
                <p className="text-slate-500 mt-1">Monitorização de ameaças ao património e testes de stress.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Risk Matrix */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                        <ShieldAlert className="text-pcfh-900" size={24} />
                        <h2 className="text-lg font-bold text-slate-800">Matriz de Riscos</h2>
                    </div>

                    <div className="relative aspect-square max-w-md mx-auto bg-slate-50 border-l-2 border-b-2 border-slate-300 p-4">
                        {/* Axis Labels */}
                        <div className="absolute -left-8 top-1/2 -translate-y-1/2 -rotate-90 text-xs font-bold text-slate-400">IMPACTO</div>
                        <div className="absolute left-1/2 -bottom-8 -translate-x-1/2 text-xs font-bold text-slate-400">PROBABILIDADE</div>

                        {/* Grid Background */}
                        <div className="grid grid-cols-5 grid-rows-5 gap-1 h-full w-full opacity-30">
                            {Array.from({ length: 25 }).map((_, i) => (
                                <div key={i} className={`rounded-sm ${
                                    // Simple logic to create a heat map gradient visual
                                    (24 - i) < 5 ? 'bg-red-200' : (24 - i) < 15 ? 'bg-orange-100' : 'bg-green-100'
                                    }`}></div>
                            ))}
                        </div>

                        {/* Risk Points */}
                        {risks.map((risk) => (
                            <div
                                key={risk.id}
                                className={`absolute w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-md cursor-pointer hover:scale-110 transition z-10 ${getRiskColor(risk.prob, risk.impact)}`}
                                style={{
                                    bottom: `${(risk.prob - 1) * 20 + 10}%`,
                                    left: `${(risk.impact - 1) * 20 + 10}%`,
                                    transform: 'translate(-50%, 50%)'
                                }}
                                title={`${risk.name} (Prob: ${risk.prob}, Imp: ${risk.impact})`}
                            >
                                {risk.id}
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 space-y-2">
                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Legenda de Riscos</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {risks.map((risk) => (
                                <div key={risk.id} className="flex items-center text-sm">
                                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mr-2 flex-shrink-0 ${getRiskColor(risk.prob, risk.impact)}`}>
                                        {risk.id}
                                    </span>
                                    <span className="truncate text-slate-600" title={risk.name}>{risk.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Stress Testing & Alerts */}
                <div className="space-y-6">
                    {/* Alerts Section */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <AlertTriangle className="text-orange-500" size={24} />
                            <h2 className="text-lg font-bold text-slate-800">Alertas Ativos</h2>
                        </div>
                        <div className="space-y-3">
                            <div className="p-3 bg-orange-50 border border-orange-100 rounded-lg flex gap-3">
                                <TrendingDown className="text-orange-600 flex-shrink-0" size={20} />
                                <div>
                                    <h4 className="text-sm font-semibold text-orange-800">Alta Exposição Cambial</h4>
                                    <p className="text-xs text-orange-700 mt-1">45% dos ativos líquidos estão em Kwanzas, acima do limite de 30%.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Scenarios */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex-1">
                        <div className="flex items-center gap-2 mb-6">
                            <Activity className="text-blue-600" size={24} />
                            <h2 className="text-lg font-bold text-slate-800">Cenários de Stress (EBITDA c.a.)</h2>
                        </div>

                        <div className="space-y-4">
                            {scenarios.map((scenario, index) => (
                                <div key={index} className={`p-4 rounded-lg border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition hover:shadow-md ${getSeverityColor(scenario.severity)}`}>
                                    <div>
                                        <h4 className="font-semibold text-slate-900">{scenario.name}</h4>
                                        <p className="text-sm opacity-80 mt-1">{scenario.description}</p>
                                    </div>
                                    <div className="text-right whitespace-nowrap">
                                        <div className="text-lg font-bold text-red-600">
                                            {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'USD' }).format(scenario.impact)}
                                        </div>
                                        <div className="text-xs font-medium uppercase tracking-wide opacity-70">Impacto Estimado</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className="w-full mt-6 py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-slate-400 hover:text-slate-600 hover:bg-slate-50 transition flex items-center justify-center gap-2 font-medium">
                            Simular Novo Cenário
                            <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

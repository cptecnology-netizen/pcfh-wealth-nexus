import React, { useState } from 'react';
import { 
  Calculator, 
  ArrowRightLeft, 
  Landmark, 
  FileCheck,
  Download,
  CheckCircle2
} from 'lucide-react';
import { CURRENCY_FORMATTER, PERCENT_FORMATTER, INITIAL_RESERVE_STATE } from '../constants';

export const FiscalView: React.FC = () => {
  const [valiaInput, setValiaInput] = useState<number>(0);
  const [showSimulation, setShowSimulation] = useState(false);

  // Logic: 10% Tax + 5% Margin = 10.5% Total
  const taxBase = valiaInput * 0.10;
  const margin = taxBase * 0.05;
  const totalReserve = taxBase + margin;
  const transferDate = new Date();
  transferDate.setDate(transferDate.getDate() + 2); // D+2

  const handleSimulate = () => {
    setShowSimulation(true);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Gestão Fiscal & Conta Reserva</h1>
        <p className="text-slate-500 text-sm mt-1">Conformidade com AGT, cálculo de mais-valias e automação de reservas (Lei 26/20).</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Simulation & Action */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Automation Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-pcfh-900 px-6 py-4 flex justify-between items-center">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Calculator size={18} className="text-pcfh-gold" />
                Simulador de Evento de Valia
              </h3>
              <span className="text-xs text-slate-300 bg-pcfh-800 px-2 py-1 rounded">Fluxo D+2</span>
            </div>
            
            <div className="p-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">Valor da Mais-Valia Realizada (AOA)</label>
              <div className="flex gap-4 mb-6">
                <input 
                  type="number" 
                  className="flex-1 border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pcfh-gold focus:outline-none"
                  placeholder="Ex: 10.000.000"
                  onChange={(e) => setValiaInput(Number(e.target.value))}
                />
                <button 
                  onClick={handleSimulate}
                  className="bg-pcfh-gold hover:bg-amber-600 text-white font-medium px-6 py-2 rounded-lg transition"
                >
                  Calcular Reserva
                </button>
              </div>

              {showSimulation && valiaInput > 0 && (
                <div className="bg-slate-50 rounded-lg border border-slate-200 p-5 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-xs text-slate-500 uppercase">IRT Estimado (10%)</p>
                      <p className="text-lg font-bold text-slate-800">{CURRENCY_FORMATTER.format(taxBase)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase">Margem Segurança (5%)</p>
                      <p className="text-lg font-bold text-slate-600">{CURRENCY_FORMATTER.format(margin)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase">Total Reserva (10.5%)</p>
                      <p className="text-lg font-bold text-pcfh-gold">{CURRENCY_FORMATTER.format(totalReserve)}</p>
                    </div>
                  </div>

                  <div className="relative pt-6 pb-2">
                    <div className="absolute left-0 top-1/2 w-full border-t border-dashed border-slate-300 -z-10"></div>
                    <div className="flex justify-between items-center text-sm">
                      <div className="bg-white border border-slate-300 px-3 py-1 rounded shadow-sm flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        Conta Operacional
                      </div>
                      <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded font-mono text-xs border border-blue-200">
                        Agendado para: {transferDate.toLocaleDateString('pt-AO')}
                      </div>
                      <div className="bg-white border border-slate-300 px-3 py-1 rounded shadow-sm flex items-center gap-2">
                         <Landmark size={14} className="text-pcfh-gold" />
                        PCFH - Reserva Fiscal
                      </div>
                    </div>
                  </div>

                  <button className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium hover:bg-slate-800 transition flex justify-center items-center gap-2">
                    <CheckCircle2 size={18} />
                    Confirmar e Agendar Transferência
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Recent Tax Events */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
             <h3 className="font-bold text-slate-900 mb-4">Histórico Recente de Impostos</h3>
             <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                  <tr>
                    <th className="px-4 py-3">Data</th>
                    <th className="px-4 py-3">Evento</th>
                    <th className="px-4 py-3">Base Tributável</th>
                    <th className="px-4 py-3">IRT Pago</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="px-4 py-3">15/01/2025</td>
                    <td className="px-4 py-3 font-medium">Venda Ações Unitel</td>
                    <td className="px-4 py-3">AOA 50.000.000</td>
                    <td className="px-4 py-3">AOA 5.000.000</td>
                    <td className="px-4 py-3"><span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">Pago</span></td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">10/12/2024</td>
                    <td className="px-4 py-3 font-medium">Dividendo BAI</td>
                    <td className="px-4 py-3">AOA 12.000.000</td>
                    <td className="px-4 py-3">AOA 1.200.000</td>
                    <td className="px-4 py-3"><span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">Pago</span></td>
                  </tr>
                </tbody>
             </table>
          </div>
        </div>

        {/* Right Column: Account Status */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-pcfh-gold rounded-lg text-white">
                <Landmark size={24} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-300">PCFH - Reserva Fiscal</h3>
                <p className="text-xs text-slate-400">BFA • AO06 ... 9928</p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-slate-400 text-xs uppercase mb-1">Saldo Atual</p>
              <p className="text-3xl font-bold tracking-tight">{CURRENCY_FORMATTER.format(INITIAL_RESERVE_STATE.currentBalance)}</p>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-700">
               <div className="flex justify-between text-sm">
                 <span className="text-slate-400">Obrigação Estimada</span>
                 <span className="font-medium">{CURRENCY_FORMATTER.format(INITIAL_RESERVE_STATE.estimatedObligation)}</span>
               </div>
               <div className="flex justify-between text-sm">
                 <span className="text-slate-400">Cobertura</span>
                 <span className={`font-bold ${
                   (INITIAL_RESERVE_STATE.currentBalance / INITIAL_RESERVE_STATE.estimatedObligation) >= 1.05 
                   ? 'text-green-400' 
                   : 'text-red-400'
                 }`}>
                   {PERCENT_FORMATTER.format(INITIAL_RESERVE_STATE.currentBalance / INITIAL_RESERVE_STATE.estimatedObligation)}
                 </span>
               </div>
               <div className="flex justify-between text-sm">
                 <span className="text-slate-400">Próx. Pagamento</span>
                 <span className="font-medium text-pcfh-gold">{INITIAL_RESERVE_STATE.nextPaymentDate}</span>
               </div>
            </div>

            <button className="w-full mt-6 bg-white text-slate-900 font-semibold py-2 rounded-lg hover:bg-slate-200 transition text-sm flex items-center justify-center gap-2">
              <ArrowRightLeft size={16} />
              Reconciliação Manual
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <FileCheck size={18} className="text-emerald-600" />
              Documentos Fiscais
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition group cursor-pointer border border-transparent hover:border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center text-slate-500 font-bold text-xs">PDF</div>
                  <div className="text-sm">
                    <p className="font-medium text-slate-700">Modelo IRT-G 2024</p>
                    <p className="text-xs text-slate-400">Gerado em 05/01/2025</p>
                  </div>
                </div>
                <Download size={16} className="text-slate-400 group-hover:text-slate-700" />
              </li>
              <li className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition group cursor-pointer border border-transparent hover:border-slate-200">
                 <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center text-slate-500 font-bold text-xs">PDF</div>
                  <div className="text-sm">
                    <p className="font-medium text-slate-700">Comprovativo DAR - Dez</p>
                    <p className="text-xs text-slate-400">Pago em 10/12/2024</p>
                  </div>
                </div>
                <Download size={16} className="text-slate-400 group-hover:text-slate-700" />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

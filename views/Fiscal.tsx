import React, { useState } from 'react';
import { 
  Calculator, 
  ArrowRightLeft, 
  Landmark, 
  FileCheck,
  Download,
  CheckCircle2,
  Users,
  Briefcase,
  Receipt
} from 'lucide-react';
import { CURRENCY_FORMATTER, PERCENT_FORMATTER, INITIAL_RESERVE_STATE, MOCK_PAYROLL } from '../constants';

export const FiscalView: React.FC = () => {
  const [valiaInput, setValiaInput] = useState<number>(0);
  const [showSimulation, setShowSimulation] = useState(false);
  const [selectedPaySlip, setSelectedPaySlip] = useState<string | null>('staff_1'); // Default to Margarida

  // Logic: 10% Tax + 5% Margin = 10.5% Total
  const taxBase = valiaInput * 0.10;
  const margin = taxBase * 0.05;
  const totalReserve = taxBase + margin;
  const transferDate = new Date();
  transferDate.setDate(transferDate.getDate() + 2); // D+2

  const handleSimulate = () => {
    setShowSimulation(true);
  };

  const totalPayrollCost = MOCK_PAYROLL.reduce((acc, emp) => acc + emp.baseSalary + emp.allowances + emp.socialSecurityEmployer, 0);

  const selectedEmployee = MOCK_PAYROLL.find(e => e.id === selectedPaySlip);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Gestão Fiscal & Conta Reserva</h1>
        <p className="text-slate-500 text-sm mt-1">Conformidade com AGT, cálculo de mais-valias, automação de reservas e payroll.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Simulation & Action */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Payroll Management */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Users size={18} className="text-slate-600" />
                Gestão de Payroll & Despesas
              </h3>
              <span className="text-xs font-semibold text-slate-600">Custo Mensal Total: {CURRENCY_FORMATTER.format(totalPayrollCost)}</span>
            </div>
            
            <div className="p-6">
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                    <tr>
                      <th className="px-3 py-2">Colaborador</th>
                      <th className="px-3 py-2">Base + Subs.</th>
                      <th className="px-3 py-2">SS (3%)</th>
                      <th className="px-3 py-2">IRT (2%)</th>
                      <th className="px-3 py-2">Líquido</th>
                      <th className="px-3 py-2 text-slate-400">Empregador (8%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {MOCK_PAYROLL.map(emp => (
                      <tr 
                        key={emp.id} 
                        className={`hover:bg-slate-50 cursor-pointer transition ${selectedPaySlip === emp.id ? 'bg-blue-50/50' : ''}`}
                        onClick={() => setSelectedPaySlip(emp.id)}
                      >
                        <td className="px-3 py-3 font-medium">
                          {emp.name}
                          <span className="block text-xs text-slate-400 font-normal">{emp.role}</span>
                        </td>
                        <td className="px-3 py-3">
                          {CURRENCY_FORMATTER.format(emp.baseSalary)}
                          <span className="block text-xs text-slate-400">+{CURRENCY_FORMATTER.format(emp.allowances)}</span>
                        </td>
                        <td className="px-3 py-3 text-red-600">-{CURRENCY_FORMATTER.format(emp.socialSecurityWorker)}</td>
                        <td className="px-3 py-3 text-red-600">-{CURRENCY_FORMATTER.format(emp.irt)}</td>
                        <td className="px-3 py-3 font-bold text-emerald-600">{CURRENCY_FORMATTER.format(emp.netSalary)}</td>
                        <td className="px-3 py-3 text-slate-500">{CURRENCY_FORMATTER.format(emp.socialSecurityEmployer)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Detailed Payslip View */}
              {selectedEmployee && (
                <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 animate-in fade-in duration-300">
                  <div className="flex items-center gap-2 mb-4 border-b border-slate-200 pb-2">
                    <Receipt size={16} className="text-pcfh-gold" />
                    <h4 className="font-bold text-slate-800 text-sm">Recibo Detalhado: {selectedEmployee.name}</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                    {/* Earnings */}
                    <div>
                      <h5 className="text-xs font-semibold text-slate-500 uppercase mb-3">Rendimentos</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Salário Base</span>
                          <span className="font-medium">{CURRENCY_FORMATTER.format(selectedEmployee.baseSalary)}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>Subs. Alimentação</span>
                          <span>{CURRENCY_FORMATTER.format(25000)}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>Subs. Transporte</span>
                          <span>{CURRENCY_FORMATTER.format(25000)}</span>
                        </div>
                        <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-slate-900">
                          <span>Total Ilíquido</span>
                          <span>{CURRENCY_FORMATTER.format(selectedEmployee.baseSalary + selectedEmployee.allowances)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Deductions */}
                    <div>
                      <h5 className="text-xs font-semibold text-slate-500 uppercase mb-3">Descontos</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between text-red-600">
                          <span>Seg. Social (3%)</span>
                          <span>-{CURRENCY_FORMATTER.format(selectedEmployee.socialSecurityWorker)}</span>
                        </div>
                         <div className="flex justify-between text-xs text-slate-400 pl-2">
                          <span>Base de Incidência</span>
                          <span>{CURRENCY_FORMATTER.format(selectedEmployee.baseSalary)}</span>
                        </div>
                        <div className="flex justify-between text-red-600 mt-2">
                          <span>IRT (2%)</span>
                          <span>-{CURRENCY_FORMATTER.format(selectedEmployee.irt)}</span>
                        </div>
                        <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-emerald-600 text-lg">
                          <span>Líquido a Receber</span>
                          <span>{CURRENCY_FORMATTER.format(selectedEmployee.netSalary)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-4 flex gap-3 justify-end">
                <button className="text-sm bg-white border border-slate-300 px-3 py-2 rounded hover:bg-slate-50 flex items-center gap-2">
                  <Download size={14} /> Baixar PDF
                </button>
                <button className="text-sm bg-pcfh-800 text-white px-3 py-2 rounded hover:bg-pcfh-700 flex items-center gap-2">
                  <Briefcase size={14} /> Confirmar Processamento
                </button>
              </div>
            </div>
          </div>

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
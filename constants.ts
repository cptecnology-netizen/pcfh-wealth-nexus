import { Asset, AssetCategory, FamilyMember, Donation, FamilyProtocol, RiskScenario, Alert, FiscalReserveState, PayrollEntry } from './types';

// Exchange Rate Estimate for Jan 2026 Context
const USD_AOA_RATE = 910; 

export const CURRENCY_FORMATTER = new Intl.NumberFormat('pt-AO', {
  style: 'currency',
  currency: 'AOA',
  minimumFractionDigits: 0,
});

export const PERCENT_FORMATTER = new Intl.NumberFormat('pt-AO', {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 2,
});

export const MOCK_ASSETS: Asset[] = [
  // --- REAL ESTATE ---
  { 
    id: 'prop_1', 
    name: 'Residência Ingombotas (Rua Nicolau G Spencer)', 
    category: AssetCategory.REAL_ESTATE, 
    value: 650000000, 
    currency: 'AOA', 
    lastValuationDate: '2025-12-01', 
    roi: 0.08 
  },
  { 
    id: 'prop_2', 
    name: 'Casa Jardim do Éden (Arrendada)', 
    category: AssetCategory.REAL_ESTATE, 
    value: 125000000, 
    currency: 'AOA', 
    lastValuationDate: '2026-01-20', 
    roi: 0.0216 // (225k * 12) / 125M ~= 2.16% Yield Anual
  },

  // --- VEHICLES ---
  { 
    id: 'veh_1', 
    name: 'Ford Escort', 
    category: AssetCategory.VEHICLES, 
    value: 7000000, 
    currency: 'AOA', 
    lastValuationDate: '2026-01-20', 
    roi: -0.10 // Depreciação estimada
  },

  // --- OFFSHORE ASSETS (USA) ---
  { 
    id: 'ibkr_1', 
    name: 'Interactive Brokers Portfolio (SCHD, KBWY, VXUS)', 
    category: AssetCategory.STOCKS, 
    value: 3155.62 * USD_AOA_RATE, // $3,155.62 USD
    currency: 'USD', 
    lastValuationDate: '2026-01-09', 
    roi: 0.081 
  },
  { 
    id: 'chevron_1', 
    name: 'Chevron FCU (Checking/Savings/CDs)', 
    category: AssetCategory.CASH, 
    value: 2379.92 * USD_AOA_RATE, // Total ~$2,380 USD
    currency: 'USD', 
    lastValuationDate: '2025-12-31', 
    roi: 0.038 
  },

  // --- LOCAL BANKING & CASH ---
  { 
    id: 'bai_dp_1', 
    name: 'BAI Depósitos a Prazo (Mobile)', 
    category: AssetCategory.CASH, 
    value: 1160000, // 160k + 1M
    currency: 'AOA', 
    lastValuationDate: '2026-01-06', 
    roi: 0.025 
  },
  { 
    id: 'bic_dp_1', 
    name: 'Banco BIC Depósito a Prazo', 
    category: AssetCategory.CASH, 
    value: 7000000, 
    currency: 'AOA', 
    lastValuationDate: '2026-01-09', 
    roi: 0.14 
  },
  { 
    id: 'std_fund_1', 
    name: 'Standard Bank Carteira (Tesouraria/Obrigações)', 
    category: AssetCategory.BONDS, 
    value: 2647984, // Sum of Standard products
    currency: 'AOA', 
    lastValuationDate: '2026-01-26', 
    roi: 0.095 
  },

  // --- BFA CAPITAL MARKETS ---
  { 
    id: 'bfa_eq_1', 
    name: 'BFA Custódia Ações (BAI + BCGA)', 
    category: AssetCategory.LOCAL_EQUITY, 
    value: 379717, // ~198k + 180k
    currency: 'AOA', 
    lastValuationDate: '2026-01-09', 
    roi: 0.12 
  },
  { 
    id: 'bfa_bonds_1', 
    name: 'BFA Carteira Obrigações do Tesouro (OTs)', 
    category: AssetCategory.BONDS, 
    value: 45000000, // Estimado baseado na longa lista de cupões (OI15J30C, etc)
    currency: 'AOA', 
    lastValuationDate: '2026-01-10', 
    roi: 0.175 
  }
];

export const MOCK_PAYROLL: PayrollEntry[] = [
  {
    id: 'staff_1',
    name: 'Margarida Eduardo',
    role: 'Doméstica',
    baseSalary: 150000,
    allowances: 50000, // 25k Alim + 25k Transp
    socialSecurityWorker: 4500, // 3% de 150k
    socialSecurityEmployer: 12000, // 8% de 150k
    irt: 3000, // 2% de 150k
    netSalary: 192500 // 150k + 50k - 4.5k - 3k
  },
  {
    id: 'staff_2',
    name: 'Rosalina Eduardo',
    role: 'Doméstica',
    baseSalary: 150000,
    allowances: 50000, // 25k Alim + 25k Transp
    socialSecurityWorker: 4500, // 3% de 150k
    socialSecurityEmployer: 12000, // 8% de 150k
    irt: 3000, // 2% de 150k
    netSalary: 192500 // 150k + 50k - 4.5k - 3k
  }
];

export const MOCK_FAMILY: FamilyMember[] = [
  { id: '1', name: 'João Caitica Primo Couto', role: 'CEO', votingRights: true, avatar: 'https://ui-avatars.com/api/?name=Joao+Couto&background=0f172a&color=fff' },
  { id: '2', name: 'Sonia da Natividade Couto', role: 'Council Member', votingRights: true, avatar: 'https://ui-avatars.com/api/?name=Sonia+Couto&background=d97706&color=fff' },
  { id: '3', name: 'Otiana Primo Couto', role: 'Beneficiary', votingRights: false, avatar: 'https://ui-avatars.com/api/?name=Otiana+Couto&background=334155&color=fff' },
];

export const MOCK_DONATIONS: Donation[] = [
  { id: 'd1', date: '2025-12-15', amount: 5000000, institution: 'Fundação Arte & Cultura', cause: 'Cultura', impactMetrics: 'IRIS+ PI2094: 150 jovens atendidos', taxBenefit: true },
  { id: 'd2', date: '2025-11-20', amount: 12000000, institution: 'Hospital Pediátrico', cause: 'Saúde', impactMetrics: 'IRIS+ PI5921: 2000 vacinas distribuídas', taxBenefit: true },
];

export const MOCK_PROTOCOLS: FamilyProtocol[] = [
  { id: 'fp1', title: 'Política de Investimentos 2026-2030', version: 'v3.0', approvalDate: '2025-12-10', status: 'Active', nextReview: '2026-12-10' },
  { id: 'fp2', title: 'Sucessão Patrimonial: Imóveis Ingombotas', version: 'v1.0', approvalDate: '2024-05-15', status: 'Active', nextReview: '2027-05-15' },
];

export const MOCK_RISKS: RiskScenario[] = [
  { id: 'r1', name: 'Depreciação AOA (Risco Cambial)', type: 'Market', description: 'Impacto nos ativos em Kz (BFA/BIC/BAI) vs Passivos em USD.', projectedLoss: 120000000, probability: 0.65 },
  { id: 'r2', name: 'Volatilidade Yields OTs Angola', type: 'Market', description: 'Risco de taxa de juro na carteira BFA Capital Markets.', projectedLoss: 15000000, probability: 0.25 },
];

export const MOCK_ALERTS: Alert[] = [
  { id: 'a1', severity: 'info', message: 'Cupão OT-2026 (OI15J30C) pago: 303.025,00 AOA', date: '2026-01-15', actionRequired: false },
  { id: 'a2', severity: 'warning', message: 'Revolut: Transferência $800 para IBKR confirmada.', date: '2026-01-07', actionRequired: false },
  { id: 'a3', severity: 'info', message: 'BFA: Compra de Títulos Bodiva executada.', date: '2026-01-08', actionRequired: false },
  { id: 'a4', severity: 'error', message: 'Vencimento Depósito BIC em 09/01/2026. Necessária instrução.', date: '2026-01-08', actionRequired: true },
];

export const INITIAL_RESERVE_STATE: FiscalReserveState = {
  currentBalance: 900000, // AOA (Simulado na conta 904BFACM)
  estimatedObligation: 50918, // AOA (Baseado na Nota de Execução BFA: 509,18 de Impostos)
  nextPaymentDate: '2026-01-31',
};

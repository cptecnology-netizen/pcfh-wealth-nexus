export enum AssetCategory {
  REAL_ESTATE = 'Imobiliário',
  STOCKS = 'Ações Int. & ETFs',
  LOCAL_EQUITY = 'Ações Nacionais (Bodiva)',
  BONDS = 'Obrigações & Tesouro',
  PRIVATE_EQUITY = 'Private Equity',
  ART = 'Arte & Colecionáveis',
  CRYPTO = 'Criptoativos',
  CASH = 'Liquidez & Depósitos',
  VEHICLES = 'Veículos & Transportes'
}

export enum RiskLevel {
  LOW = 'Baixo',
  MEDIUM = 'Médio',
  HIGH = 'Alto',
  CRITICAL = 'Crítico'
}

export interface Asset {
  id: string;
  name: string;
  category: AssetCategory;
  value: number; // In AOA
  currency: string;
  lastValuationDate: string;
  roi: number;
}

export interface Transaction {
  id: string;
  assetId: string;
  date: string;
  type: 'BUY' | 'SELL' | 'DIVIDEND' | 'DONATION';
  amount: number;
  capitalGain: number;
  status: 'PENDING' | 'CLOSED';
  documentUrl?: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  role: 'CEO' | 'Beneficiary' | 'Council Member';
  votingRights: boolean;
  avatar: string;
}

export interface Donation {
  id: string;
  date: string;
  amount: number;
  institution: string;
  cause: 'Educação' | 'Saúde' | 'Ambiente' | 'Cultura';
  impactMetrics: string; // IRIS+ description
  taxBenefit: boolean;
}

export interface FamilyProtocol {
  id: string;
  title: string;
  version: string;
  approvalDate: string;
  status: 'Active' | 'Under Review' | 'Draft';
  nextReview: string;
}

export interface RiskScenario {
  id: string;
  name: string;
  type: 'Geopolitical' | 'Market' | 'Liquidity';
  description: string;
  projectedLoss: number;
  probability: number; // 0-1
}

export interface Alert {
  id: string;
  severity: 'info' | 'warning' | 'error';
  message: string;
  date: string;
  actionRequired: boolean;
}

export interface FiscalReserveState {
  currentBalance: number;
  estimatedObligation: number; // Based on pending taxes
  nextPaymentDate: string;
}

export interface PayrollEntry {
  id: string;
  name: string;
  role: string;
  baseSalary: number;
  allowances: number; // Food + Transport
  socialSecurityWorker: number; // 3%
  socialSecurityEmployer: number; // 8%
  irt: number; // 2%
  netSalary: number;
}
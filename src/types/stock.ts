export interface Quote {
  symbol?: string;
  companyName?: string;
  latestPrice: number | string;
  change: number | string;
  changePercent: number | string;
  extendedPrice: number | string;
  extendedChange: number | string;
  extendedChangePercent: number | string;
}

export interface Chart {
  date: string;
  minute: string;
  close: number;
}

export interface Profile {
  description: string;
  employees: number;
  sector: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  industry: string;
  phone: string;
  website: string;
  CEO: string;
}

export interface KeyStats {
  avg10Volume: number;
  week52high: number;
  week52low: number;
  marketcap: number;
  sharesOutstanding: number;
  beta: number;
}

export interface StockNews {
  news_url: string;
  image_url: string;
  title: string;
  text: string;
  source_name: string;
  date: string;
  topics: string[];
  sentiment: string;
  tickers: string[];
}

export interface Income {
  totalRevenue: number;
  costOfRevenue: number;
  grossProfit: number;
  researchAndDevelopment: number;
  sellingGeneralAndAdmin: number;
  operatingExpense: number;
  operatingIncome: number;
  otherIncomeExpenseNet: number;
  ebit: number;
  interestIncome: number;
  pretaxIncome: number;
  fiscalYear?: number;
  incomeTax: number;
  minorityInterest: number;
  netIncome: number;
  netIncomeBasic: number;
}

export interface Balance {
  currentCash: number;
  shortTermInvestments: number;
  receivables: number;
  inventory: number;
  otherCurrentAssets: number;
  currentAssets: number;
  longTermInvestments: number;
  propertyPlantEquipment: number;
  goodwill: number;
  intangibleAssets: number;
  otherAssets: number;
  totalAssets: number;
  accountsPayable: number;
  currentLongTermDebt: number;
  otherCurrentLiabilities: number;
  totalCurrentLiabilities: number;
  longTermDebt: number;
  otherLiabilities: number;
  minorityInterest: number;
  totalLiabilities: number;
  commonStock: number;
  retainedEarnings: number;
  fiscalYear: number;
  treasuryStock: number;
  capitalSurplus: number;
  shareholderEquity: number;
  netTangibleAssets: number;
  id: string;
  key: string;
  subkey: string;
  date: number;
  updated: number;
}

export interface Cash {
  capitalExpenditures: number;
  depreciation: number;
  dividendsPaid: number;
  cashChange: number;
  cashFlow: number;
  cashFlowFinancing: number;
  changesInReceivables: number;
  changesInInventories: number;
  exchangeRateEffect: number;
  filingType: string;
  fiscalDate: string;
  fiscalQuarter: number;
  fiscalYear: number;
  investingActivityOther: number;
  investments: number;
  netBorrowings: number;
  netIncome: number;
  otherFinancingCashFlows: number;
  reportDate: string;
  symbol: string;
  totalInvestingCashFlows: number;
  id: string;
  key: string;
  subkey: string;
  date: number;
  updated: number;
}

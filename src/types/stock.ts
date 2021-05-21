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
  peHigh: number;
  peLow: number;
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

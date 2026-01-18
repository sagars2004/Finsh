export interface PaycheckBreakdown {
  grossPay: number;
  taxes: {
    federal: number;
    state: number;
    fica: number;
    total: number;
  };
  benefits: {
    healthInsurance: number;
    retirement: number;
    other: number;
    total: number;
  };
  takeHomePay: number;
}

export interface PaycheckBreakdownSection {
  label: string;
  amount: number;
  description?: string;
}

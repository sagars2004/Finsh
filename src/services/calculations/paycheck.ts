import { SalaryInput, PayFrequency } from '../../types/user';
import { PaycheckBreakdown } from '../../types/paycheck';

/**
 * Calculate per-paycheck gross pay based on salary and frequency
 */
function calculateGrossPay(salary: number, frequency: PayFrequency): number {
  switch (frequency) {
    case 'weekly':
      return salary / 52;
    case 'biweekly':
      return salary / 26;
    case 'semimonthly':
      return salary / 24;
    case 'monthly':
      return salary / 12;
    default:
      return salary / 12;
  }
}

/**
 * PLACEHOLDER: Estimate take-home pay
 * This is a simplified calculation that should be replaced with real tax/benefit logic
 */
export function estimateTakeHome(salaryInput: SalaryInput): PaycheckBreakdown {
  const grossPay = calculateGrossPay(salaryInput.annualSalary, salaryInput.payFrequency);
  
  // Placeholder calculations - these are rough estimates
  // Real implementation should use actual tax brackets and benefit deductions
  
  // Estimate federal tax (~12-22% for typical new grad salary range)
  const federalTax = grossPay * 0.15;
  
  // Estimate state tax (varies by state, using average ~5%)
  const stateTax = grossPay * 0.05;
  
  // FICA (Social Security + Medicare) - fixed at ~7.65% of gross
  const fica = grossPay * 0.0765;
  
  const totalTaxes = federalTax + stateTax + fica;
  
  // Placeholder benefits (health insurance, retirement)
  const healthInsurance = grossPay * 0.05; // ~5% estimate
  const retirement = grossPay * 0.03; // ~3% for 401k
  
  const totalBenefits = healthInsurance + retirement;
  
  // Calculate take-home
  const takeHomePay = grossPay - totalTaxes - totalBenefits;
  
  return {
    grossPay,
    taxes: {
      federal: federalTax,
      state: stateTax,
      fica,
      total: totalTaxes,
    },
    benefits: {
      healthInsurance,
      retirement,
      other: 0,
      total: totalBenefits,
    },
    takeHomePay,
  };
}

/**
 * Calculate annual take-home pay from per-paycheck amount
 */
export function annualizeTakeHome(perCheckTakeHome: number, frequency: PayFrequency): number {
  switch (frequency) {
    case 'weekly':
      return perCheckTakeHome * 52;
    case 'biweekly':
      return perCheckTakeHome * 26;
    case 'semimonthly':
      return perCheckTakeHome * 24;
    case 'monthly':
      return perCheckTakeHome * 12;
    default:
      return perCheckTakeHome * 12;
  }
}

import { SalaryInput, PayFrequency } from '../../types/user';
import { PaycheckBreakdown } from '../../types/paycheck';

/**
 * State-specific income tax rates (approximate, for new graduate salary ranges)
 * These are simplified flat rates for illustration - real calculations would use brackets
 */
const STATE_TAX_RATES: Record<string, number> = {
  // No state income tax
  Alaska: 0,
  Florida: 0,
  Nevada: 0,
  'New Hampshire': 0,
  'South Dakota': 0,
  Tennessee: 0,
  Texas: 0,
  Washington: 0,
  Wyoming: 0,
  
  // Low tax states (~1-3%)
  Colorado: 0.045, // Flat 4.5%
  Illinois: 0.0495, // Flat 4.95%
  Indiana: 0.0323, // Flat 3.23%
  Michigan: 0.0425, // Flat 4.25%
  Pennsylvania: 0.0307, // Flat 3.07%
  Utah: 0.0495, // Flat 4.95%
  
  // Medium tax states (~4-6%)
  Alabama: 0.05,
  Arizona: 0.05,
  Arkansas: 0.05,
  Georgia: 0.055,
  Idaho: 0.06,
  Iowa: 0.055,
  Kansas: 0.0525,
  Kentucky: 0.05,
  Louisiana: 0.045,
  Maine: 0.075,
  Maryland: 0.0525,
  Minnesota: 0.055,
  Mississippi: 0.05,
  Missouri: 0.0525,
  Montana: 0.055,
  Nebraska: 0.065,
  'New Mexico': 0.049,
  'North Carolina': 0.0525,
  'North Dakota': 0.025,
  Ohio: 0.0399,
  Oklahoma: 0.05,
  'Rhode Island': 0.055,
  'South Carolina': 0.07,
  Vermont: 0.06,
  Virginia: 0.0575,
  'West Virginia': 0.065,
  Wisconsin: 0.053,
  
  // Higher tax states (~7-13%)
  California: 0.09,
  Connecticut: 0.06,
  Delaware: 0.066,
  Hawaii: 0.08,
  Massachusetts: 0.05, // Flat
  'New Jersey': 0.07,
  'New York': 0.065,
  Oregon: 0.09,
  'District of Columbia': 0.08,
};

/**
 * Calculate federal tax based on 2024 tax brackets (simplified)
 * For new graduates (typically $50k-$100k range), effective rate is usually 12-22%
 */
function calculateFederalTax(grossPay: number, annualSalary: number): number {
  // Simplified progressive tax calculation
  // 2024 brackets: 10% up to $11,600, 12% up to $47,150, 22% up to $100,525
  if (annualSalary <= 11600) {
    return grossPay * 0.10;
  } else if (annualSalary <= 47150) {
    return grossPay * 0.12;
  } else if (annualSalary <= 100525) {
    return grossPay * 0.22;
  } else {
    // For higher earners, estimate 24%
    return grossPay * 0.24;
  }
}

/**
 * Calculate state tax based on state
 */
function calculateStateTax(grossPay: number, state: string): number {
  const rate = STATE_TAX_RATES[state] ?? 0.05; // Default to 5% if state not found
  return grossPay * rate;
}

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
 * Enhanced tax calculation with state-specific rates
 * Uses 2024 tax brackets and state tax rates for more accurate estimates
 */
export function estimateTakeHome(salaryInput: SalaryInput): PaycheckBreakdown {
  const grossPay = calculateGrossPay(salaryInput.annualSalary, salaryInput.payFrequency);
  
  // Calculate federal tax using progressive brackets
  const federalTax = calculateFederalTax(grossPay, salaryInput.annualSalary);
  
  // Calculate state tax using state-specific rates
  const stateTax = calculateStateTax(grossPay, salaryInput.state);
  
  // FICA (Social Security + Medicare) - fixed at 7.65% of gross (up to Social Security wage base)
  // For 2024: Social Security 6.2% on first $168,600, Medicare 1.45% on all income
  const socialSecurityRate = salaryInput.annualSalary <= 168600 ? 0.062 : 0;
  const medicareRate = 0.0145;
  const fica = grossPay * (socialSecurityRate + medicareRate);
  
  const totalTaxes = federalTax + stateTax + fica;
  
  // Benefits (health insurance, retirement)
  // Estimates based on typical new graduate benefit costs
  const healthInsurance = grossPay * 0.05; // ~5% of gross pay
  const retirement = grossPay * 0.03; // ~3% for 401k (typical employer match starter)
  
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

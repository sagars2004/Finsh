import { TradeoffCard } from '../types/tradeoff';

/**
 * Generate placeholder tradeoff cards for the MVP
 */
export function getPlaceholderTradeoffs(): TradeoffCard[] {
  return [
    {
      id: 'housing-1',
      title: 'Living Situation',
      category: 'housing',
      optionA: {
        title: 'Live Alone',
        pros: [
          'Complete privacy and independence',
          'No roommate conflicts',
          'Full control over your space',
        ],
        cons: [
          'Higher rent costs',
          'All utilities on you',
          'Less social interaction',
        ],
        monthlyImpact: -1500,
        description: 'Rent a 1-bedroom apartment',
      },
      optionB: {
        title: 'Live with Roommates',
        pros: [
          'Split rent and utilities',
          'Built-in social support',
          'Lower overall costs',
        ],
        cons: [
          'Less privacy',
          'Need to coordinate schedules',
          'Potential conflicts',
        ],
        monthlyImpact: -800,
        description: 'Share a 2-bedroom apartment',
      },
    },
    {
      id: 'savings-1',
      title: 'Savings Strategy',
      category: 'savings',
      optionA: {
        title: 'Aggressive Savings',
        pros: [
          'Build emergency fund faster',
          'Start investing sooner',
          'Financial security',
        ],
        cons: [
          'Less spending flexibility',
          'Delayed lifestyle upgrades',
          'Tight monthly budget',
        ],
        monthlyImpact: -800,
        description: 'Save 30% of take-home pay',
      },
      optionB: {
        title: 'Balanced Approach',
        pros: [
          'Still saving regularly',
          'Room for fun expenses',
          'Sustainable long-term',
        ],
        cons: [
          'Slower wealth building',
          'Less buffer for emergencies',
          'Delayed big goals',
        ],
        monthlyImpact: -400,
        description: 'Save 15% of take-home pay',
      },
    },
    {
      id: 'debt-1',
      title: 'Student Loan Repayment',
      category: 'debt',
      optionA: {
        title: 'Pay Off Fast',
        pros: [
          'Less interest over time',
          'Debt-free sooner',
          'Peace of mind',
        ],
        cons: [
          'Less money for other goals',
          'Tighter monthly budget',
          'Delayed investments',
        ],
        monthlyImpact: -600,
        description: 'Double the minimum payment',
      },
      optionB: {
        title: 'Minimum Payments',
        pros: [
          'More monthly flexibility',
          'Can save or invest more',
          'Lower monthly obligation',
        ],
        cons: [
          'More interest paid overall',
          'Debt lingers longer',
          'Opportunity cost',
        ],
        monthlyImpact: -300,
        description: 'Pay minimum required amount',
      },
    },
  ];
}

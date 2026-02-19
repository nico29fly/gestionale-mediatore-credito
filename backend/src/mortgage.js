'use strict';

function toNumber(value, name) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    throw new Error(`Il campo "${name}" deve essere numerico.`);
  }

  return parsed;
}

function roundCurrency(value) {
  return Math.round(value * 100) / 100;
}

function calculateMonthlyInstallment(amount, annualRate, years) {
  const months = years * 12;

  if (months <= 0) {
    throw new Error('La durata deve essere maggiore di zero.');
  }

  if (annualRate === 0) {
    return amount / months;
  }

  const monthlyRate = annualRate / 12 / 100;
  const factor = Math.pow(1 + monthlyRate, months);

  return (amount * monthlyRate * factor) / (factor - 1);
}

function assessRisk({ ltv, postDebtToIncome, applicantAge, years }) {
  let score = 0;

  if (ltv <= 80) score += 2;
  else if (ltv <= 90) score += 1;

  if (postDebtToIncome <= 30) score += 2;
  else if (postDebtToIncome <= 35) score += 1;

  if (applicantAge + years <= 75) score += 1;

  if (score >= 5) return 'Alta';
  if (score >= 3) return 'Media';
  return 'Bassa';
}

function calculateMortgageScenario(input) {
  const propertyValue = toNumber(input.propertyValue, 'Valore immobile');
  const requestedAmount = toNumber(input.requestedAmount, 'Importo richiesto');
  const annualRate = toNumber(input.annualRate, 'Tasso annuale');
  const years = toNumber(input.years, 'Durata (anni)');
  const monthlyIncome = toNumber(input.monthlyIncome, 'Reddito mensile');
  const monthlyDebts = toNumber(input.monthlyDebts || 0, 'Debiti mensili');
  const applicantAge = toNumber(input.applicantAge || 30, 'Età richiedente');

  if (propertyValue <= 0 || requestedAmount <= 0 || monthlyIncome <= 0) {
    throw new Error('Valori economici devono essere maggiori di zero.');
  }

  if (requestedAmount > propertyValue) {
    throw new Error('L\'importo richiesto non può superare il valore dell\'immobile.');
  }

  if (annualRate < 0 || years <= 0 || applicantAge < 18) {
    throw new Error('Controlla tasso, durata o età richiedente.');
  }

  const monthlyInstallment = calculateMonthlyInstallment(requestedAmount, annualRate, years);
  const ltv = (requestedAmount / propertyValue) * 100;
  const preDebtToIncome = (monthlyDebts / monthlyIncome) * 100;
  const postDebtToIncome = ((monthlyDebts + monthlyInstallment) / monthlyIncome) * 100;
  const maxRecommendedInstallment = Math.max((monthlyIncome * 0.3) - monthlyDebts, 0);
  const interestCost = (monthlyInstallment * years * 12) - requestedAmount;

  return {
    summary: {
      monthlyInstallment: roundCurrency(monthlyInstallment),
      totalInterest: roundCurrency(interestCost),
      totalPayback: roundCurrency(monthlyInstallment * years * 12)
    },
    indicators: {
      ltv: roundCurrency(ltv),
      debtToIncomeBefore: roundCurrency(preDebtToIncome),
      debtToIncomeAfter: roundCurrency(postDebtToIncome),
      maxRecommendedInstallment: roundCurrency(maxRecommendedInstallment)
    },
    risk: {
      approvalProbability: assessRisk({ ltv, postDebtToIncome, applicantAge, years }),
      notes: [
        postDebtToIncome > 35
          ? 'Rapporto rata/reddito elevato: valuta una durata maggiore o importo minore.'
          : 'Rapporto rata/reddito in linea con politiche bancarie tipiche.',
        ltv > 80
          ? 'Loan-to-value sopra l\'80%: potrebbe essere richiesto più capitale proprio.'
          : 'Loan-to-value prudenziale.'
      ]
    }
  };
}

module.exports = {
  calculateMortgageScenario,
  calculateMonthlyInstallment,
  roundCurrency
};

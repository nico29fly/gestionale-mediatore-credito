'use strict';

const assert = require('assert');
const { calculateMortgageScenario, calculateMonthlyInstallment } = require('../src/mortgage');

function testMonthlyInstallment() {
  const installment = calculateMonthlyInstallment(100000, 3, 20);
  assert(Math.abs(installment - 554.6) < 0.5, 'La rata deve essere circa 554.6€');
}

function testScenario() {
  const result = calculateMortgageScenario({
    propertyValue: 200000,
    requestedAmount: 140000,
    annualRate: 3.2,
    years: 25,
    monthlyIncome: 3200,
    monthlyDebts: 300,
    applicantAge: 35
  });

  assert(result.summary.monthlyInstallment > 0, 'Rata positiva');
  assert(result.indicators.ltv === 70, 'LTV deve essere 70%');
  assert(['Alta', 'Media', 'Bassa'].includes(result.risk.approvalProbability), 'Classe rischio valida');
}

function testValidation() {
  assert.throws(() => calculateMortgageScenario({ propertyValue: 100000 }), /numerico/);
}

function run() {
  testMonthlyInstallment();
  testScenario();
  testValidation();
  console.log('Tutti i test sono passati.');
}

run();

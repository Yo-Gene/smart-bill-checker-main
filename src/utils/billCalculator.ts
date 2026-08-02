const lifelineRate = 0.795308;
const regularRate = 1.801867;
const highRate = 2.380873;

export interface PrepaidBalanceAudit {
  unitsUsed: number;
  energyCost: number;
  otherDeductions: number;
  expectedDeduction: number;
  expectedBalance: number;
  actualBalance: number;
  difference: number;
}

export function calculateEnergyCost(unitsUsed: number): number {
  const safeUnits = Math.max(0, unitsUsed);

  if (safeUnits <= 30) {
    return safeUnits * lifelineRate;
  }

  if (safeUnits <= 300) {
    return safeUnits * regularRate;
  }

  return 300 * regularRate + (safeUnits - 300) * highRate;
}

export function auditPrepaidBalance(
  startingBalance: number,
  previousReading: number,
  currentReading: number,
  actualBalance: number,
  otherDeductions: number = 0
): PrepaidBalanceAudit {
  const unitsUsed = currentReading - previousReading;

  if (unitsUsed < 0) {
    throw new Error(
      "Current meter reading cannot be lower than the previous reading"
    );
  }

  const safeDeductions = Math.max(0, otherDeductions);
  const energyCost = calculateEnergyCost(unitsUsed);
  const expectedDeduction = energyCost + safeDeductions;
  const expectedBalance = Math.max(0, startingBalance - expectedDeduction);
  const difference = expectedBalance - actualBalance;

  return {
    unitsUsed,
    energyCost,
    otherDeductions: safeDeductions,
    expectedDeduction,
    expectedBalance,
    actualBalance,
    difference,
  };
}

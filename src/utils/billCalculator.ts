// utils/billCalculator.ts

// PURC Residential Tariffs (GHS per kWh)
const lifelineRate = 0.795308;
const regularRate = 1.801867;
const highRate = 2.380873;

const lifelineService = 2.13;
const regularService = 10.730886;

// ----------------------
// POSTPAID BILL CALCULATION
// ----------------------
export interface ResidentialBill {
  energyCharge: number;
  serviceCharge: number;
  total: number;
}

export function calculateResidentialBill(units: number): ResidentialBill {
  let energyCharge = 0;
  let serviceCharge = 0;

  if (units <= 30) {
    energyCharge = units * lifelineRate;
    serviceCharge = lifelineService;
  } else if (units <= 300) {
    energyCharge = units * regularRate;
    serviceCharge = regularService;
  } else {
    energyCharge = 300 * regularRate + (units - 300) * highRate;
    serviceCharge = regularService;
  }

  const total = energyCharge + serviceCharge;

  return {
    energyCharge,
    serviceCharge,
    total,
  };
}

// ----------------------
// PREPAID ELECTRICITY AUDIT 
// ----------------------

const prepaidServiceCharge = 12; // GH₵
const levyRate = 0.15; // more realistic combined VAT + levies (~15%)

// Tier limits
const TIER_1_LIMIT = 300; // kWh

export function calculateExpectedUnits(
  amountPaid: number,
  arrears: number = 0
): number {
  // Step 1: Remove fixed deductions
  const afterFixedCharges = amountPaid - prepaidServiceCharge - arrears;
  if (afterFixedCharges <= 0) return 0;

  // Step 2: Remove taxes/levies
  const energyCredit = afterFixedCharges * (1 - levyRate);

  let remainingMoney = energyCredit;
  let units = 0;

  // Step 3: Tier 1 (0–300 kWh)
  const tier1Cost = TIER_1_LIMIT * regularRate;

  if (remainingMoney <= tier1Cost) {
    // All units fall within Tier 1
    units += remainingMoney / regularRate;
    return units;
  } else {
    // Fill Tier 1 completely
    units += TIER_1_LIMIT;
    remainingMoney -= tier1Cost;
  }

  // Step 4: Tier 2 (300+ kWh)
  units += remainingMoney / highRate;

  return units;
}

export interface PrepaidAudit {
  expectedUnits: number;
  unitsReceived: number;
  difference: number;
  expectedUnitsDisplay: string;
  unitsReceivedDisplay: string;
  differenceDisplay: string;
}

export function auditPrepaidPurchase(amountPaid: number, unitsReceived: number, arrears: number = 0): PrepaidAudit {
  const expectedUnits = calculateExpectedUnits(amountPaid, arrears);
  const difference = expectedUnits - unitsReceived;

  return {
    expectedUnits,
    unitsReceived,
    difference,
    expectedUnitsDisplay: expectedUnits.toFixed(2),
    unitsReceivedDisplay: unitsReceived.toFixed(2),
    differenceDisplay: difference.toFixed(2),
  };
}
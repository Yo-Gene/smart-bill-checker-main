export type AuditStatus = "overcharged" | "correct" | "undercharged";

export interface BillRecord {
  id: number;
  date: string;
  startingBalance: number;
  previousReading: number;
  currentReading: number;
  unitsUsed: number;
  energyCost: number;
  otherDeductions: number;
  expectedDeduction: number;
  expectedBalance: number;
  actualBalance: number;
  difference: number;
  status: AuditStatus;
}

const STORAGE_KEY = "bill_history";

export const getBillHistory = (): BillRecord[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const addBillRecord = (record: BillRecord) => {
  const history = getBillHistory();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([record, ...history]));
};

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

const VALID_STATUSES: AuditStatus[] = [
  "overcharged",
  "correct",
  "undercharged",
];

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

const isValidBillRecord = (value: unknown): value is BillRecord => {
  if (!value || typeof value !== "object") return false;

  const record = value as Partial<BillRecord>;

  return (
    isFiniteNumber(record.id) &&
    typeof record.date === "string" &&
    !Number.isNaN(Date.parse(record.date)) &&
    isFiniteNumber(record.startingBalance) &&
    isFiniteNumber(record.previousReading) &&
    isFiniteNumber(record.currentReading) &&
    isFiniteNumber(record.unitsUsed) &&
    isFiniteNumber(record.energyCost) &&
    isFiniteNumber(record.otherDeductions) &&
    isFiniteNumber(record.expectedDeduction) &&
    isFiniteNumber(record.expectedBalance) &&
    isFiniteNumber(record.actualBalance) &&
    isFiniteNumber(record.difference) &&
    typeof record.status === "string" &&
    VALID_STATUSES.includes(record.status as AuditStatus)
  );
};

export const getBillHistory = (): BillRecord[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];

    const parsed: unknown = JSON.parse(data);
    if (!Array.isArray(parsed)) {
      localStorage.removeItem(STORAGE_KEY);
      return [];
    }

    const validRecords = parsed.filter(isValidBillRecord);

    // Remove legacy or malformed entries so they cannot crash the History page.
    if (validRecords.length !== parsed.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(validRecords));
    }

    return validRecords;
  } catch {
    // Corrupted localStorage should never stop the page from opening.
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
};

export const addBillRecord = (record: BillRecord) => {
  const history = getBillHistory();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([record, ...history]));
};

export interface BillRecord {
  id: number;
  date: string;
  amountPaid: number;
  unitsReceived: number;
  expectedUnits: number;
  difference: number;
  status: "overcharged" | "correct" | "undercharged";
}

const STORAGE_KEY = "bill_history";

export const getBillHistory = (): BillRecord[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const addBillRecord = (record: BillRecord) => {
  const history = getBillHistory();
  const updatedHistory = [record, ...history];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
};

export const removeBillRecord = (id: number) => {
  const history = getBillHistory().filter((item) => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
};
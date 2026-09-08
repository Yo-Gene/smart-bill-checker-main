import { getBillHistory } from "@/utils/historyStorage";

const SETTINGS_KEY = "app_settings";
const LAST_REMINDER_KEY = "last_audit_reminder_notification";
const LOW_BALANCE_THRESHOLD = 20;
const AUDIT_REMINDER_DAYS = 7;

interface StoredSettings {
  notifications?: boolean;
}

const notificationsEnabled = () => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as StoredSettings;
    return parsed.notifications === true;
  } catch {
    return false;
  }
};

export const notificationSupported = () =>
  typeof window !== "undefined" && "Notification" in window;

export const requestNotificationPermission = async () => {
  if (!notificationSupported()) return "unsupported" as const;

  if (Notification.permission === "granted") return "granted" as const;
  if (Notification.permission === "denied") return "denied" as const;

  try {
    return await Notification.requestPermission();
  } catch {
    return "denied" as const;
  }
};

export const sendAppNotification = (title: string, body: string) => {
  if (!notificationsEnabled() || !notificationSupported()) return false;
  if (Notification.permission !== "granted") return false;

  try {
    new Notification(title, {
      body,
      icon: `${import.meta.env.BASE_URL}logo.PNG`,
      badge: `${import.meta.env.BASE_URL}logo.PNG`,
    });
    return true;
  } catch {
    return false;
  }
};

export const notifyAuditResult = (
  status: "overcharged" | "correct" | "undercharged",
  difference: number,
  actualBalance: number
) => {
  const amount = Math.abs(difference).toFixed(2);

  if (status === "overcharged") {
    sendAppNotification(
      "Possible overcharge detected",
      `Your meter balance differs from the expected balance by GH₵ ${amount}.`
    );
  } else if (status === "undercharged") {
    sendAppNotification(
      "Balance higher than expected",
      `Your meter balance is GH₵ ${amount} higher than the calculated balance.`
    );
  } else {
    sendAppNotification(
      "Audit complete",
      "Your meter balance is close to the expected balance."
    );
  }

  if (actualBalance <= LOW_BALANCE_THRESHOLD) {
    sendAppNotification(
      "Low prepaid balance",
      `Your current meter balance is GH₵ ${actualBalance.toFixed(2)}. Consider topping up soon.`
    );
  }
};

export const checkAuditReminder = () => {
  if (!notificationsEnabled() || !notificationSupported()) return;
  if (Notification.permission !== "granted") return;

  const history = getBillHistory();
  if (history.length === 0) return;

  const latest = history.reduce((newest, item) =>
    new Date(item.date).getTime() > new Date(newest.date).getTime() ? item : newest
  );

  const latestTime = new Date(latest.date).getTime();
  if (!Number.isFinite(latestTime)) return;

  const ageMs = Date.now() - latestTime;
  const reminderMs = AUDIT_REMINDER_DAYS * 24 * 60 * 60 * 1000;
  if (ageMs < reminderMs) return;

  const lastReminder = Number(localStorage.getItem(LAST_REMINDER_KEY) || 0);
  if (Date.now() - lastReminder < 24 * 60 * 60 * 1000) return;

  const sent = sendAppNotification(
    "Time for another meter audit",
    `It has been at least ${AUDIT_REMINDER_DAYS} days since your last audit. Record your latest meter reading and balance.`
  );

  if (sent) {
    localStorage.setItem(LAST_REMINDER_KEY, String(Date.now()));
  }
};

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseMoneyAmount(val: unknown): number {
  if (val == null) return 0;
  if (typeof val === "number") return isNaN(val) ? 0 : val;
  if (typeof val === "string") {
    const parsed = Number(val);
    return isNaN(parsed) ? 0 : parsed;
  }
  if (typeof val === "object") {
    const obj = val as Record<string, unknown>;
    // Protobuf Long serialization: { low: number, high: number, unsigned?: boolean }
    if ("low" in obj && typeof obj.low === "number") {
      const high = typeof obj.high === "number" ? obj.high : 0;
      return obj.low + high * 4294967296;
    }
    if ("amountMinor" in obj) {
      return parseMoneyAmount(obj.amountMinor);
    }
  }
  return 0;
}

export function formatVnd(amountOrMoney?: unknown, defaultCurrency = "VND"): string {
  if (amountOrMoney == null) return `0 ${defaultCurrency}`;
  let currency = defaultCurrency;
  let amount = 0;

  if (typeof amountOrMoney === "object") {
    const obj = amountOrMoney as Record<string, unknown>;
    if ("currency" in obj && typeof obj.currency === "string" && obj.currency) {
      currency = obj.currency;
    }
    if ("amountMinor" in obj) {
      amount = parseMoneyAmount(obj.amountMinor);
    } else {
      amount = parseMoneyAmount(amountOrMoney);
    }
  } else {
    amount = parseMoneyAmount(amountOrMoney);
  }

  return `${new Intl.NumberFormat("vi-VN").format(amount)} ${currency}`;
}


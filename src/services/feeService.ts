import { LATE_FEE_PER_DAY_CENTS, MAX_LATE_FEE_CENTS } from "../config";
import type { Loan } from "../models/loan";
import type { Store } from "../store/memoryStore";
import { daysBetween } from "../utils/dates";

/** Late fee for returning `loan` at `returnedAt`, capped at MAX_LATE_FEE_CENTS. */
export function calculateFee(loan: Loan, returnedAt: Date): number {
  const daysLate = daysBetween(loan.dueAt, returnedAt);
  if (daysLate <= 0) return 0;
  return Math.min(daysLate * LATE_FEE_PER_DAY_CENTS, MAX_LATE_FEE_CENTS);
}

/** Total unpaid late fees for a member, in cents. */
export function outstandingFees(store: Store, memberId: string): number {
  let total = 0;
  for (const loan of store.loans.values()) {
    if (loan.memberId === memberId && loan.feeCents && !loan.feePaid) total += loan.feeCents;
  }
  return total;
}

/** Marks every unpaid fee for the member as paid. Returns the amount settled, in cents. */
export function payFees(store: Store, memberId: string): number {
  const owed = outstandingFees(store, memberId);
  for (const loan of store.loans.values()) {
    if (loan.memberId === memberId && loan.feeCents) loan.feePaid = true;
  }
  return owed;
}

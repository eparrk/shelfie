import { LOAN_PERIOD_DAYS } from "../config";
import type { Loan } from "../models/loan";
import type { Store } from "../store/memoryStore";
import { addDays } from "../utils/dates";
import { nextId } from "../utils/ids";
import { isAvailable } from "./catalogService";
import { ServiceError } from "./errors";
import { assertCanBorrow } from "./memberService";

export function borrow(store: Store, memberId: string, bookId: string, now = new Date()): Loan {
  if (!store.books.has(bookId)) throw new ServiceError("NOT_FOUND", `No book ${bookId}`);
  assertCanBorrow(store, memberId);
  if (!isAvailable(store, bookId)) throw new ServiceError("UNAVAILABLE", `Book ${bookId} is on loan`);

  const loan: Loan = {
    id: nextId("loan"),
    bookId,
    memberId,
    borrowedAt: now,
    dueAt: addDays(now, LOAN_PERIOD_DAYS),
  };
  store.loans.set(loan.id, loan);
  return loan;
}

export function returnBook(store: Store, loanId: string, now = new Date()): Loan {
  const loan = store.loans.get(loanId);
  if (!loan) throw new ServiceError("NOT_FOUND", `No loan ${loanId}`);
  if (loan.returnedAt) throw new ServiceError("ALREADY_RETURNED", `Loan ${loanId} already returned`);
  loan.returnedAt = now;
  return loan;
}

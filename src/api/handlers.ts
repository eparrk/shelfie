import { ServiceError, type ErrorCode } from "../services/errors";
import * as catalog from "../services/catalogService";
import * as fees from "../services/feeService";
import * as loans from "../services/loanService";
import { getMember } from "../services/memberService";
import type { Store } from "../store/memoryStore";

export interface Response {
  status: number;
  body: unknown;
}

const STATUS: Record<ErrorCode, number> = {
  NOT_FOUND: 404,
  UNAVAILABLE: 409,
  LIMIT_REACHED: 422,
  ALREADY_RETURNED: 409,
  FEES_OWED: 402,
};

function wrap(fn: () => unknown): Response {
  try {
    return { status: 200, body: fn() };
  } catch (err) {
    if (err instanceof ServiceError) return { status: STATUS[err.code], body: { error: err.code, message: err.message } };
    throw err;
  }
}

export const handlers = (store: Store) => ({
  search: (q: string) => wrap(() => catalog.search(store, q)),
  borrow: (memberId: string, bookId: string) => wrap(() => loans.borrow(store, memberId, bookId)),
  returnBook: (loanId: string) => wrap(() => loans.returnBook(store, loanId)),
  fees: (memberId: string) =>
    wrap(() => {
      getMember(store, memberId);
      return { owedCents: fees.outstandingFees(store, memberId) };
    }),
  payFees: (memberId: string) =>
    wrap(() => {
      getMember(store, memberId);
      return { paidCents: fees.payFees(store, memberId) };
    }),
});

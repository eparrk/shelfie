export interface Loan {
  id: string;
  bookId: string;
  memberId: string;
  borrowedAt: Date;
  dueAt: Date;
  returnedAt?: Date;
  /** Late fee assessed at return time, in cents. 0 when returned on time. */
  feeCents?: number;
  feePaid?: boolean;
}

export function isActive(loan: Loan): boolean {
  return loan.returnedAt === undefined;
}

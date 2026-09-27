export interface Loan {
  id: string;
  bookId: string;
  memberId: string;
  borrowedAt: Date;
  dueAt: Date;
  returnedAt?: Date;
}

export function isActive(loan: Loan): boolean {
  return loan.returnedAt === undefined;
}

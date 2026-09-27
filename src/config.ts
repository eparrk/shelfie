/** Number of days a book may be borrowed for. */
export const LOAN_PERIOD_DAYS = 14;

/** Maximum books a member may hold at the same time. */
export const MAX_ACTIVE_LOANS = 3;

/** A loan is flagged "due soon" within this many days of its due date. */
export const DUE_SOON_DAYS = 2;

/** Late fee charged per day (or part of a day) a book is overdue, in cents. */
export const LATE_FEE_PER_DAY_CENTS = 25;

/** A single loan's late fee never exceeds this, in cents. */
export const MAX_LATE_FEE_CENTS = 1000;

/** Members owing more than this (in cents) cannot borrow until they pay. */
export const FEE_BLOCK_THRESHOLD_CENTS = 500;

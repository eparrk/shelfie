# Shelfie

A tiny library-lending service: a catalog of books, library members, and loans.
Used by the Compass team as a sample codebase for dogfooding Compass on real pull requests.

## Layout

| Path | What lives there |
|---|---|
| `src/models/` | Plain data types: `Book`, `Member`, `Loan` |
| `src/store/` | In-memory store (swap for a database later) |
| `src/services/` | Business rules: catalog search, borrowing, returns, member limits |
| `src/api/` | Request handlers that wrap services and map errors to status codes |
| `src/utils/` | Shared helpers (dates, ids) |
| `src/config.ts` | Loan period and borrowing limits |
| `docs/ARCHITECTURE.md` | How the pieces fit together |

## Rules today

- Loans last `LOAN_PERIOD_DAYS` (14) days.
- A member can hold at most `MAX_ACTIVE_LOANS` (3) books at once.
- A book is "due soon" when it is within `DUE_SOON_DAYS` (2) days of its due date.
- Returning late costs `LATE_FEE_PER_DAY_CENTS` (25¢) per day or part of a day, capped at
  `MAX_LATE_FEE_CENTS` ($10) per loan.
- Members owing more than `FEE_BLOCK_THRESHOLD_CENTS` ($5) cannot borrow until they pay.

## Run it

```bash
npm install
npm test
npm run typecheck
```

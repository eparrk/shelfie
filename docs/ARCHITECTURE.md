# Architecture

```
api/handlers.ts  ->  services/*  ->  store/memoryStore.ts
                          |
                          +-> utils/dates.ts, config.ts
```

- **Handlers** never touch the store directly. They call a service and translate
  `ServiceError` codes into HTTP-style status codes.
- **Services** hold every business rule. `loanService` owns borrowing and returns;
  `memberService` owns whether a member is allowed to borrow; `catalogService`
  owns search and availability; `feeService` owns late-fee math and payment.
  `memberService` asks `feeService` for a member's balance before allowing a loan.
- **`utils/dates.ts`** is shared by loans (due dates) and the catalog ("due soon"
  badges). Changing date math affects both.
- **`config.ts`** is the single place for limits. Tests import from it rather than
  hard-coding numbers.

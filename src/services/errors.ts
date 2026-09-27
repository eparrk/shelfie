export type ErrorCode =
  | "NOT_FOUND"
  | "UNAVAILABLE"
  | "LIMIT_REACHED"
  | "ALREADY_RETURNED";

export class ServiceError extends Error {
  constructor(public readonly code: ErrorCode, message: string) {
    super(message);
    this.name = "ServiceError";
  }
}

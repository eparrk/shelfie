import { FEE_BLOCK_THRESHOLD_CENTS, MAX_ACTIVE_LOANS } from "../config";
import { isActive } from "../models/loan";
import type { Member } from "../models/member";
import type { Store } from "../store/memoryStore";
import { nextId } from "../utils/ids";
import { ServiceError } from "./errors";
import { outstandingFees } from "./feeService";

export function addMember(store: Store, name: string, email: string, now = new Date()): Member {
  const member: Member = { id: nextId("member"), name, email, joinedAt: now };
  store.members.set(member.id, member);
  return member;
}

export function getMember(store: Store, memberId: string): Member {
  const member = store.members.get(memberId);
  if (!member) throw new ServiceError("NOT_FOUND", `No member ${memberId}`);
  return member;
}

export function activeLoanCount(store: Store, memberId: string): number {
  return [...store.loans.values()].filter((l) => l.memberId === memberId && isActive(l)).length;
}

/** Throws if the member is not allowed to borrow another book right now. */
export function assertCanBorrow(store: Store, memberId: string): void {
  getMember(store, memberId);
  if (activeLoanCount(store, memberId) >= MAX_ACTIVE_LOANS) {
    throw new ServiceError("LIMIT_REACHED", `Member ${memberId} already has ${MAX_ACTIVE_LOANS} books`);
  }
  const owed = outstandingFees(store, memberId);
  if (owed > FEE_BLOCK_THRESHOLD_CENTS) {
    throw new ServiceError("FEES_OWED", `Member ${memberId} owes ${owed} cents in late fees`);
  }
}

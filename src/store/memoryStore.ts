import type { Book } from "../models/book";
import type { Loan } from "../models/loan";
import type { Member } from "../models/member";

export interface Store {
  books: Map<string, Book>;
  members: Map<string, Member>;
  loans: Map<string, Loan>;
}

export function createStore(): Store {
  return { books: new Map(), members: new Map(), loans: new Map() };
}

import { DUE_SOON_DAYS } from "../config";
import type { Book } from "../models/book";
import { isActive } from "../models/loan";
import type { Store } from "../store/memoryStore";
import { daysBetween } from "../utils/dates";
import { nextId } from "../utils/ids";

export function addBook(store: Store, input: Omit<Book, "id">): Book {
  const book: Book = { id: nextId("book"), ...input };
  store.books.set(book.id, book);
  return book;
}

/** Case-insensitive search over title, author and tags. */
export function search(store: Store, query: string): Book[] {
  const q = query.trim().toLowerCase();
  if (!q) return [...store.books.values()];
  return [...store.books.values()].filter(
    (b) =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.tags.some((t) => t.toLowerCase().includes(q)),
  );
}

export function isAvailable(store: Store, bookId: string): boolean {
  return ![...store.loans.values()].some((l) => l.bookId === bookId && isActive(l));
}

/** Active loans whose due date is within DUE_SOON_DAYS of `now` (and not yet overdue). */
export function dueSoon(store: Store, now: Date) {
  return [...store.loans.values()].filter((l) => {
    if (!isActive(l)) return false;
    const left = daysBetween(now, l.dueAt);
    return left >= 0 && left <= DUE_SOON_DAYS;
  });
}

import { addBook } from "../src/services/catalogService";
import { addMember } from "../src/services/memberService";
import { createStore } from "../src/store/memoryStore";
import { resetIds } from "../src/utils/ids";

export const T0 = new Date("2026-09-01T10:00:00Z");

export function seed() {
  resetIds();
  const store = createStore();
  const ada = addMember(store, "Ada", "ada@example.com", T0);
  const books = [
    addBook(store, { title: "Dune", author: "Frank Herbert", isbn: "1", tags: ["sci-fi"] }),
    addBook(store, { title: "Emma", author: "Jane Austen", isbn: "2", tags: ["classic"] }),
    addBook(store, { title: "Neuromancer", author: "William Gibson", isbn: "3", tags: ["sci-fi", "cyberpunk"] }),
    addBook(store, { title: "Beloved", author: "Toni Morrison", isbn: "4", tags: ["classic"] }),
  ];
  return { store, ada, books };
}

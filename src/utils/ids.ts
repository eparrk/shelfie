let counter = 0;

/** Short, readable, process-unique ids like "loan_3". Good enough for an in-memory store. */
export function nextId(prefix: string): string {
  counter += 1;
  return `${prefix}_${counter}`;
}

export function resetIds(): void {
  counter = 0;
}

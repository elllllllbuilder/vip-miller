const processedIds = new Set<string>();

export function isProcessed(id: string): boolean {
  return processedIds.has(id);
}

export function markAsProcessed(id: string): void {
  processedIds.add(id);
}

export function markAsNotProcessed(id: string): void {
  processedIds.delete(id);
}

// Em produção, usar Redis para idempotência distribuída
export function clearProcessedIds(): void {
  processedIds.clear();
}

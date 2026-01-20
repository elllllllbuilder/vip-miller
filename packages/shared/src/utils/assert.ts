export function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

export function assertEnv(key: string): string {
  const value = process.env[key];
  assert(value, `Missing environment variable: ${key}`);
  return value;
}

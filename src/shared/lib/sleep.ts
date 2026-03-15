export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function sleepUntil(isoDate: string): Promise<void> {
  const target = new Date(isoDate).getTime();
  const ms = Math.max(0, target - Date.now());
  return sleep(ms);
}

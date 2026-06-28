const HISTORY_KEY = 'gifty_history';

interface GiftHistory {
  [personName: string]: string[];
}

export function getHistory(name: string): string[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(HISTORY_KEY);
  const history: GiftHistory = raw ? JSON.parse(raw) : {};
  return history[name] || [];
}

export function saveGift(name: string, giftName: string): void {
  if (typeof window === 'undefined') return;
  const raw = localStorage.getItem(HISTORY_KEY);
  const history: GiftHistory = raw ? JSON.parse(raw) : {};
  if (!history[name]) history[name] = [];
  if (!history[name].includes(giftName)) {
    history[name].push(giftName);
  }
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function removeGift(name: string, giftName: string): void {
  if (typeof window === 'undefined') return;
  const raw = localStorage.getItem(HISTORY_KEY);
  const history: GiftHistory = raw ? JSON.parse(raw) : {};
  if (!history[name]) return;
  history[name] = history[name].filter((g) => g !== giftName);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function clearHistory(name: string): void {
  if (typeof window === 'undefined') return;
  const raw = localStorage.getItem(HISTORY_KEY);
  const history: GiftHistory = raw ? JSON.parse(raw) : {};
  delete history[name];
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function getAllHistory(): GiftHistory {
  if (typeof window === 'undefined') return {};
  const raw = localStorage.getItem(HISTORY_KEY);
  return raw ? JSON.parse(raw) : {};
}


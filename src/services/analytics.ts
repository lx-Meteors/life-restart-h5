import type { AnalyticsEvent, AnalyticsPayload } from '@/types/game';

const STORAGE_KEY = 'life_restart_analytics';

interface StoredEvent {
  event: AnalyticsEvent;
  payload: AnalyticsPayload;
  ts: number;
}

function persist(event: AnalyticsEvent, payload: AnalyticsPayload) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list: StoredEvent[] = raw ? JSON.parse(raw) : [];
    list.push({ event, payload, ts: Date.now() });
    if (list.length > 500) list.splice(0, list.length - 500);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    /* ignore quota */
  }
}

/** 埋点：可对接神策/友盟/GTM，当前双写 console + localStorage */
export function track(event: AnalyticsEvent, payload: AnalyticsPayload = {}) {
  const body = { event, ...payload, ts: Date.now() };
  if (import.meta.env.DEV) {
    console.info('[analytics]', body);
  }
  persist(event, payload);

  const w = window as Window & { dataLayer?: Record<string, unknown>[] };
  if (w.dataLayer) {
    w.dataLayer.push({ event: `life_restart_${event}`, ...payload });
  }
}

export function getAnalyticsHistory(): StoredEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

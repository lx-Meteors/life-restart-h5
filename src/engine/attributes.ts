import type { AttributeDelta, Attributes, AttributeKey, RandomOutcome } from '@/types/game';

const KEYS: AttributeKey[] = ['wealth', 'career', 'love', 'happiness'];

export const DEFAULT_ATTRIBUTES: Attributes = {
  wealth: 50,
  career: 50,
  love: 50,
  happiness: 50,
};

export function clampAttribute(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function applyDelta(attrs: Attributes, delta?: AttributeDelta): Attributes {
  if (!delta) return { ...attrs };
  const next = { ...attrs };
  for (const key of KEYS) {
    if (delta[key] !== undefined) {
      next[key] = clampAttribute(next[key] + delta[key]!);
    }
  }
  return next;
}

export function resolveRandomOutcome(outcomes: RandomOutcome[]): RandomOutcome {
  const roll = Math.random() * 100;
  let acc = 0;
  for (const o of outcomes) {
    acc += o.chance;
    if (roll < acc) return o;
  }
  return outcomes[outcomes.length - 1];
}

export function calcLifeScore(attrs: Attributes): number {
  const weights = { wealth: 0.3, career: 0.25, love: 0.2, happiness: 0.25 };
  const raw =
    attrs.wealth * weights.wealth +
    attrs.career * weights.career +
    attrs.love * weights.love +
    attrs.happiness * weights.happiness;
  return Math.round(raw);
}

export function calcBeatPercent(score: number): number {
  const base = 55 + score * 0.42;
  const jitter = (score % 7) - 3;
  return Math.min(99, Math.max(61, Math.round(base + jitter)));
}

export const ATTRIBUTE_LABELS: Record<AttributeKey, string> = {
  wealth: '财富',
  career: '事业',
  love: '爱情',
  happiness: '快乐',
};

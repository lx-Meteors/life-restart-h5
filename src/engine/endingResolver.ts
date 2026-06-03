import type { Attributes, Ending, GameChoiceRecord } from '@/types/game';

function meetsMin(attrs: Attributes, min?: Partial<Attributes>): boolean {
  if (!min) return true;
  return Object.entries(min).every(([k, v]) => attrs[k as keyof Attributes] >= (v ?? 0));
}

function meetsMax(attrs: Attributes, max?: Partial<Attributes>): boolean {
  if (!max) return true;
  return Object.entries(max).every(([k, v]) => attrs[k as keyof Attributes] <= (v ?? 100));
}

function meetsChoices(history: GameChoiceRecord[], required?: string[]): boolean {
  if (!required?.length) return true;
  const chosen = new Set(history.map((h) => h.choiceId));
  return required.every((id) => chosen.has(id));
}

function meetsIdentity(identityId: string, allowed?: string[]): boolean {
  if (!allowed?.length) return true;
  return allowed.includes(identityId);
}

export function resolveEnding(
  endings: Ending[],
  attrs: Attributes,
  identityId: string,
  history: GameChoiceRecord[],
  explicitEndingId?: string | null
): Ending {
  if (explicitEndingId) {
    const found = endings.find((e) => e.id === explicitEndingId);
    if (found) return found;
  }

  const scored = endings
    .map((ending) => {
      const { matchRules } = ending;
      let score = matchRules.priority;

      if (!meetsIdentity(identityId, matchRules.identityIds)) return { ending, score: -1 };
      if (!meetsMin(attrs, matchRules.minAttributes)) return { ending, score: -1 };
      if (!meetsMax(attrs, matchRules.maxAttributes)) return { ending, score: -1 };
      if (!meetsChoices(history, matchRules.requiredChoices)) return { ending, score: -1 };

      if (matchRules.requiredChoices?.length) {
        score += matchRules.requiredChoices.length * 10;
      }

      const attrBonus =
        (matchRules.minAttributes
          ? Object.keys(matchRules.minAttributes).length * 2
          : 0) +
        (matchRules.maxAttributes
          ? Object.keys(matchRules.maxAttributes).length * 2
          : 0);
      score += attrBonus;

      if (ending.id.includes('fallback')) score -= 100;

      return { ending, score };
    })
    .filter((s) => s.score >= 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length > 0) return scored[0].ending;

  const fallback =
    endings.find((e) => e.id === 'happy-ordinary') ??
    endings[0];
  return fallback;
}

export function buildLifeSummary(
  ending: Ending,
  identityName: string,
  attrs: Attributes,
  randomEvents: string[]
): string {
  const parts: string[] = [];
  parts.push(`你从「${identityName}」开局，一路跌跌撞撞走到了「${ending.title}」。`);

  if (attrs.wealth >= 80) parts.push('财富层面你已经赢麻了。');
  else if (attrs.wealth <= 25) parts.push('钱包比你的人生还空虚，但故事很精彩。');

  if (attrs.career >= 80) parts.push('事业线爽文男主/女主实锤。');
  else if (attrs.career <= 30) parts.push('职场对你不太友好，但你活出了另一种可能。');

  if (attrs.love >= 75) parts.push('感情线比电视剧还狗血也还甜。');
  else if (attrs.love <= 30) parts.push('爱情不是你的主线，你选择了别的剧本。');

  if (attrs.happiness >= 75) parts.push('快乐值拉满，这才是真·人生赢家。');
  else if (attrs.happiness <= 35) parts.push('快乐不多，但反差拉满，适合发朋友圈。');

  if (randomEvents.length) {
    parts.push(`名场面：${randomEvents.slice(0, 2).join('；')}。`);
  }

  parts.push(ending.summary);
  return parts.join('');
}

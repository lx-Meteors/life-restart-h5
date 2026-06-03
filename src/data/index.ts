import identities from './identities.json';
import endings from './endings.json';
import fallenWealthy from './storylines/fallen-wealthy.json';
import underdog from './storylines/underdog.json';
import privileged from './storylines/privileged.json';
import scholar from './storylines/scholar.json';
import worker from './storylines/worker.json';
import influencer from './storylines/influencer.json';
import romantic from './storylines/romantic.json';
import aiFounder from './storylines/ai-founder.json';
import type { Ending, Identity, StorylinePack } from '@/types/game';

export const IDENTITIES = identities as Identity[];
export const ENDINGS = endings as Ending[];

const STORYLINE_MAP: Record<string, StorylinePack> = {
  'fallen-wealthy': fallenWealthy as StorylinePack,
  underdog: underdog as StorylinePack,
  privileged: privileged as StorylinePack,
  scholar: scholar as unknown as StorylinePack,
  worker: worker as unknown as StorylinePack,
  influencer: influencer as unknown as StorylinePack,
  romantic: romantic as unknown as StorylinePack,
  'ai-founder': aiFounder as unknown as StorylinePack,
};

export function getStoryline(identityId: string): StorylinePack | undefined {
  return STORYLINE_MAP[identityId];
}

export function getIdentity(id: string): Identity | undefined {
  return IDENTITIES.find((i) => i.id === id);
}

export function getEnding(id: string): Ending | undefined {
  return ENDINGS.find((e) => e.id === id);
}

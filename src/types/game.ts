/** 四项核心属性 */
export type AttributeKey = 'wealth' | 'career' | 'love' | 'happiness';

export type Attributes = Record<AttributeKey, number>;

export type AttributeDelta = Partial<Attributes>;

/** 属性变化可带随机结果（如币圈） */
export interface RandomOutcome {
  chance: number;
  label: string;
  delta: AttributeDelta;
  endingHint?: string;
}

export interface Choice {
  id: string;
  text: string;
  /** 需已做出过的选择 id 才显示 */
  requiresAnyChoice?: string[];
  /** 若已做出过其中任一选择则隐藏 */
  hideIfAnyChoice?: string[];
  /** 选择后属性变化 */
  delta?: AttributeDelta;
  /** 随机分支（如投资成败） */
  randomOutcomes?: RandomOutcome[];
  /** 下一剧情节点；终局节点可省略，由结局引擎判定 */
  nextNodeId?: string;
  /** 直接指定结局 id（终局选项） */
  endingId?: string;
}

export interface StoryNode {
  id: string;
  age?: number;
  title: string;
  description?: string;
  /** 梗/反差提示 */
  flavor?: string;
  choices: Choice[];
  /** 是否为该线的最后一个决策节点 */
  isFinale?: boolean;
}

export interface Identity {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  background: string;
  /** 反差梗 */
  contrast: string;
  initialAttributes: Attributes;
  startNodeId: string;
  color: string;
}

export interface StorylinePack {
  identityId: string;
  nodes: Record<string, StoryNode>;
}

export interface Ending {
  id: string;
  title: string;
  summary: string;
  emoji: string;
  /** 匹配权重规则 */
  matchRules: {
    minAttributes?: Partial<Attributes>;
    maxAttributes?: Partial<Attributes>;
    /** 需包含的选择 id */
    requiredChoices?: string[];
    /** 身份限定 */
    identityIds?: string[];
    priority: number;
  };
}

export interface GameChoiceRecord {
  nodeId: string;
  choiceId: string;
  choiceText: string;
  randomLabel?: string;
}

export type GamePhase = 'splash' | 'identity' | 'story' | 'result';

export interface GameState {
  phase: GamePhase;
  identityId: string | null;
  currentNodeId: string | null;
  attributes: Attributes;
  choiceHistory: GameChoiceRecord[];
  endingId: string | null;
  randomEvents: string[];
}

export type AnalyticsEvent =
  | 'game_start'
  | 'identity_select'
  | 'story_choice'
  | 'game_complete'
  | 'share_click'
  | 'replay_click'
  | 'view_other_lives';

export interface AnalyticsPayload {
  identityId?: string;
  nodeId?: string;
  choiceId?: string;
  endingId?: string;
  score?: number;
}

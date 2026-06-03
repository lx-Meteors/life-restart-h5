import type {
  Choice,
  GameChoiceRecord,
  GameState,
  Identity,
  StorylinePack,
  Ending,
} from '@/types/game';
import { applyDelta, resolveRandomOutcome, DEFAULT_ATTRIBUTES } from './attributes';
import { resolveEnding } from './endingResolver';

export function createInitialState(): GameState {
  return {
    phase: 'splash',
    identityId: null,
    currentNodeId: null,
    attributes: { ...DEFAULT_ATTRIBUTES },
    choiceHistory: [],
    endingId: null,
    randomEvents: [],
  };
}

export function selectIdentity(
  state: GameState,
  identity: Identity
): GameState {
  return {
    ...state,
    phase: 'story',
    identityId: identity.id,
    currentNodeId: identity.startNodeId,
    attributes: { ...identity.initialAttributes },
    choiceHistory: [],
    endingId: null,
    randomEvents: [],
  };
}

export function getCurrentNode(
  pack: StorylinePack | undefined,
  nodeId: string | null
) {
  if (!pack || !nodeId) return null;
  return pack.nodes[nodeId] ?? null;
}

export interface ApplyChoiceResult {
  state: GameState;
  randomLabel?: string;
  isComplete: boolean;
}

export function applyChoice(
  state: GameState,
  pack: StorylinePack,
  nodeId: string,
  choice: Choice,
  endings: Ending[]
): ApplyChoiceResult {
  let attrs = { ...state.attributes };
  let randomLabel: string | undefined;
  const randomEvents = [...state.randomEvents];

  let effectiveChoiceId = choice.id;

  if (choice.randomOutcomes?.length) {
    const outcome = resolveRandomOutcome(choice.randomOutcomes);
    attrs = applyDelta(attrs, outcome.delta);
    randomLabel = outcome.label;
    randomEvents.push(outcome.label);
    if (outcome.endingHint) {
      effectiveChoiceId = outcome.endingHint;
    } else if (outcome.delta.wealth !== undefined && outcome.delta.wealth >= 40) {
      effectiveChoiceId = 'choice-buy-crypto-win';
    } else if (outcome.delta.wealth !== undefined && outcome.delta.wealth <= -40) {
      effectiveChoiceId = 'choice-buy-crypto-lose';
    }
  } else {
    attrs = applyDelta(attrs, choice.delta);
  }

  const record: GameChoiceRecord = {
    nodeId,
    choiceId: effectiveChoiceId,
    choiceText: choice.text,
    randomLabel,
  };

  const history = [...state.choiceHistory, record];

  if (choice.endingId) {
    return {
      isComplete: true,
      randomLabel,
      state: {
        ...state,
        phase: 'result',
        attributes: attrs,
        choiceHistory: history,
        endingId: choice.endingId,
        randomEvents,
        currentNodeId: null,
      },
    };
  }

  const node = pack.nodes[nodeId];
  const nextId = choice.nextNodeId;

  if (!nextId || (node?.isFinale && !choice.nextNodeId)) {
    const ending = resolveEnding(
      endings,
      attrs,
      state.identityId!,
      history,
      choice.endingId
    );
    return {
      isComplete: true,
      randomLabel,
      state: {
        ...state,
        phase: 'result',
        attributes: attrs,
        choiceHistory: history,
        endingId: ending.id,
        randomEvents,
        currentNodeId: null,
      },
    };
  }

  const nextNode = pack.nodes[nextId];
  if (!nextNode) {
    const ending = resolveEnding(endings, attrs, state.identityId!, history);
    return {
      isComplete: true,
      randomLabel,
      state: {
        ...state,
        phase: 'result',
        attributes: attrs,
        choiceHistory: history,
        endingId: ending.id,
        randomEvents,
        currentNodeId: null,
      },
    };
  }

  if (nextNode.isFinale === false && nextNode.choices.every((c) => c.endingId)) {
    // intermediate — continue
  }

  return {
    isComplete: false,
    randomLabel,
    state: {
      ...state,
      attributes: attrs,
      choiceHistory: history,
      currentNodeId: nextId,
      randomEvents,
    },
  };
}

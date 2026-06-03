import { useCallback, useMemo, useState } from 'react';
import type { Choice, GameState, Identity } from '@/types/game';
import { ENDINGS, getEnding, getIdentity, getStoryline } from '@/data';
import {
  applyChoice,
  createInitialState,
  getCurrentNode,
  selectIdentity,
} from '@/engine/gameEngine';
import { resolveEnding, buildLifeSummary } from '@/engine/endingResolver';
import { calcBeatPercent, calcLifeScore } from '@/engine/attributes';
import { track } from '@/services/analytics';

export function useGame() {
  const [state, setState] = useState<GameState>(createInitialState);
  const [toast, setToast] = useState<string | null>(null);

  const identity = state.identityId ? getIdentity(state.identityId) : null;
  const storyline = state.identityId ? getStoryline(state.identityId) : undefined;
  const currentNode = getCurrentNode(storyline, state.currentNodeId);

  const ending = useMemo(() => {
    if (!state.endingId) return null;
    return getEnding(state.endingId) ?? resolveEnding(ENDINGS, state.attributes, state.identityId ?? '', state.choiceHistory);
  }, [state.endingId, state.attributes, state.identityId, state.choiceHistory]);

  const resultMeta = useMemo(() => {
    if (!ending || !identity) return null;
    const score = calcLifeScore(state.attributes);
    const beatPercent = calcBeatPercent(score);
    const summary = buildLifeSummary(ending, identity.name, state.attributes, state.randomEvents);
    return { score, beatPercent, summary };
  }, [ending, identity, state.attributes, state.randomEvents]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }, []);

  const startGame = useCallback(() => {
    track('game_start');
    setState((s) => ({ ...s, phase: 'identity' }));
  }, []);

  const pickIdentity = useCallback((id: Identity) => {
    track('identity_select', { identityId: id.id });
    setState(selectIdentity(createInitialState(), id));
  }, []);

  const pickChoice = useCallback(
    (choice: Choice) => {
      if (!storyline || !state.currentNodeId) return;
      track('story_choice', {
        identityId: state.identityId ?? undefined,
        nodeId: state.currentNodeId,
        choiceId: choice.id,
      });
      const { state: next, randomLabel, isComplete } = applyChoice(
        state,
        storyline,
        state.currentNodeId,
        choice,
        ENDINGS
      );
      setState(next);
      if (randomLabel) showToast(randomLabel);
      if (isComplete) {
        track('game_complete', {
          identityId: next.identityId ?? undefined,
          endingId: next.endingId ?? undefined,
          score: calcLifeScore(next.attributes),
        });
      }
    },
    [state, storyline, showToast]
  );

  const replay = useCallback(() => {
    track('replay_click');
    setState({ ...createInitialState(), phase: 'identity' });
  }, []);

  const viewOtherLives = useCallback(() => {
    track('view_other_lives');
    setState({ ...createInitialState(), phase: 'identity' });
  }, []);

  const goSplash = useCallback(() => {
    setState(createInitialState());
  }, []);

  return {
    state,
    identity,
    currentNode,
    ending,
    resultMeta,
    toast,
    startGame,
    pickIdentity,
    pickChoice,
    replay,
    viewOtherLives,
    goSplash,
  };
}

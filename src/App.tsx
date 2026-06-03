import { useMemo } from 'react';
import { useGame } from '@/hooks/useGame';
import { SplashScreen } from '@/components/SplashScreen';
import { IdentitySelect } from '@/components/IdentitySelect';
import { StoryScreen } from '@/components/StoryScreen';
import { ResultScreen } from '@/components/ResultScreen';
import { Toast } from '@/components/Toast';
import { getStoryline } from '@/data';

function countNodes(identityId: string): number {
  const pack = getStoryline(identityId);
  if (!pack) return 4;
  return Object.keys(pack.nodes).length;
}

export default function App() {
  const {
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
  } = useGame();

  const totalSteps = useMemo(
    () => (state.identityId ? countNodes(state.identityId) : 4),
    [state.identityId]
  );

  const stepIndex = state.choiceHistory.length;

  return (
    <div className="app">
      <div className="app-bg" aria-hidden />
      {state.phase === 'splash' && <SplashScreen onStart={startGame} />}
      {state.phase === 'identity' && <IdentitySelect onSelect={pickIdentity} />}
      {state.phase === 'story' && identity && currentNode && (
        <StoryScreen
          identity={identity}
          node={currentNode}
          attributes={state.attributes}
          choiceHistory={state.choiceHistory}
          stepIndex={stepIndex}
          totalSteps={totalSteps}
          onChoice={pickChoice}
        />
      )}
      {state.phase === 'result' && identity && ending && resultMeta && (
        <ResultScreen
          identity={identity}
          ending={ending}
          attributes={state.attributes}
          score={resultMeta.score}
          beatPercent={resultMeta.beatPercent}
          summary={resultMeta.summary}
          onReplay={replay}
          onViewOthers={viewOtherLives}
        />
      )}
      <Toast message={toast} />
    </div>
  );
}

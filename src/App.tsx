import { useGame } from '@/hooks/useGame';
import { SplashScreen } from '@/components/SplashScreen';
import { IdentitySelect } from '@/components/IdentitySelect';
import { StoryScreen } from '@/components/StoryScreen';
import { ResultScreen } from '@/components/ResultScreen';
import { Toast } from '@/components/Toast';

/** 每条线玩家大约做 4 次选择到结局（进度条用） */
const STEPS_PER_RUN = 4;

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

  const totalSteps = STEPS_PER_RUN;

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

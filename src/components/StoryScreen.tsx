import type { Attributes, Choice, GameChoiceRecord, Identity, StoryNode } from '@/types/game';
import { AttributeBars } from './AttributeBars';

function filterChoices(choices: Choice[], history: GameChoiceRecord[]): Choice[] {
  const chosen = new Set(history.map((h) => h.choiceId));
  return choices.filter((c) => {
    if (c.requiresAnyChoice?.length && !c.requiresAnyChoice.some((id) => chosen.has(id))) {
      return false;
    }
    if (c.hideIfAnyChoice?.length && c.hideIfAnyChoice.some((id) => chosen.has(id))) {
      return false;
    }
    return true;
  });
}

interface Props {
  identity: Identity;
  node: StoryNode;
  attributes: Attributes;
  choiceHistory: GameChoiceRecord[];
  stepIndex: number;
  totalSteps: number;
  onChoice: (choice: Choice) => void;
}

export function StoryScreen({
  identity,
  node,
  attributes,
  choiceHistory,
  stepIndex,
  totalSteps,
  onChoice,
}: Props) {
  const visibleChoices = filterChoices(node.choices, choiceHistory);

  return (
    <section className="screen story-screen">
      <header className="story-header">
        <div className="story-meta">
          <span className="story-identity" style={{ color: identity.color }}>
            {identity.emoji} {identity.name}
          </span>
          {node.age != null && <span className="story-age">{node.age} 岁</span>}
        </div>
        <div className="story-progress">
          <div
            className="story-progress-fill"
            style={{ width: `${((stepIndex + 1) / totalSteps) * 100}%` }}
          />
        </div>
        <span className="story-step">
          节点 {stepIndex + 1} / {totalSteps}
        </span>
      </header>

      <AttributeBars attributes={attributes} compact />

      <article className="story-card">
        {node.flavor && <p className="story-flavor">{node.flavor}</p>}
        <h3 className="story-title">{node.title}</h3>
        {node.description && <p className="story-desc">{node.description}</p>}
      </article>

      <div className="choice-list">
        {visibleChoices.map((c, i) => (
          <button
            key={c.id}
            type="button"
            className="choice-btn"
            onClick={() => onChoice(c)}
          >
            <span className="choice-letter">{String.fromCharCode(65 + i)}</span>
            <span className="choice-text">{c.text}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

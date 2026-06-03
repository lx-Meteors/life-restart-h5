import type { Identity } from '@/types/game';
import { IDENTITIES } from '@/data';

interface Props {
  onSelect: (identity: Identity) => void;
}

export function IdentitySelect({ onSelect }: Props) {
  return (
    <section className="screen identity-screen">
      <header className="screen-header">
        <h2>选择你的重启开局</h2>
        <p>只能选一个。每条人生线都有 4–5 个关键节点，选项决定分支。</p>
      </header>
      <div className="identity-grid">
        {IDENTITIES.map((item) => (
          <button
            key={item.id}
            type="button"
            className="identity-card"
            style={{ '--card-accent': item.color } as React.CSSProperties}
            onClick={() => onSelect(item)}
          >
            <span className="identity-emoji">{item.emoji}</span>
            <span className="identity-name">{item.name}</span>
            <span className="identity-tagline">{item.tagline}</span>
            <span className="identity-contrast">{item.contrast}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

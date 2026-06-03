import type { Attributes, AttributeKey } from '@/types/game';
import { ATTRIBUTE_LABELS } from '@/engine/attributes';

const ORDER: AttributeKey[] = ['wealth', 'career', 'love', 'happiness'];

const COLORS: Record<AttributeKey, string> = {
  wealth: '#ffd93d',
  career: '#6bcb77',
  love: '#ff6b9d',
  happiness: '#4d96ff',
};

interface Props {
  attributes: Attributes;
  compact?: boolean;
}

export function AttributeBars({ attributes, compact }: Props) {
  return (
    <div className={`attr-bars ${compact ? 'attr-bars--compact' : ''}`}>
      {ORDER.map((key) => (
        <div key={key} className="attr-row">
          <span className="attr-label">{ATTRIBUTE_LABELS[key]}</span>
          <div className="attr-track">
            <div
              className="attr-fill"
              style={{
                width: `${attributes[key]}%`,
                background: COLORS[key],
              }}
            />
          </div>
          <span className="attr-value">{attributes[key]}</span>
        </div>
      ))}
    </div>
  );
}

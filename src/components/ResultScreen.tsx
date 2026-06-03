import { useRef, useState } from 'react';
import type { Attributes, Ending, Identity } from '@/types/game';
import { AttributeBars } from './AttributeBars';
import { capturePosterElement, downloadBlob } from '@/utils/poster';
import { buildShareText, nativeShare } from '@/utils/share';
import { track } from '@/services/analytics';

interface Props {
  identity: Identity;
  ending: Ending;
  attributes: Attributes;
  score: number;
  beatPercent: number;
  summary: string;
  onReplay: () => void;
  onViewOthers: () => void;
}

export function ResultScreen({
  identity,
  ending,
  attributes,
  score,
  beatPercent,
  summary,
  onReplay,
  onViewOthers,
}: Props) {
  const posterRef = useRef<HTMLDivElement>(null);
  const [shareStatus, setShareStatus] = useState<string | null>(null);

  const shareText = buildShareText({
    identityName: identity.name,
    endingTitle: ending.title,
    score,
    beatPercent,
  });

  const handleShare = async () => {
    track('share_click', { endingId: ending.id, score });
    const result = await nativeShare({
      title: '人生重启计划',
      text: shareText,
    });
    if (result === 'shared') setShareStatus('已唤起分享');
    else if (result === 'copied') setShareStatus('文案已复制，去发给好友吧');
    else setShareStatus('分享取消');
    setTimeout(() => setShareStatus(null), 2500);
  };

  const handlePoster = async () => {
    if (!posterRef.current) return;
    const blob = await capturePosterElement(posterRef.current);
    if (blob) {
      downloadBlob(blob, `人生重启-${ending.title}.png`);
      setShareStatus('海报已保存');
    } else {
      setShareStatus('海报生成失败，请重试');
    }
    setTimeout(() => setShareStatus(null), 2500);
  };

  return (
    <section className="screen result-screen">
      <div ref={posterRef} className="result-poster">
        <p className="result-poster-label">人生重启结果</p>
        <div className="result-ending-emoji">{ending.emoji}</div>
        <h2 className="result-ending-title">{ending.title}</h2>
        <p className="result-identity">开局：{identity.name}</p>
        <p className="result-score">
          人生评分 <strong>{score}</strong> 分
        </p>
        <p className="result-beat">击败了全国 {beatPercent}% 的重启者</p>
        <AttributeBars attributes={attributes} />
        <p className="result-summary">{summary}</p>
      </div>

      {shareStatus && <p className="toast-inline">{shareStatus}</p>}

      <div className="result-actions">
        <button type="button" className="btn btn-primary" onClick={handleShare}>
          分享好友
        </button>
        <button type="button" className="btn btn-secondary" onClick={handlePoster}>
          保存结果海报
        </button>
        <button type="button" className="btn btn-ghost" onClick={onReplay}>
          再来一次
        </button>
        <button type="button" className="btn btn-ghost" onClick={onViewOthers}>
          查看其他人生
        </button>
      </div>
    </section>
  );
}

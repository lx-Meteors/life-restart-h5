interface Props {
  onStart: () => void;
}

export function SplashScreen({ onStart }: Props) {
  return (
    <section className="screen splash-screen">
      <div className="splash-glow" aria-hidden />
      <p className="splash-badge">H5 · 人生模拟</p>
      <h1 className="splash-title">
        人生重启计划
      </h1>
      <p className="splash-subtitle">如果人生重来一次，你会活成什么样？</p>
      <ul className="splash-tags">
        <li>高反差</li>
        <li>高爽感</li>
        <li>你的选择 · 你的结局</li>
      </ul>
      <p className="splash-hint">
        家道中落、屌丝逆袭、天胡开局……每条线都会根据你的选择走向不同分支。
      </p>
      <button type="button" className="btn btn-primary btn-pulse" onClick={onStart}>
        开始重启人生
      </button>
    </section>
  );
}

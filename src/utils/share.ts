export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  }
}

export function buildShareText(params: {
  identityName: string;
  endingTitle: string;
  score: number;
  beatPercent: number;
}): string {
  return `【人生重启结果】
开局：${params.identityName}
结局：${params.endingTitle}
人生评分：${params.score}分
击败了全国${params.beatPercent}%的重启者
——如果人生重来一次，你会活成什么样？`;
}

export async function nativeShare(params: {
  title: string;
  text: string;
  url?: string;
}): Promise<'shared' | 'copied' | 'failed'> {
  const url = params.url ?? window.location.href;
  if (navigator.share) {
    try {
      await navigator.share({ title: params.title, text: params.text, url });
      return 'shared';
    } catch (e) {
      if ((e as Error).name === 'AbortError') return 'failed';
    }
  }
  const ok = await copyText(`${params.text}\n${url}`);
  return ok ? 'copied' : 'failed';
}

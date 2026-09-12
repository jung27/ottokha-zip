import type { GameState } from "../types";

export function generateShareUrl(game: GameState, riskCount: number) {
  const payload = {
    c: game.contract, // 'monthly' | 'jeonse'
    h: game.house, // 'oneroom' | 'villa' 등
    r: riskCount, // 위험 선택 개수
    t: Date.now(),
  };

  // URL-safe Base64 인코딩
  const encoded = btoa(encodeURIComponent(JSON.stringify(payload)));

  // 백엔드 공유 진입점 URL
  return `${window.location.origin}/api/share?d=${encoded}`;
}

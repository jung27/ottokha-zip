import { NextButton } from "../components/Journal";
import { scenePhotos } from "../scenePhotos";
import type { Home } from "../types";

export function EndingScene({
  home,
  onReview,
}: {
  home: Home;
  onReview: () => void;
}) {
  return (
    <section className="mx-auto max-w-[1020px] py-6 text-center" aria-label="첫 집 계약 완료">
      <p className="mb-2 text-sm font-semibold text-accent">나의 첫 {home.name}</p>
      <h1 className="mb-6">수많은 우여곡절 끝에 집을 구했다!</h1>
      <div className="relative overflow-hidden rounded-2xl bg-soft">
        <img className="aspect-video w-full object-cover" src={scenePhotos[home.id].src} alt={scenePhotos[home.id].description} />
        <svg className="absolute right-[8%] bottom-0 h-[88%] max-w-[45%] drop-shadow-lg" viewBox="0 0 240 360" role="img" aria-label="새 집 앞에서 열쇠를 들고 두 팔을 올리며 기뻐하는 사람">
          <path d="M89 252 83 350M145 252l17 98" stroke="#273e3a" strokeWidth="32" strokeLinecap="round" />
          <path d="m94 150-37-34-23-56m109 90 42-39 23-59" fill="none" stroke="#f0d5b5" strokeWidth="24" strokeLinecap="round" />
          <path d="m92 149-33-28m85 28 34-32" stroke="#76a28b" strokeWidth="33" strokeLinecap="round" />
          <path d="M78 148q42-22 80 0l9 109q-48 16-99 0Z" fill="#76a28b" />
          <path d="M106 120v23q12 14 25 0v-23" fill="#e9bb96" />
          <ellipse cx="119" cy="88" rx="40" ry="47" fill="#f0d5b5" />
          <path d="M78 83q-10-53 40-55 55 0 43 58-25-5-41-29-9 23-42 26" fill="#343631" />
          <path d="M97 89q6-8 12 0m21 0q6-8 12 0" fill="none" stroke="#343631" strokeWidth="4" strokeLinecap="round" />
          <path d="M105 106q15 20 29 0" fill="white" stroke="#b76a58" strokeWidth="3" />
          <circle cx="203" cy="31" r="13" fill="none" stroke="#edc360" strokeWidth="6" />
          <path d="m203 45 1 27h12m-12-9h10" fill="none" stroke="#edc360" strokeWidth="6" />
          <path d="m22 18 5 8m39-12-3 10m102-11-4 10m62 82 9 2" stroke="#f7e0a6" strokeWidth="5" strokeLinecap="round" />
        </svg>
      </div>
      <p className="my-5 text-muted">처음부터 마지막까지, 내가 고른 선택을 돌아보자.</p>
      <NextButton onClick={onReview}>내 계약 돌아보기</NextButton>
    </section>
  );
}

import { useState } from "react";
import { NextButton } from "../components/Journal";
import { StoryModal } from "../components/StoryModal";
import { hasRequiredItems, money } from "../data";
import { calculateMortgage, registryCase, registryFinding } from "../registry";
import type { Contract, Home, PlayViewProps } from "../types";

export function RegistryView({
  step,
  selected,
  answered,
  onToggle,
  onSubmit,
  onNext,
  home,
  contract,
}: PlayViewProps & { home: Home; contract: Contract }) {
  const [detail, setDetail] = useState<string | null>(null);
  const [market, setMarket] = useState(String(registryCase.marketValue));
  const [claim, setClaim] = useState(String(registryCase.maximumClaim));
  const [rate, setRate] = useState(String(registryCase.claimRate));
  const [deposit, setDeposit] = useState(
    String(contract === "jeonse" ? home.jeonse : home.deposit),
  );
  const point = step.items?.find((item) => item.id === detail);
  const calculation = [market, claim, rate, deposit].every((value) => value.trim())
    ? calculateMortgage(Number(market), Number(claim), Number(rate), Number(deposit))
    : null;
  const ready = hasRequiredItems(step, selected);
  const values: Record<string, string> = {
    owner: home.id === "officetel" ? "○○신탁 주식회사" : "박○○",
    "transfer-date": "2025년 12월 3일",
    trust: home.id === "officetel" ? "신탁 · 신탁원부 확인 필요" : "신탁 등기 없음",
    "mortgage-date": registryCase.mortgageDate,
    "maximum-claim": money(registryCase.maximumClaim),
    creditor: "○○은행",
  };
  function inspect(id: string) {
    if (!answered && !selected.includes(id)) onToggle(id);
    setDetail(id);
  }
  return (
    <section className="mx-auto max-w-[1000px] py-5" aria-label="등기부 읽기 미니게임">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-accent">잔금 직전 · 등기부 읽기</p>
          <h1 className="mt-2 text-2xl">달라진 권리를 찾아보자</h1>
        </div>
        <p className="text-sm text-muted">오늘은 {registryCase.balanceDate}</p>
      </div>
      <p className="mb-4 text-sm">{step.beats[0].text} 확인하고 싶은 항목을 누르면 설명이 열린다.</p>
      <article className="rounded-xl border-2 border-line bg-surface p-6 shadow-panel max-[600px]:p-3" aria-label="가상 등기사항전부증명서">
        <header className="border-b-2 border-ink pb-5 text-center">
          <p className="text-xs text-muted">열람용 · 시뮬레이터의 가상 서류</p>
          <h2 className="my-2 text-xl tracking-widest">등기사항전부증명서</h2>
          <p className="text-sm">[건물] ○○동 가상 매물 · {home.name}</p>
          <p className="mt-2 text-xs text-muted">계약서 작성일: 2026년 2월 13일 · 열람일: {registryCase.balanceDate}</p>
        </header>
        {(["갑구", "을구"] as const).map((section, sectionIndex) => (
          <section key={section} className="mt-5" aria-label={section}>
            <h3 className="border border-line bg-soft px-4 py-3">{section} · {sectionIndex === 0 ? "소유권에 관한 사항" : "소유권 이외의 권리에 관한 사항"}</h3>
            <div className="grid grid-cols-3 border-l border-line max-[600px]:grid-cols-1">
              {step.items?.slice(sectionIndex * 3, sectionIndex * 3 + 3).map((item) => (
                <button key={item.id} onClick={() => inspect(item.id)} aria-label={item.title}
                  aria-pressed={selected.includes(item.id)}
                  className="flex min-h-28 flex-col items-start justify-center gap-3 border-r border-b border-line p-4 text-left hover:bg-soft aria-pressed:bg-accent-soft max-[600px]:min-h-20 max-[600px]:gap-1">
                  <span className="text-xs text-muted">{item.title} {selected.includes(item.id) && <span aria-label="확인함">✓</span>}</span>
                  <strong className="text-sm">{values[item.id]}</strong>
                </button>
              ))}
            </div>
          </section>
        ))}
        <p className="mt-5 text-right text-xs text-muted">— 이하여백 —</p>
      </article>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-soft p-4">
        <p className="max-w-[650px] text-sm" role="status">
          {answered ? "위험을 확인했다. 다음 장면에서 입주 절차를 계속 연습한다."
            : ready ? "계약 후 새로 설정된 근저당을 찾았다. 확인한 내용을 정리하자."
              : "계약할 때와 달라진 권리가 있다. 날짜를 비교해보자."}
        </p>
        <NextButton onClick={answered ? onNext : onSubmit} disabled={!ready}>
          {answered ? "다음 장면" : "등기부 확인 마치기"}
        </NextButton>
      </div>
      {point && (
        <StoryModal title={point.id === "mortgage-date" ? registryFinding.title : point.title} onClose={() => setDetail(null)}>
          {point.id === "mortgage-date" ? (
            <div className="rounded-xl border border-risk-line bg-risk-bg p-4 text-sm text-risk">
              <p className="mb-3 font-bold">설정일 {registryCase.mortgageDate} · 잔금일 바로 전날</p>
              <p>{registryFinding.text}</p>
              <p className="mt-3">{registryFinding.advice}</p>
            </div>
          ) : <p className="mb-4 text-sm">{point.description}</p>}
          {point.id === "maximum-claim" && (
            <div>
              <p className="mb-3 text-xs text-muted">아래 금액은 계산 연습을 위한 예시다. 단위는 만 원이다.</p>
              <div className="grid grid-cols-2 gap-3 max-[400px]:grid-cols-1">
                {[
                  { label: "매매 시세 (만 원)", value: market, set: setMarket, min: 1 },
                  { label: "채권최고액 (만 원)", value: claim, set: setClaim, min: 0 },
                  { label: "설정 비율 (%)", value: rate, set: setRate, min: 110, max: 130 },
                  { label: "내 보증금 (만 원)", value: deposit, set: setDeposit, min: 0 },
                ].map((field) => (
                  <label key={field.label} className="grid gap-1 text-xs text-muted">{field.label}
                    <input className="w-full rounded-lg border border-line bg-surface p-2 text-ink" type="number" min={field.min} max={field.max} value={field.value} onChange={(event) => field.set(event.target.value)} />
                  </label>
                ))}
              </div>
              <div className="my-4 rounded-xl bg-accent-soft p-4 text-sm" role="status">
                {calculation ? <>
                  <p>추정 대출액: <strong>{calculation.estimatedLoan.toLocaleString("ko-KR", { maximumFractionDigits: 1 })}만 원</strong></p>
                  <p className="text-xs text-muted">채권최고액 ÷ (설정 비율 ÷ 100)</p>
                  <p className="mt-2">시세 대비 채권최고액: {calculation.claimRatio.toFixed(1)}%</p>
                  <p>시세 대비 채권최고액 + 내 보증금: {calculation.combinedRatio.toFixed(1)}%</p>
                </> : <p>금액을 확인하고 설정 비율을 110~130% 사이로 입력하세요.</p>}
              </div>
            </div>
          )}
          <div className="mt-5 flex justify-end"><NextButton onClick={() => setDetail(null)}>서류로 돌아가기</NextButton></div>
        </StoryModal>
      )}
    </section>
  );
}

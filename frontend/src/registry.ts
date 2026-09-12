import type { CheckItem, Feedback } from "./types";

export const registryCase = {
  balanceDate: "2026년 2월 27일",
  mortgageDate: "2026년 2월 26일",
  marketValue: 20000,
  maximumClaim: 12000,
  claimRate: 120,
};

export const registryPoints: CheckItem[] = [
  ["owner", "소유자 이름", "계약서에 서명한 사람과 같은지 대조. 잔금일에 바뀌어 있으면 동시진행 신호"],
  ["transfer-date", "소유권 이전 날짜", "최근 이전이면 경계. 무자본 명의자에게 넘어가는 중일 수 있다"],
  ["trust", "신탁 표기", "있으면 실소유자가 신탁사. 신탁사 동의 없는 계약은 무효"],
  ["mortgage-date", "근저당권 설정 날짜", "어제 날짜 = 계약 이후 신규 설정. 이 게임의 정답 포인트"],
  ["maximum-claim", "채권최고액", "실제 대출액의 110~130%. 시세 대비 과다한지 계산해본다"],
  ["creditor", "근저당권자", "은행인지 개인인지. 개인 근저당은 급전 신호"],
].map(([id, title, description]) => ({
  id,
  title,
  description,
  signal: description,
  advice: "",
  consequence: description,
}));

export const registryFinding: Feedback = {
  title: "계약 후 새 근저당을 발견했다",
  text: "근저당권 설정 날짜가 어제다. 계약한 뒤 새로운 권리가 생겼다. 이 상황에서는 잔금을 보내지 않고 계약을 해지해야 한다.",
  advice: "새로 발급한 등기부와 계약서를 보관하고, 계약 해지와 이미 지급한 돈의 반환 절차를 확인한다.",
};

// 금액은 만 원 단위. 등기부 읽기 연습에 사용하는 계산이다.
export function calculateMortgage(
  market: number,
  claim: number,
  rate: number,
  deposit: number,
) {
  if (
    ![market, claim, rate, deposit].every(Number.isFinite) ||
    market <= 0 || claim < 0 || deposit < 0 || rate < 110 || rate > 130
  )
    return null;
  return {
    estimatedLoan: claim / (rate / 100),
    claimRatio: (claim / market) * 100,
    combinedRatio: ((claim + deposit) / market) * 100,
  };
}

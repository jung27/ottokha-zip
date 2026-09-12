export type Contract = "monthly" | "jeonse";
export type HouseId =
  | "oneroom"
  | "officetel"
  | "villa"
  | "rooftop"
  | "basement"
  | "goshiwon";
export type Status = "checked" | "risk";
export type Stage = 1 | 2 | 3 | 4 | 5 | 6;
export type Page =
  | "home"
  | "prologue"
  | "contract"
  | "tutorial"
  | "house"
  | "play"
  | "ending";
export type ModalKind = "new" | "appendix" | null;
export type Background =
  | "home"
  | "app"
  | "listing"
  | "message"
  | "room"
  | "street"
  | "office"
  | "agent"
  | "lease"
  | "moving"
  | "rain";
export type StoryBeat = {
  text: string;
  speaker?: string;
  background?: Background;
};

export type Home = {
  id: HouseId;
  name: string;
  sub: string;
  icon: IconName;
  description: string;
  area: string;
  deposit: number;
  rent: number;
  maintenance: number;
  jeonse: number | null;
  turningPoint: string;
};
export type Feedback = {
  title: string;
  text: string;
  advice: string;
  detail?: string;
  source?: string;
};
export type Choice = {
  id: string;
  label: string;
  status: Status;
  feedback: Feedback;
  consequence?: string;
  disabledReason?: string;
};
export type CheckItem = {
  id: string;
  title: string;
  description: string;
  signal: string;
  consequence: string;
  advice: string;
  extra?: boolean;
};
export type Step = {
  id: string;
  stage: Stage;
  kind: "choice" | "inspection" | "checklist" | "info" | "recap";
  eyebrow: string;
  title: string;
  beats: StoryBeat[];
  background: Background;
  choices?: Choice[];
  items?: CheckItem[];
  notice?: Feedback;
  explanation?: Feedback;
  requireAll?: boolean;
  document?: "registry" | "lease" | "message";
};
export type Checkpoint = {
  id: string;
  stepId: string;
  stage: Stage;
  status: Status;
  title: string;
  choice: string;
  consequence: string;
  advice: string;
  category: "decision" | "inspection" | "clause" | "check";
};
export type PlayViewProps = {
  step: Step;
  selected: string[];
  answered: boolean;
  notes: Checkpoint[];
  feedback: Checkpoint[];
  onChoose: (id: string) => void;
  onToggle: (id: string) => void;
  onSubmit: () => void;
  onNext: () => void;
  onRetry: () => void;
};
export type GameState = {
  version: 3;
  page: Page;
  prologue: number;
  contract: Contract;
  house: HouseId;
  cursor: string;
  answers: Record<string, string[]>;
  drafts: Record<string, string[]>;
};
export type Ending = {
  id: "complete";
  symbol: string;
  title: string;
  subtitle: string;
  text: string;
  reasons: string[];
};
export type IconName =
  | "home"
  | "arrow"
  | "back"
  | "book"
  | "map"
  | "help"
  | "pin"
  | "clock"
  | "check"
  | "close"
  | "key"
  | "eye"
  | "file"
  | "chat"
  | "building"
  | "roof"
  | "stairs"
  | "people"
  | "window"
  | "water"
  | "door"
  | "info"
  | "spark"
  | "flag"
  | "external"
  | "reset";

export const STORAGE_KEY = "eotteokhajip-story-v3";
export const STAGES: {
  id: Stage;
  title: string;
  description: string;
  icon: IconName;
}[] = [
  { id: 1, title: "매물 탐색", description: "사진과 조건 사이", icon: "map" },
  { id: 2, title: "임장", description: "직접 보고, 발견하기", icon: "eye" },
  { id: 3, title: "가계약금", description: "돈을 보내기 전에", icon: "key" },
  { id: 4, title: "계약서", description: "약속을 문장으로", icon: "file" },
  { id: 5, title: "잔금·입주", description: "내 집이 되는 하루", icon: "home" },
  {
    id: 6,
    title: "엔딩",
    description: "선택이 돌아오는 시간",
    icon: "flag",
  },
];
export const STATUS_LABELS: Record<Status, string> = {
  checked: "확인함",
  risk: "다시 확인",
};

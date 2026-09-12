export const routes = [
  "home",
  "choose",
  "explore",
  "talk",
  "document",
] as const;
export type Scene = (typeof routes)[number];
export type Contract = "monthly" | "jeonse";
export type Inspection = "window" | "sink" | "door";
export type DocumentTab = "address" | "owner" | "rights";

export type ModalKind =
  | "guide"
  | "journey"
  | "notebook"
  | "document-guide"
  | "new"
  | "explore-warning"
  | "send-warning"
  | "ending"
  | null;

export type Note = {
  id: string;
  title: string;
  text: string;
};

export type GameState = {
  started: boolean;
  contract: Contract;
  house: number;
  scene: Scene;
  notes: Note[];
  inspected: Inspection[];
  talked: string[];
  docTab: DocumentTab;
  ownerChecked: boolean;
  completed: boolean;
};

export type Home = {
  name: string;
  sub: string;
  icon: IconName;
  desc: string;
  area: string;
  rent: string;
  deposit: string;
  hint: string;
  inspect: string;
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

export const STORAGE_KEY = "eotteokhajip-react-v1";
export const inspectionKeys: Inspection[] = ["window", "sink", "door"];

export const labels: Record<Scene, string> = {
  home: "홈",
  choose: "집 선택",
  explore: "방 탐색",
  talk: "중개사 대화",
  document: "서류 확인",
};

export const sourceUrl =
  "https://www.molit.go.kr/portal/common/download/DownloadMltm2.jsp?FileName=%EC%A0%84%EC%84%B8%EA%B3%84%EC%95%BD+%EC%9C%A0%EC%9D%98%EC%82%AC%ED%95%AD+%EB%A6%AC%ED%94%8C%EB%A0%9B.pdf&FilePath=portal%2FDextUpload%2F202301%2F20230113_090421_309.pdf";

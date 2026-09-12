import { useState, type ReactNode } from "react";
import { dictionary } from "../data";
import type { Background } from "../types";
import { Icon } from "./Icon";

const backgrounds = {
  home: { description: "집에서 고민하고 있는 사진", specified: true },
  app: { description: "부동산 앱을 보고 있는 사진", specified: true },
  office: { description: "부동산 사진", specified: true },
  agent: { description: "중개사 사진", specified: true },
  lease: { description: "계약서 사진", specified: true },
  room: { description: "창문·욕실·싱크대가 보이는 임장 중인 집 내부", specified: false },
  street: { description: "집을 알아보며 걷는 주택가 골목", specified: false },
  moving: { description: "이삿짐 상자가 놓인 입주 당일의 방", specified: false },
  rain: { description: "빗물이 흐르는 창문과 장마철의 방 안", specified: false },
};

// 기존 사이드 패널 자리에 장면과 무관하게 열람할 수 있는 용어 사전을 둔다.
function Dictionary({ context }: { context: string }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string | null>(null);
  const search = query.trim();
  const relevant = dictionary.filter((entry) =>
    [entry.term, ...(entry.aliases ?? [])].some((term) => context.includes(term)),
  );
  const entries = search
    ? dictionary.filter((entry) =>
        [entry.term, entry.meaning, ...(entry.aliases ?? [])]
          .join(" ").includes(search),
      ).sort((a, b) => Number(b.term === search) - Number(a.term === search) || Number(b.term.includes(search)) - Number(a.term.includes(search)))
    : relevant.length ? relevant : dictionary.slice(0, 5);
  const selected = entries.find((entry) => entry.term === active) ?? entries[0];
  return (
    <aside className="dictionary" aria-label="용어 사전">
      <details className="dictionary-disclosure" open>
        <summary><Icon name="book" /><span>사전</span><Icon name="arrow" /></summary>
        <div className="dictionary-body">
          <label className="dictionary-search">
            <span className="sr-only">용어 검색</span>
            <input type="search" placeholder="궁금한 단어 찾기" value={query}
              onChange={(event) => { setQuery(event.target.value); setActive(null); }} />
          </label>
          <p className="dictionary-caption">{query.trim() ? "검색 결과" : "이 장면의 단어"}</p>
          <div className="dictionary-terms">
            {entries.map((entry) => (
              <button key={entry.term} aria-pressed={selected?.term === entry.term}
                onClick={() => setActive(entry.term)}>{entry.term}</button>
            ))}
          </div>
          {selected ? (
            <div className="dictionary-definition" aria-live="polite">
              <h2>{selected.term}</h2>
              <p>{selected.meaning}</p>
            </div>
          ) : <p className="dictionary-empty">찾는 단어가 없습니다.</p>}
        </div>
      </details>
    </aside>
  );
}

export function SceneFrame({ background, context = "", scene, children, className = "" }: {
  background: Background;
  context?: string;
  scene?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const photo = backgrounds[background];
  return (
    <section className={"adventure-scene " + className}>
      <div className={"scene-visual " + (scene ? "has-content" : "")}>
        <div className="background-placeholder" role="img" aria-label={photo.description}>
          <span>{photo.specified ? "시나리오 지정 이미지" : "배경 이미지 제안"}</span>
          <p>{photo.description}</p>
        </div>
        <div className="scene-content">{scene}</div>
        <Dictionary context={context} />
      </div>
      {children}
    </section>
  );
}

export function DialogueBox({ speaker, text, children, actions }: {
  speaker?: string;
  text?: string;
  children?: ReactNode;
  actions: ReactNode;
}) {
  return (
    <div className="dialogue-box">
      {speaker && <div className="speaker-name">{speaker}</div>}
      {text && <p key={text} className="dialogue-text view-enter" aria-live="polite">{text}</p>}
      {children}
      <div className="dialogue-actions">{actions}</div>
    </div>
  );
}

export function NextButton({ onClick, children = "다음" }: {
  onClick: () => void;
  children?: ReactNode;
}) {
  return <button className="primary-button" onClick={onClick}>{children}<Icon name="arrow" /></button>;
}

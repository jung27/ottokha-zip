import { useState, type ReactNode } from "react";
import { dictionary } from "../data";
import type { Background } from "../types";
import { Icon } from "./Icon";
import { ScenePopup } from "./StoryModal";

const backgrounds: Record<
  Background,
  { description: string; specified: boolean }
> = {
  home: { description: "부동산 앱을 보고 있는 사진", specified: true },
  app: { description: "부동산 앱을 보고 있는 사진", specified: true },
  listing: { description: "매물 문의창이 떠 있는 사진", specified: true },
  message: {
    description: "화면에 메시지를 주고받은 텍스트의 사진",
    specified: true,
  },
  office: { description: "부동산 사진, 중개사 검은 실루엣", specified: true },
  agent: { description: "중개사 이미지", specified: true },
  lease: { description: "계약서 사진", specified: true },
  moving: { description: "입주하는 이미지", specified: true },
  room: {
    description: "선택한 집의 창문·욕실·싱크대가 보이는 내부",
    specified: false,
  },
  street: { description: "집을 알아보며 걷는 주택가 골목", specified: false },
  rain: {
    description: "빗물이 흐르는 창문과 장마철의 방 안",
    specified: false,
  },
};

function Dictionary({
  context,
  onClose,
}: {
  context: string;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string | null>(null);
  const search = query.trim();
  const relevant = dictionary.filter((entry) =>
    [entry.term, ...(entry.aliases ?? [])].some((term) =>
      context.includes(term),
    ),
  );
  const entries = search
    ? dictionary
        .filter((entry) =>
          [entry.term, entry.meaning, ...(entry.aliases ?? [])]
            .join(" ")
            .includes(search),
        )
        .sort(
          (a, b) =>
            Number(b.term === search) - Number(a.term === search) ||
            Number(b.term.includes(search)) - Number(a.term.includes(search)),
        )
    : relevant.length
      ? relevant
      : dictionary;
  const selected = entries.find((entry) => entry.term === active) ?? entries[0];
  return (
    <ScenePopup
      title="용어 사전"
      onClose={onClose}
      className="dictionary-popup"
    >
      <label className="dictionary-search">
        <span className="sr-only">용어 검색</span>
        <input
          autoFocus
          type="search"
          placeholder="궁금한 단어를 찾아보세요"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(null);
          }}
        />
      </label>
      <p className="dictionary-caption">
        {search
          ? "검색 결과"
          : relevant.length
            ? "이 장면의 단어"
            : "계약 용어"}
      </p>
      <div className="dictionary-terms">
        {entries.map((entry) => (
          <button
            key={entry.term}
            aria-pressed={selected?.term === entry.term}
            onClick={() => setActive(entry.term)}
          >
            {entry.term}
          </button>
        ))}
      </div>
      {selected ? (
        <div className="dictionary-definition" aria-live="polite">
          <h3>{selected.term}</h3>
          <p>{selected.meaning}</p>
        </div>
      ) : (
        <p className="dictionary-empty">찾는 단어가 없습니다.</p>
      )}
    </ScenePopup>
  );
}

export function SceneFrame({
  background,
  context = "",
  scene,
  overlay,
  children,
  className = "",
}: {
  background: Background;
  context?: string;
  scene?: ReactNode;
  overlay?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const [dictionaryOpen, setDictionaryOpen] = useState(false);
  const photo = backgrounds[background];
  const blocked = !!overlay || dictionaryOpen;
  return (
    <section
      className={"adventure-scene " + className}
      aria-label="이야기 장면"
    >
      <div className={"scene-visual " + (scene ? "has-content" : "")}>
        <div className="scene-base" inert={blocked}>
          <div
            className="background-placeholder"
            role="img"
            aria-label={photo.description}
          >
            <Icon name="window" />
            <span>{photo.specified ? "시나리오 이미지" : "이미지 제안"}</span>
            <p>{photo.description}</p>
          </div>
          <div className="scene-content">{scene}</div>
          <button
            className="dictionary-trigger"
            onClick={() => setDictionaryOpen(true)}
            aria-label="용어 사전 열기"
            aria-expanded={dictionaryOpen}
          >
            <Icon name="book" />
            <span>사전</span>
          </button>
        </div>
        {overlay}
        {dictionaryOpen && !overlay && (
          <Dictionary
            context={context}
            onClose={() => setDictionaryOpen(false)}
          />
        )}
      </div>
      <div className="dialogue-slot" inert={blocked}>
        {children}
      </div>
    </section>
  );
}

export function DialogueBox({
  speaker,
  text,
  children,
  actions,
}: {
  speaker?: string;
  text?: string;
  children?: ReactNode;
  actions: ReactNode;
}) {
  return (
    <div className="dialogue-box">
      <div className="speaker-row">
        {speaker && (
          <span className="speaker-name">
            <span className="speaker-dot" />
            {speaker}
          </span>
        )}
      </div>
      <div className="dialogue-body" key={text}>
        {text && (
          <p className="dialogue-text view-enter" aria-live="polite">
            {text}
          </p>
        )}
        {children}
      </div>
      <div className="dialogue-actions">{actions}</div>
    </div>
  );
}

export function NextButton({
  onClick,
  children = "다음",
  disabled = false,
}: {
  onClick: () => void;
  children?: ReactNode;
  disabled?: boolean;
}) {
  return (
    <button className="primary-button" disabled={disabled} onClick={onClick}>
      {children}
      <Icon name="arrow" />
    </button>
  );
}

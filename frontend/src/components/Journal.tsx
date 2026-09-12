import {
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import housingAppImage from "../assets/housing-app.png";
import listingInquiryImage from "../assets/listing-inquiry.png";
import brokerMessageImage from "../assets/broker-message.png";
import { dictionary } from "../data";
import type { Background } from "../types";
import { Icon } from "./Icon";
import { ScenePopup } from "./StoryModal";

type ScenePhoto = { description: string; specified: boolean; src?: string };
const backgrounds: Record<Background, ScenePhoto> = {
  home: {
    description: "부동산 앱을 보고 있는 사진",
    specified: true,
    src: housingAppImage,
  },
  app: {
    description: "부동산 앱을 보고 있는 사진",
    specified: true,
    src: housingAppImage,
  },
  listing: {
    description: "매물 문의창이 떠 있는 사진",
    specified: true,
    src: listingInquiryImage,
  },
  message: {
    description: "화면에 메시지를 주고받은 텍스트의 사진",
    specified: true,
    src: brokerMessageImage,
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

// 디코딩한 이미지를 보관해 장면이 바뀌어도 다시 준비하는 빈 프레임이 생기지 않게 한다.
const sceneImages = new Map<
  string,
  {
    image: HTMLImageElement;
    ready: Promise<void>;
    decoded: boolean;
  }
>();
function prepareSceneImage(src: string) {
  const cached = sceneImages.get(src);
  if (cached) return cached.ready;
  const image = new Image();
  image.src = src;
  const entry = {
    image,
    decoded: false,
    ready: image
      .decode()
      .then(() => {
        entry.decoded = true;
      })
      .catch((error: unknown) => {
        sceneImages.delete(src);
        throw error;
      }),
  };
  sceneImages.set(src, entry);
  return entry.ready;
}

export function SceneImagePreloader() {
  useEffect(() => {
    for (const photo of Object.values(backgrounds)) {
      if (photo.src)
        void prepareSceneImage(photo.src).catch(() => {
          // 해당 장면에서 다시 시도하고, 실패하면 기존 사진 안내를 표시한다.
        });
    }
  }, []);
  return null;
}

function SceneBackground({ photo }: { photo: ScenePhoto }) {
  const [readyPhoto, setReadyPhoto] = useState<ScenePhoto>(() =>
    photo.src && !sceneImages.get(photo.src)?.decoded
      ? { ...photo, src: undefined }
      : photo,
  );
  useEffect(() => {
    if (!photo.src) return;
    let cancelled = false;
    void prepareSceneImage(photo.src)
      .then(() => {
        if (!cancelled) setReadyPhoto(photo);
      })
      .catch(() => {
        if (!cancelled) setReadyPhoto({ ...photo, src: undefined });
      });
    return () => {
      cancelled = true;
    };
  }, [photo]);
  // 다음 이미지가 준비될 때까지 현재 이미지를 그대로 둔다.
  const visiblePhoto =
    !photo.src || sceneImages.get(photo.src)?.decoded ? photo : readyPhoto;
  return visiblePhoto.src ? (
    <img
      className="scene-image"
      src={visiblePhoto.src}
      alt={visiblePhoto.description}
      decoding="sync"
      draggable={false}
    />
  ) : (
    <div
      className="background-placeholder"
      role="img"
      aria-label={visiblePhoto.description}
    >
      <Icon name="window" />
      <span>{visiblePhoto.specified ? "시나리오 이미지" : "이미지 제안"}</span>
      <p>{visiblePhoto.description}</p>
    </div>
  );
}

const compactSceneQuery = "(max-width: 1100px)";
function subscribeToCompactScene(onChange: () => void) {
  const query = window.matchMedia(compactSceneQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
function isCompactScene() {
  return window.matchMedia(compactSceneQuery).matches;
}

function Dictionary({
  context,
  autoFocus = false,
}: {
  context: string;
  autoFocus?: boolean;
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
    <>
      <label className="dictionary-search">
        <span className="sr-only">용어 검색</span>
        <input
          autoFocus={autoFocus}
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
    </>
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
  const compact = useSyncExternalStore(subscribeToCompactScene, isCompactScene);
  const photo = backgrounds[background];
  const blocked = !!overlay || (compact && dictionaryOpen);
  return (
    <section
      className={"adventure-scene " + className}
      aria-label="이야기 장면"
    >
      <div className={"scene-visual " + (scene ? "has-content" : "")}>
        <div className="scene-base" inert={blocked}>
          <SceneBackground photo={photo} />
          <div className="scene-content">{scene}</div>
          {compact && (
            <button
              className="dictionary-trigger"
              onClick={() => setDictionaryOpen(true)}
              aria-label="용어 사전 열기"
              aria-expanded={dictionaryOpen}
            >
              <Icon name="book" />
              <span>사전</span>
            </button>
          )}
        </div>
        {overlay}
        {compact && dictionaryOpen && !overlay && (
          <ScenePopup
            title="용어 사전"
            onClose={() => setDictionaryOpen(false)}
            className="dictionary-popup"
          >
            <Dictionary context={context} autoFocus />
          </ScenePopup>
        )}
      </div>
      <div className="dialogue-slot" inert={blocked}>
        {children}
      </div>
      {!compact && (
        <aside
          className="dictionary-sidebar"
          aria-label="용어 사전"
          inert={!!overlay}
        >
          <div className="dictionary-heading">
            <Icon name="book" />
            <h2>용어 사전</h2>
          </div>
          <div className="dictionary-body">
            <Dictionary context={context} />
          </div>
        </aside>
      )}
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
      {speaker && (
        <div className="speaker-row">
          <span className="speaker-name">{speaker}</span>
        </div>
      )}
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

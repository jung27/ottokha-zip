import {
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { dictionary } from "../data";
import { scenePhotos as backgrounds, sceneImageSizes, type ScenePhoto } from "../scenePhotos";
import type { Background } from "../types";
import { Icon } from "./Icon";
import { ScenePopup } from "./StoryModal";

// 디코딩한 이미지를 보관해 장면이 바뀌어도 다시 준비하는 빈 프레임이 생기지 않게 한다.
const sceneImages = new Map<
  string,
  {
    image: HTMLImageElement;
    ready: Promise<void>;
    decoded: boolean;
  }
>();
function prepareSceneImage(photo: ScenePhoto, priority: "high" | "low" = "low") {
  const src = photo.src!;
  const cached = sceneImages.get(src);
  if (cached) {
    if (priority === "high") cached.image.fetchPriority = "high";
    sceneImages.delete(src);
    sceneImages.set(src, cached);
    return cached.ready;
  }
  const image = new Image();
  image.fetchPriority = priority;
  image.decoding = "async";
  image.sizes = sceneImageSizes;
  image.srcset = photo.srcSet ?? "";
  image.src = src;
  const entry = {
    image,
    decoded: false,
    ready: image
      .decode()
      .then(() => {
        entry.decoded = true;
        // 원본 사진을 모두 메모리에 두지 않고 최근 장면만 보관한다.
        for (const [key, value] of sceneImages) {
          if (sceneImages.size <= 6) break;
          if (key !== src && value.decoded) sceneImages.delete(key);
        }
      })
      .catch((error: unknown) => {
        sceneImages.delete(src);
        throw error;
      }),
  };
  sceneImages.set(src, entry);
  return entry.ready;
}

export function SceneImagePreloader({ backgrounds: upcoming }: { backgrounds: Background[] }) {
  const key = [...new Set(upcoming)].join(",");
  useEffect(() => {
    let cancelled = false;
    // 다음 장면을 순서대로 준비해 현재 사진의 다운로드와 과도하게 경쟁하지 않는다.
    void (async () => {
      for (const name of key.split(",") as Background[]) {
        if (cancelled) break;
        const photo = backgrounds[name];
        if (photo?.src) await prepareSceneImage(photo).catch(() => {});
      }
    })();
    return () => { cancelled = true; };
  }, [key]);
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
    void prepareSceneImage(photo, "high")
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
      className="absolute inset-0 block size-full object-contain object-center"
      src={visiblePhoto.src}
      srcSet={visiblePhoto.srcSet}
      sizes={sceneImageSizes}
      alt={visiblePhoto.description}
      decoding="async"
      fetchPriority="high"
      draggable={false}
    />
  ) : (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center gap-[11px] bg-placeholder p-8 text-center
        text-placeholder-ink [&_svg]:mb-1 [&_svg]:size-[30px] [&_svg]:stroke-1 [&_svg]:opacity-70
        [&>span]:text-[0.6rem] [&>span]:tracking-[0.08em] [&>p]:text-[0.84rem]
        group-data-[has-content=true]/scene:items-start group-data-[has-content=true]/scene:justify-start
        group-data-[has-content=true]/scene:gap-px group-data-[has-content=true]/scene:px-[26px]
        group-data-[has-content=true]/scene:py-[15px] group-data-[has-content=true]/scene:text-left
        group-data-[has-content=true]/scene:[&_svg]:hidden
        group-data-[has-content=true]/scene:[&>span]:text-[0.53rem]
        group-data-[has-content=true]/scene:[&>p]:text-[0.64rem]
        max-[1100px]:group-data-[has-content=true]/scene:[&>p]:pr-20 max-[600px]:gap-2 max-[600px]:px-5
        max-[600px]:py-[26px] max-[600px]:[&>p]:text-[0.75rem] max-[600px]:[&_svg]:size-[25px]
        max-[600px]:group-data-[has-content=true]/scene:p-3
        max-[600px]:group-data-[has-content=true]/scene:[&>p]:text-[0.58rem]`}
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

function Dictionary({ autoFocus = false }: { autoFocus?: boolean }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string | null>(null);
  const search = query.trim();
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
    : dictionary;
  const selected = entries.find((entry) => entry.term === active) ?? entries[0];
  return (
    <>
      <label
        className={`[&_input]:w-full [&_input]:rounded-[9px] [&_input]:border [&_input]:border-line [&_input]:bg-soft
        [&_input]:px-[11px] [&_input]:py-2.5 [&_input]:text-[0.76rem] [&_input]:text-ink`}
      >
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
      <p className="mt-[17px] text-[0.65rem] text-muted max-[600px]:mt-3">
        {search ? "검색 결과" : "전체 계약 용어"}
      </p>
      <div
        data-dictionary-list
        className={`mt-[9px] mb-[17px] flex max-h-[100px] flex-wrap gap-1.5 overflow-y-auto p-0.5 [&_button]:rounded-[7px]
        [&_button]:border [&_button]:border-line [&_button]:px-2 [&_button]:py-[5px] [&_button]:text-[0.68rem]
        [&_button]:text-muted [&_button[aria-pressed=true]]:border-accent
        [&_button[aria-pressed=true]]:bg-accent-soft [&_button[aria-pressed=true]]:text-accent
        group-data-[sidebar]/sidebar:grid group-data-[sidebar]/sidebar:max-h-[220px]
        group-data-[sidebar]/sidebar:grid-cols-[minmax(0,1fr)] group-data-[sidebar]/sidebar:gap-[5px]
        group-data-[sidebar]/sidebar:[&_button]:px-2.5 group-data-[sidebar]/sidebar:[&_button]:py-2
        group-data-[sidebar]/sidebar:[&_button]:text-left group-data-[sidebar]/sidebar:[&_button]:text-[0.73rem]
        group-data-[sidebar]/sidebar:[&_button]:text-ink
        group-data-[sidebar]/sidebar:[&_button[aria-pressed=true]]:text-accent max-[600px]:mb-3
        max-[600px]:max-h-[72px]`}
      >
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
        <div
          className={`border-t border-line pt-3.5 [&_h3]:mb-1.5 [&_h3]:text-[0.87rem] [&_h3]:text-accent [&_p]:text-xs
          [&_p]:leading-[1.85] [&_p]:text-muted group-data-[sidebar]/sidebar:[&_p]:leading-[1.9]
          group-data-[sidebar]/sidebar:[&_p]:text-ink`}
          aria-live="polite"
        >
          <h3>{selected.term}</h3>
          <p>{selected.meaning}</p>
        </div>
      ) : (
        <p className="text-xs leading-[1.85] text-muted">
          찾는 단어가 없습니다.
        </p>
      )}
    </>
  );
}

export function SceneFrame({
  background,
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
      className={
        `mx-auto grid w-[min(100%,calc(var(--scene-width)+264px))] grid-cols-[minmax(0,1fr)_248px]
        grid-rows-[auto_176px] gap-x-4 gap-y-3.5 [--scene-width:clamp(640px,calc((100svh-384px)*16/9),1024px)]
        max-[1100px]:w-[min(100%,var(--scene-width))] max-[1100px]:grid-cols-[minmax(0,1fr)] max-[600px]:w-full
        max-[600px]:gap-2.5 ` + className
      }
      data-scene
      aria-label="이야기 장면"
    >
      <div
        className={`group/scene relative col-start-1 row-start-1 aspect-video min-h-0 min-w-0 w-full overflow-hidden
        rounded-[19px] border border-line bg-placeholder max-[600px]:min-h-60 max-[600px]:rounded-[14px]`}
        data-has-content={!!scene}
      >
        <div className="absolute inset-0" inert={blocked}>
          <SceneBackground photo={photo} />
          <div
            className={`absolute inset-0 overflow-y-auto px-[26px] pt-[63px] pb-[22px] [scrollbar-width:thin] empty:hidden
            has-[>[data-scene-choices]]:flex has-[>[data-scene-choices]]:flex-col
            has-[>[data-scene-choices]]:items-center has-[>[data-scene-choices]]:justify-end
            has-[>[data-scene-choices]]:gap-3.5 has-[>[data-scene-choices]]:overflow-hidden
            has-[>[data-scene-choices]]:px-6 has-[>[data-scene-choices]]:pt-[60px] has-[>[data-scene-choices]]:pb-6
            max-[600px]:px-3 max-[600px]:pt-[57px] max-[600px]:pb-[15px] max-[600px]:has-[>[data-scene-choices]]:gap-2
            max-[600px]:has-[>[data-scene-choices]]:px-2.5 max-[600px]:has-[>[data-scene-choices]]:pt-14
            max-[600px]:has-[>[data-scene-choices]]:pb-2.5`}
          >
            {scene}
          </div>
          {compact && (
            <button
              className={`absolute top-3.5 right-[15px] z-2 flex items-center gap-[7px] rounded-[10px] border border-line bg-surface
                px-3 py-2 text-[0.71rem] text-ink shadow-panel hover:border-accent [&_svg]:size-[15px] [&_svg]:text-accent
                max-[600px]:top-2.5 max-[600px]:right-2.5 max-[600px]:rounded-lg max-[600px]:px-[9px] max-[600px]:py-[7px]
                max-[600px]:text-[0.65rem]`}
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
            dictionary
          >
            <Dictionary autoFocus />
          </ScenePopup>
        )}
      </div>
      <div className="col-start-1 row-start-2 min-h-0 min-w-0" inert={blocked}>
        {children}
      </div>
      {!compact && (
        <aside
          className="group/sidebar col-start-2 row-span-2 row-start-1 flex min-h-0 min-w-0 flex-col overflow-hidden rounded-[18px] border border-line bg-surface"
          data-sidebar
          aria-label="용어 사전"
          inert={!!overlay}
        >
          <div className="flex shrink-0 items-center gap-[9px] px-[18px] pt-5 pb-4 [&>svg]:size-[18px] [&>svg]:text-accent [&_h2]:text-[0.88rem]">
            <Icon name="book" />
            <h2>용어 사전</h2>
          </div>
          <div className="min-h-0 overflow-y-auto px-[18px] pb-5 [scrollbar-width:thin]">
            <Dictionary />
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
    <div
      className={`relative flex h-full min-h-0 flex-col overflow-hidden rounded-[18px] border border-line bg-surface px-6
      pt-[17px] pb-3.5 shadow-panel [&>[data-dialogue-actions]]:mt-2 [&_[data-button=primary]]:min-h-9
      [&_[data-button=primary]]:bg-accent [&_[data-button=primary]]:px-3.5 [&_[data-button=primary]]:py-2
      [&_[data-button=primary]]:text-[0.76rem] [&_[data-button=primary]]:text-accent-ink
      max-[600px]:rounded-[14px] max-[600px]:px-[17px] max-[600px]:pt-3.5 max-[600px]:pb-[13px]`}
    >
      {speaker && (
        <div className="mb-1.5 flex shrink-0 items-center">
          <span className="inline-flex items-center gap-[7px] text-[0.76rem] font-bold text-accent max-[600px]:text-[0.71rem]">
            {speaker}
          </span>
        </div>
      )}
      <div
        className="min-h-0 flex-1 overflow-y-auto pr-[5px] pb-1 [scrollbar-width:thin]"
        key={text}
      >
        {text && (
          <p
            className="animate-reveal text-[0.97rem] leading-[1.95] tracking-[-0.02em] whitespace-pre-line max-[600px]:text-[0.88rem] max-[600px]:leading-[1.9]"
            aria-live="polite"
          >
            {text}
          </p>
        )}
        {children}
      </div>
      <div
        className="mt-3 flex shrink-0 flex-wrap items-center justify-end gap-2.5 empty:mt-0 max-[600px]:mt-2.5"
        data-dialogue-actions
      >
        {actions}
      </div>
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
    <button
      className={`inline-flex min-h-[42px] items-center justify-center gap-[9px] rounded-[10px] px-[18px] py-[11px]
      text-[0.79rem] font-[650] leading-[1.45] whitespace-normal transition-[background,border-color]
      duration-150 ease-[ease] [&_svg]:size-4 [&_svg]:shrink-0 max-[600px]:min-h-10 max-[600px]:px-3.5
      max-[600px]:py-2.5 max-[600px]:text-[0.74rem] border border-mint bg-mint text-[#173d29]
      enabled:hover:border-[#b1dbbf] enabled:hover:bg-[#b1dbbf]`}
      data-button="primary"
      disabled={disabled}
      onClick={onClick}
    >
      {children}
      <Icon name="arrow" />
    </button>
  );
}

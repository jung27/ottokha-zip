import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import roomImage from './assets/room.png';

const iconNodes = {
  home: <><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z"/><path d="M9 21v-8h6v8"/></>,
  arrow: <><path d="M4 12h16m-6-6 6 6-6 6"/></>,
  back: <><path d="M20 12H4m6-6-6 6 6 6"/></>,
  book: <><path d="M4 3h14a2 2 0 0 1 2 2v16H6a2 2 0 0 1-2-2Zm0 14h16M8 3v14"/></>,
  map: <><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3Zm6-3v15m6-12v15"/></>,
  help: <><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 4 2c-1 .7-1.5 1-1.5 3m0 3h.01"/></>,
  pin: <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  check: <><path d="m5 12 4 4L19 6"/></>,
  close: <><path d="m6 6 12 12M6 18 18 6"/></>,
  key: <><circle cx="8" cy="8" r="5"/><path d="m12 12 9 9m-4-4 3-3m-6 0 3-3"/></>,
  eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></>,
  file: <><path d="M14 2H5v20h14V7Zm0 0v6h5M8 12h8m-8 4h6"/></>,
  chat: <><path d="M21 11a8 8 0 0 1-8 8H7l-5 3 2-7a8 8 0 1 1 17-4Z"/><path d="M8 10h8m-8 4h5"/></>,
  building: <><path d="M5 21V3h14v18M2 21h20M9 7h1m4 0h1M9 11h1m4 0h1M9 15h1m4 0h1M10 21v-3h4v3"/></>,
  roof: <><path d="m2 11 10-8 10 8M5 9v12h14V9M9 21v-8h6v8m1-16V2h3v5"/></>,
  stairs: <><path d="M3 4v17h18M3 15h6v-5h6V5h6"/></>,
  people: <><circle cx="9" cy="7" r="3"/><path d="M3 21v-4a6 6 0 0 1 12 0v4m1-17a3 3 0 0 1 0 6m2 4a5 5 0 0 1 3 4v3"/></>,
  window: <><rect x="4" y="3" width="16" height="18" rx="1"/><path d="M12 3v18M4 12h16"/></>,
  water: <><path d="M12 2S5 10 5 15a7 7 0 0 0 14 0c0-5-7-13-7-13Z"/><path d="M9 15a3 3 0 0 0 3 3"/></>,
  door: <><path d="M4 22V2h16v20M8 22V5l9-2v19m-4-9h.01"/></>,
  info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10h.01"/></>,
  spark: <><path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z"/></>,
  flag: <><path d="M5 22V3m0 1c5-4 9 4 15 0v10c-6 4-10-4-15 0"/></>,
  external: <><path d="M14 3h7v7m0-7L10 14m0-11H3v18h18v-7"/></>,
  reset: <><path d="M3 10a9 9 0 1 1 2 8M3 3v7h7"/></>,
};
type IconName = keyof typeof iconNodes;
function Icon({ name, className = '' }: { name: IconName; className?: string }) {
  return <svg className={`icon ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{iconNodes[name]}</svg>;
}

type Home = { name: string; sub: string; icon: IconName; desc: string; area: string; rent: string; deposit: string; hint: string; inspect: string };
const homes = [
 {name:'원룸',sub:'다가구주택',icon:'home',desc:'골목 안, 햇살이 들어오는 작은 방',area:'20㎡ · 2층',rent:'500 / 45',deposit:'8,000',hint:'한 건물 안 여러 가구가 사는 집. 내가 들어갈 방과 건물의 정보를 함께 살펴보자.',inspect:'창틀 아래에 물이 흘렀던 자국이 희미하게 남아 있다.'},
 {name:'오피스텔',sub:'주거용 공간',icon:'building',desc:'역에서 가까운 나만의 공간',area:'24㎡ · 7층',rent:'1,000 / 65',deposit:'12,000',hint:'편리한 시설만큼 관리비도 궁금하다. 포함된 항목을 구체적으로 물어보자.',inspect:'창문은 조금만 열린다. 환기가 잘 되는지 직접 확인해 보고 싶다.'},
 {name:'빌라',sub:'다세대주택',icon:'building',desc:'조용한 동네, 조금 더 넓은 방',area:'32㎡ · 3층',rent:'1,000 / 60',deposit:'11,000',hint:'내가 본 집의 동·호수와 서류에 적힌 동·호수가 같은지 살펴보자.',inspect:'창틀 모서리 벽지에 얼룩이 보인다. 언제 생겼는지 물어봐야겠다.'},
 {name:'옥탑방',sub:'건물의 맨 위',icon:'roof',desc:'계단 끝에서 만나는 하늘',area:'18㎡ · 옥상층',rent:'300 / 35',deposit:'5,000',hint:'풍경 뒤의 생활도 생각해 보자. 여름과 겨울의 실내 환경은 어떨까?',inspect:'창가에 서자 지붕 쪽에서 열기가 느껴진다. 냉난방 상태도 물어봐야겠다.'},
 {name:'반지하',sub:'지면 아래의 공간',icon:'stairs',desc:'낮은 창 너머로 보이는 동네',area:'23㎡ · 반지하',rent:'300 / 30',deposit:'5,500',hint:'채광과 환기, 비가 많이 왔을 때의 상황을 현장에서 확인해 보자.',inspect:'창문 바깥 바닥이 방보다 높다. 비가 많이 오면 물이 어디로 흐를까?'},
 {name:'고시원',sub:'쉐어하우스 포함',icon:'people',desc:'함께 쓰는 공간, 나만의 작은 방',area:'10㎡ · 3층',rent:'100 / 38',deposit:'3,000',hint:'고시원과 쉐어하우스는 계약 성격이 다를 수 있다. 실제 용도와 계약 조건부터 물어보자.',inspect:'창가 너머 공용공간의 소리가 들린다. 창문을 닫아 소음을 비교해 보자.'}
] satisfies Home[];

const routes = ['home', 'choose', 'explore', 'talk', 'document'] as const;
type Scene = (typeof routes)[number];
type Contract = 'monthly' | 'jeonse';
type Inspection = 'window' | 'sink' | 'door';
type DocumentTab = 'address' | 'owner' | 'rights';
type ModalKind = 'guide' | 'journey' | 'notebook' | 'document-guide' | 'new' | 'explore-warning' | 'send-warning' | 'ending' | null;
type Note = { id: string; title: string; text: string };
type GameState = {
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
const labels: Record<Scene, string> = {
  home: '홈', choose: '집 선택', explore: '방 탐색', talk: '중개사 대화', document: '서류 확인',
};
const STORAGE_KEY = 'eotteokhajip-react-v1';
const inspectionKeys: Inspection[] = ['window', 'sink', 'door'];
const makeNewGame = (): GameState => ({
  started: false, contract: 'monthly', house: 0, scene: 'choose', notes: [],
  inspected: [], talked: [], docTab: 'owner', ownerChecked: false, completed: false,
});
const isScene = (value: unknown): value is Scene => routes.some((scene) => scene === value);
const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;
const isNote = (value: unknown): value is Note => isRecord(value) &&
  typeof value.id === 'string' && typeof value.title === 'string' && typeof value.text === 'string';
function currentRoute(): Scene {
  const hash = window.location.hash.slice(1);
  return isScene(hash) ? hash : 'home';
}
function loadGame(): GameState {
  let game = makeNewGame();
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
    if (isRecord(saved) && typeof saved.started === 'boolean' &&
      (saved.contract === 'monthly' || saved.contract === 'jeonse') &&
      typeof saved.house === 'number' && Number.isInteger(saved.house) && saved.house >= 0 && saved.house < homes.length &&
      isScene(saved.scene) && Array.isArray(saved.notes) && saved.notes.every(isNote) &&
      Array.isArray(saved.inspected) && saved.inspected.every((item) => inspectionKeys.some((key) => key === item)) &&
      Array.isArray(saved.talked) && saved.talked.every((item) => typeof item === 'string') &&
      (saved.docTab === 'address' || saved.docTab === 'owner' || saved.docTab === 'rights') &&
      typeof saved.ownerChecked === 'boolean' && typeof saved.completed === 'boolean') {
      game = {
        started: saved.started, contract: saved.contract, house: saved.house, scene: saved.scene,
        notes: saved.notes, inspected: saved.inspected as Inspection[], talked: saved.talked,
        docTab: saved.docTab, ownerChecked: saved.ownerChecked, completed: saved.completed,
      };
    }
  } catch { /* A blocked or invalid save must not prevent playing. */ }
  const route = currentRoute();
  return route === 'home' ? game : { ...game, started: true, scene: route };
}
const inspections: Record<Inspection, { title: string; icon: IconName; narrative: (home: Home) => string; learning: string; note: string }> = {
  window: {
    title: '창문 주변', icon: 'window', narrative: (home) => home.inspect,
    learning: '흔적이 보인다면 언제 생겼는지, 어떻게 보수했는지 물어보고 사진으로 남겨 두자.',
    note: '창문 주변의 상태를 기록했다. 원인과 보수 이력을 중개사에게 물어볼 예정.',
  },
  sink: {
    title: '싱크대', icon: 'water',
    narrative: () => '수도꼭지를 틀어 본다. 물줄기는 일정하고, 잠시 뒤 따뜻한 물이 나온다. 물을 받아 내리니 배수도 잘 된다.',
    learning: '물을 틀어 보는 것에서 한 걸음 더. 온수와 배수도 직접 확인해 보자.',
    note: '찬물·온수를 틀고 배수 상태를 확인했다. 이번 방문에서는 이상을 발견하지 못했다.',
  },
  door: {
    title: '현관과 도어락', icon: 'door',
    narrative: () => '문을 닫고 손잡이를 당겨 본다. 잠금장치가 작동한다. 복도에서 올라오던 발소리는 문을 닫자 작아진다.',
    learning: '문이 잘 잠기는지 직접 확인하고, 닫았을 때 바깥 소리도 들어 보자.',
    note: '현관의 잠금과 문을 닫았을 때의 소음을 확인했다.',
  },
};
const talkItems = [
  {
    id: 'cost', label: '“관리비에는 어떤 항목이 포함되나요?”', title: '매달 나가는 비용',
    reply: (contract: Contract) => contract === 'monthly'
      ? '“관리비는 월 5만 원이고, 공용 청소비와 인터넷이 포함돼요. 전기·가스·수도 요금은 별도예요. 항목을 적어서 드릴게요.”'
      : '“관리비는 월 5만 원이에요. 대출 가능 여부는 이 집의 서류를 가지고 은행에 확인해 보셔야 해요. 지금 확답드리기는 어려워요.”',
    note: (contract: Contract) => contract === 'monthly'
      ? '관리비 5만 원. 공용 청소·인터넷 포함, 전기·가스·수도 별도. 계약 조건에도 같은 내용이 있는지 확인하기.'
      : '관리비 5만 원. 대출 가능 여부는 아직 확인되지 않았다. 서류를 가지고 금융기관에 확인하기.',
  },
  {
    id: 'condition', label: '“창문 주변 상태가 궁금해요. 보수한 적 있나요?”', title: '확답을 받지 못한 보수 이력',
    reply: () => '“지난번에 손을 봤다고 들었는데, 정확한 시기와 원인은 집주인에게 확인해야겠네요. 사진과 보수 이력이 있는지 요청해 볼게요.”',
    note: () => '중개사도 정확한 보수 시기와 원인은 모른다. 집주인의 설명과 기록을 추가로 확인하기.',
  },
  {
    id: 'papers', label: '“계약을 정하기 전에 서류를 먼저 보고 싶어요.”', title: '서류를 요청했다',
    reply: () => '“네, 등기사항증명서를 보여드릴게요. 그리고 집주인 쪽에서 보내온 입금 계좌도 있어요. 한 번 살펴보세요.”',
    note: () => '등기사항증명서와 전달받은 입금 계좌를 함께 살펴보기.',
  },
];
const chapterCards: { number: string; icon: IconName; title: string; description: string; scene: Scene }[] = [
  { number: '01', icon: 'key', title: '어떤 집에서 살고 싶어?', description: '나의 조건으로 고르는 첫 번째 집', scene: 'choose' },
  { number: '02', icon: 'eye', title: '사진에 없던 이야기', description: '직접 둘러보고 발견하는 작은 단서', scene: 'explore' },
  { number: '03', icon: 'file', title: '사인하기 전에', description: '대화와 서류 사이, 나의 선택', scene: 'document' },
];
const documentTabs: { id: DocumentTab; label: string }[] = [
  { id: 'address', label: '표제부 · 집의 정보' },
  { id: 'owner', label: '갑구 · 소유자' },
  { id: 'rights', label: '을구 · 권리관계' },
];
const sourceUrl = 'https://www.molit.go.kr/portal/common/download/DownloadMltm2.jsp?FileName=%EC%A0%84%EC%84%B8%EA%B3%84%EC%95%BD+%EC%9C%A0%EC%9D%98%EC%82%AC%ED%95%AD+%EB%A6%AC%ED%94%8C%EB%A0%9B.pdf&FilePath=portal%2FDextUpload%2F202301%2F20230113_090421_309.pdf';

function StoryModal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    return () => dialog.close();
  }, []);
  return (
    <dialog ref={dialogRef} className="story-modal" aria-labelledby="story-modal-title"
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
      }}>
      <div className="modal-heading">
        <h2 id="story-modal-title">{title}</h2>
        <button className="icon-button" onClick={onClose} aria-label="닫기"><Icon name="close" /></button>
      </div>
      {children}
    </dialog>
  );
}

export default function App() {
  const [game, setGame] = useState<GameState>(loadGame);
  const [route, setRoute] = useState<Scene>(currentRoute);
  const [detail, setDetail] = useState<Inspection | null>(null);
  const [dialogue, setDialogue] = useState<number | null>(null);
  const [modal, setModal] = useState<ModalKind>(null);
  const [toast, setToast] = useState<string | null>(null);
  const appRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const home = homes[game.house];
  const price = game.contract === 'monthly' ? home.rent : home.deposit;

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(game)); } catch { /* Storage is optional. */ }
  }, [game]);
  useEffect(() => {
    document.title = `${route === 'home' ? '처음 만나는 나의 집' : labels[route]} | 어떡하집`;
    window.scrollTo({ top: 0, behavior: 'instant' });
    mainRef.current?.focus({ preventScroll: true });
  }, [route]);
  useEffect(() => {
    const onPopState = () => {
      const next = currentRoute();
      setRoute(next); setDetail(null); setDialogue(null); setModal(null);
      if (next !== 'home') setGame((previous) => ({ ...previous, started: true, scene: next }));
    };
    window.addEventListener('popstate', onPopState);
    window.addEventListener('hashchange', onPopState);
    return () => {
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener('hashchange', onPopState);
    };
  }, []);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (modal || event.repeat || event.altKey || event.ctrlKey || event.metaKey || !['1', '2', '3'].includes(event.key)) return;
      if (event.target instanceof HTMLElement && (event.target.isContentEditable || event.target.closest('input,textarea,select'))) return;
      const button = appRef.current?.querySelectorAll<HTMLButtonElement>('.choices button')[Number(event.key) - 1];
      if (button) { event.preventDefault(); button.click(); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [modal]);

  function navigate(scene: Scene) {
    setModal(null); setDetail(null); setDialogue(null); setToast(null); setRoute(scene);
    if (scene !== 'home') setGame((previous) => ({ ...previous, started: true, scene }));
    if (window.location.hash !== `#${scene}`) window.history.pushState(null, '', `#${scene}`);
  }
  function recordNote(note: Note) {
    if (!game.notes.some((item) => item.id === note.id)) setToast('수첩에 새로운 발견을 기록했어요.');
    setGame((previous) => previous.notes.some((item) => item.id === note.id)
      ? previous : { ...previous, notes: [...previous.notes, note] });
  }
  function inspect(key: Inspection) {
    setDetail(key);
    setGame((previous) => previous.inspected.includes(key)
      ? previous : { ...previous, inspected: [...previous.inspected, key] });
    recordNote({ id: key, title: inspections[key].title, text: inspections[key].note });
  }
  function askQuestion(index: number) {
    const item = talkItems[index];
    setDialogue(index);
    setGame((previous) => previous.talked.includes(item.id)
      ? previous : { ...previous, talked: [...previous.talked, item.id] });
    recordNote({ id: item.id, title: item.title, text: item.note(game.contract) });
  }
  function checkNames() {
    setGame((previous) => ({ ...previous, ownerChecked: true, docTab: 'owner' }));
    recordNote({ id: 'owner', title: '서로 다른 두 이름', text: '등기상 소유자는 김민수, 전달받은 계좌의 예금주는 박지훈. 관계와 권한을 확인하기 전 송금을 보류하기.' });
  }
  function completeVisit() {
    checkNames();
    setGame((previous) => ({ ...previous, completed: true }));
    recordNote({ id: 'pause', title: '확인할 때까지 기다리기로 했다', text: '이름이 다른 이유와 대리권 관련 자료를 요청했다. 확인 전에는 돈을 보내지 않기로 했다.' });
    setModal('ending');
  }
  function chooseHome(index: number) {
    if (index === game.house) return;
    setGame((previous) => ({ ...makeNewGame(), started: true, contract: previous.contract, house: index }));
  }
  function chooseContract(contract: Contract) {
    if (contract === game.contract) return;
    setGame((previous) => ({ ...makeNewGame(), started: true, house: previous.house, contract }));
  }

  function stagebar() {
    const step = routes.indexOf(route);
    return (
      <div className="stagebar">
        <button className="back-link" aria-label="이전 장면" onClick={() => navigate(routes[Math.max(0, step - 1)])}><Icon name="back" /><span>이전 장면</span></button>
        <nav aria-label="이야기 진행"><ol>
          {routes.slice(1).map((scene, index) => (
            <li key={scene} className={route === scene ? 'active' : step > index + 1 ? 'past' : ''}>
              <button onClick={() => navigate(scene)} aria-current={route === scene ? 'step' : undefined}>
                <span className="step-number">{step > index + 1 ? <Icon name="check" /> : String(index + 1).padStart(2, '0')}</span>
                <span>{labels[scene]}</span>
              </button>
            </li>
          ))}
        </ol></nav>
        <span className="chapter-tag">CHAPTER 01</span>
      </div>
    );
  }
  function journal() {
    return (
      <aside className="journal-panel">
        <div className="journal-heading"><Icon name="book" /><h2>나의 수첩</h2><span>{game.notes.length}</span></div>
        <p className="journal-sub">직접 보고, 듣고, 발견한 것들.</p>
        <div className="journal-list">
          {game.notes.length ? game.notes.slice(-4).map((note, index) => (
            <div className="journal-note" key={note.id}><span className="note-num">{String(index + 1).padStart(2, '0')}</span>
              <div><h3>{note.title}</h3><p>{note.text}</p></div>
            </div>
          )) : <div className="journal-empty"><Icon name="book" /><p>아직은 빈 페이지.<br />작은 발견부터 적어보자.</p><span>방 안의 표시를 눌러 살펴볼 수 있어요.</span></div>}
        </div>
        <button className="text-button" onClick={() => setModal('notebook')}>수첩 펼치기 <Icon name="arrow" /></button>
        <div className="journal-bottom"><span>지금의 목표</span><p>{route === 'explore' ? '마음에 드는 이 방,\n보이지 않는 곳도 살펴보기.' : '서두르지 않고,\n궁금한 것을 하나씩 물어보기.'}</p></div>
      </aside>
    );
  }
  function renderHome() {
    return (
      <>
        <section className="home-hero">
          <div className="home-art" role="img" aria-label="저녁빛이 내려앉은 서울의 조용한 주택가 골목" />
          <div className="story-hero-content">
            <div className="eyebrow"><span className="short-line" />처음 만나는 나의 집</div>
            <h1>괜찮은 집,<br /><span>찾을 수 있을까?</span></h1>
            <p className="hero-description">낯선 동네, 처음 보는 계약서.<br />당신의 선택으로 시작되는 첫 번째 독립 이야기.</p>
            <div className="home-actions">
              <button className="primary start" onClick={() => game.started ? setModal('new') : navigate('choose')}>새로운 이야기 시작 <Icon name="arrow" /></button>
              <button className="continue" disabled={!game.started} onClick={() => navigate(game.scene)}><Icon name="reset" /> 이어서 하기 {game.started && <span>{labels[game.scene]}</span>}</button>
            </div>
            <div className="play-meta"><span><Icon name="clock" /> 약 5분</span><span className="meta-dot">·</span><span>선택형 텍스트 어드벤처</span></div>
          </div>
          <div className="scene-caption"><span><Icon name="pin" /> 서울, 어느 조용한 골목</span><p>“이 동네 어딘가에, 내 자리가 있을까.”</p></div>
          <span className="image-page">01 — 05</span>
        </section>
        <section className="chapter-section">
          <div className="section-label">이번 이야기<span>집을 구하는 일, 한 장면씩.</span></div>
          <div className="chapter-cards">{chapterCards.map((card) => (
            <button className="chapter-card" key={card.number} onClick={() => navigate(card.scene)}>
              <span className="chapter-icon"><Icon name={card.icon} /></span>
              <span className="chapter-copy"><small>CHAPTER {card.number}</small><strong>{card.title}</strong><span>{card.description}</span></span>
              <Icon name="arrow" className="chapter-arrow" />
            </button>
          ))}</div>
        </section>
      </>
    );
  }
  function renderChoose() {
    return (
      <>
        <div className="page-heading"><div><p className="eyebrow">첫 번째 장면 <span>집을 고르다</span></p><h1>어떤 집에서 시작할까?</h1><p>지금 마음이 가는 집을 골라보자. 이야기는 그곳에서 시작된다.</p></div><span className="scene-count">01 <span>/ 04</span></span></div>
        <div className="selection-layout">
          <section className="selection-panel">
            <div className="field-title"><span>01</span><h2>어떤 계약으로 구할까?</h2></div>
            <div className="contract-toggle" role="group" aria-label="계약 형태">
              <button onClick={() => chooseContract('monthly')} aria-pressed={game.contract === 'monthly'} className={game.contract === 'monthly' ? 'selected' : ''}><strong>월세</strong><span>보증금과 매달 내는 임대료</span>{game.contract === 'monthly' && <Icon name="check" />}</button>
              <button onClick={() => chooseContract('jeonse')} aria-pressed={game.contract === 'jeonse'} className={game.contract === 'jeonse' ? 'selected' : ''}><strong>전세 + 대출</strong><span>목돈과 대출 조건을 함께 살펴보기</span>{game.contract === 'jeonse' && <Icon name="check" />}</button>
            </div>
            <div className="field-title home-type-label"><span>02</span><h2>어떤 공간에서 살고 싶어?</h2></div>
            <div className="home-grid">{homes.map((item, index) => (
              <button key={item.name} className={`home-option ${game.house === index ? 'selected' : ''}`} onClick={() => chooseHome(index)} aria-pressed={game.house === index}>
                <Icon name={item.icon} /><strong>{item.name}</strong><span>{item.sub}</span><i className="radio-mark">{game.house === index && <Icon name="check" />}</i>
              </button>
            ))}</div>
            <p className="subtle-note"><Icon name="info" /> 실제 집의 용도와 계약 조건은 서류를 보며 확인해요.</p>
          </section>
          <aside className="listing-card">
            <div className="listing-image"><span className="image-chip">첫 번째로 보러 갈 집</span></div>
            <div className="listing-content">
              <span className="listing-location"><Icon name="pin" /> 서울시 은유동 · 가상의 매물</span><h2>{home.desc}</h2>
              <div className="listing-price"><strong>{price}</strong><span>만원 {game.contract === 'monthly' ? '· 보증금 / 월세' : '· 전세보증금'}</span></div>
              <div className="listing-specs"><span>{home.name}</span><span>{home.area}</span><span>관리비 별도</span></div>
              <div className="thought"><Icon name="chat" /><p>{game.contract === 'jeonse' ? '이 집은 대출이 가능할까? 가능 여부와 조건부터 확인해 보자.' : home.hint}</p></div>
              <button className="primary full" onClick={() => navigate('explore')}>이 집 보러 가기 <Icon name="arrow" /></button>
              <p className="fiction-note">금액과 매물은 이야기 속 가상 설정이에요.</p>
            </div>
          </aside>
        </div>
      </>
    );
  }
  function renderExplore() {
    const item = detail ? inspections[detail] : null;
    return (
      <>
        <div className="game-heading"><div><p className="eyebrow">두 번째 장면 <span>직접 마주한 방</span></p><h1>문을 열자, 오후의 빛이 들어왔다.</h1></div><span className="location-label"><Icon name="pin" /> 은유동 {home.name} · 첫 방문</span></div>
        <div className="play-layout"><section className="play-column">
          <div className="room-scene">
            <img src={roomImage} alt="햇빛이 들어오는 작은 방. 왼편 창문과 오른편 싱크대, 현관을 살펴볼 수 있다." />
            <div className="room-shade" /><span className="room-label"><Icon name="eye" /> 공간 탐색</span><span className="scene-time">DAY 01 <span>14:30</span></span>
            {inspectionKeys.map((key) => (
              <button key={key} className={`hotspot hotspot-${key} ${game.inspected.includes(key) ? 'found' : ''}`} onClick={() => inspect(key)} aria-label={`${inspections[key].title} 살펴보기`}>
                <span className="hotspot-dot"><Icon name={game.inspected.includes(key) ? 'check' : 'spark'} /></span><span className="hotspot-label">{inspections[key].title}</span>
              </button>
            ))}
            <div className="scene-bottom"><span>{home.name} <b>·</b> {home.area}</span><span>살펴본 곳 <strong>{game.inspected.length} / 3</strong></span></div>
          </div>
          <div className="narration" aria-live="polite">
            <div className="speaker-label">{item ? <Icon name={item.icon} /> : <span className="narrator-dot" />}{item ? item.title : '나의 이야기'}</div>
            <p>{item ? item.narrative(home) : '사진보다 조금 작지만, 볕이 제법 잘 드는 방이다.\n중개사는 편하게 둘러보라며 한 걸음 물러섰다.'}</p>
            <span className="inner-thought">{item ? item.learning : '“여기서 사는 내 모습이 조금은 그려진다. 어디부터 살펴볼까?”'}</span>
          </div>
          <div className="choice-heading">다음 행동을 선택하세요<span>숫자 키로도 선택할 수 있어요</span></div>
          <div className="choices">
            <button onClick={() => inspect(inspectionKeys.find((key) => !game.inspected.includes(key)) ?? 'window')}><kbd>1</kbd><span>{game.inspected.length === 3 ? '방을 한 번 더 살펴본다' : '아직 보지 않은 곳을 살펴본다'}</span><Icon name="eye" /></button>
            <button onClick={() => game.inspected.length < 3 ? setModal('explore-warning') : navigate('talk')}><kbd>2</kbd><span>중개사에게 궁금한 것을 물어본다</span><Icon name="arrow" /></button>
          </div>
        </section>{journal()}</div>
      </>
    );
  }
  function renderTalk() {
    return (
      <>
        <div className="game-heading"><div><p className="eyebrow">세 번째 장면 <span>중개사와의 대화</span></p><h1>좋은 질문 하나가, 단서가 된다.</h1></div><span className="location-label"><Icon name="chat" /> 방을 둘러본 뒤</span></div>
        <div className="play-layout"><section className="play-column">
          <div className="conversation-scene">
            <img src={roomImage} alt="중개사와 대화를 나누는 방 안" /><div className="conversation-shade" />
            <div className="conversation-context"><span><Icon name="pin" /> 은유동 {home.name}</span><p>중개사가 창가에 서서<br />당신의 대답을 기다린다.</p></div>
            <div className="character-tag"><span className="story-avatar">중</span><div><strong>한서진</strong><span>공인중개사 · 이야기 속 인물</span></div><span className="speaker-status">대화 중</span></div>
          </div>
          <div className="narration dialogue" aria-live="polite">
            <div className="speaker-label">한서진 <span>공인중개사</span></div>
            <p>{dialogue === null ? '“방은 어떠셨어요? 마음에 드시면 이야기 나눠볼까요?\n궁금한 점이 있으면 편하게 물어보세요.”' : talkItems[dialogue].reply(game.contract)}</p>
            <span className="inner-thought">{dialogue === null ? '“분위기는 괜찮다. 그래도 궁금한 건 지금 물어보자.”' : dialogue === 2 ? '중개사가 건넨 서류를 책상 위에 펼쳤다.' : '들은 내용은 수첩에 적어두었다. 다른 것도 물어볼까?'}</span>
          </div>
          <div className="choice-heading">무엇을 물어볼까?<span>선택한 대화는 수첩에 기록돼요</span></div>
          <div className="choices talk-choices">{talkItems.map((item, index) => (
            <button key={item.id} className={game.talked.includes(item.id) ? 'asked' : ''} onClick={() => askQuestion(index)}><kbd>{index + 1}</kbd><span>{item.label}</span><Icon name={game.talked.includes(item.id) ? 'check' : 'chat'} /></button>
          ))}</div>
          {game.talked.includes('papers') && <button className="primary full next-document" onClick={() => navigate('document')}>건네받은 서류 살펴보기 <Icon name="arrow" /></button>}
        </section>{journal()}</div>
      </>
    );
  }
  function renderPaper() {
    return (
      <div className="paper">
        <div className="paper-watermark">학습용 가상 서류</div>
        <div className="paper-top"><span>열람용</span><span>발급일 2026. 09. 12.</span></div>
        <h2>등기사항전부증명서</h2><p className="paper-subtitle">건물 · 일부 항목을 간략히 재구성한 학습용 서류</p>
        <div className="paper-address">[건물] 서울특별시 은유구 은유동 24-7 {game.house === 2 && '제3층 제301호'}</div>
        <div className={`paper-section ${game.docTab === 'address' ? 'highlight' : ''}`}><h3>표제부 <span>건물의 표시</span></h3><div className="paper-row"><span>소재지번</span><strong>은유동 24-7 {game.house === 2 && '제301호'}</strong></div><div className="paper-row"><span>건물 정보</span><strong>방문한 매물의 정보와 비교하기</strong></div></div>
        <button className={`paper-section owner-section ${game.docTab === 'owner' ? 'highlight' : ''} ${game.ownerChecked ? 'marked' : ''}`} onClick={checkNames} aria-label="갑구에서 소유자 이름 확인하기">
          <h3>갑구 <span>소유권에 관한 사항</span><Icon name="eye" /></h3>
          <div className="paper-table"><div><span>순위번호</span><span>등기목적</span><span>권리자 및 기타사항</span></div><div><strong>1</strong><strong>소유권이전</strong><strong>소유자 <mark>김민수</mark></strong></div></div>
          <p className="paper-prompt">{game.ownerChecked ? '✓ 소유자 이름을 수첩에 기록했어요' : '눌러서 소유자 이름을 확인하기'}</p>
        </button>
        <div className={`paper-section ${game.docTab === 'rights' ? 'highlight' : ''}`}><h3>을구 <span>소유권 이외의 권리에 관한 사항</span></h3><div className="paper-row"><span>권리관계</span><strong>이 연습에서는 상세 내용 생략</strong></div><p className="paper-fineprint">실제 계약에서는 근저당권 등 다른 권리도 함께 확인해야 해요.</p></div>
        <p className="paper-bottom">이 화면은 실제 발급 문서가 아니며, 계약의 안전 여부를 판정하지 않습니다.</p>
      </div>
    );
  }
  function renderDocument() {
    return (
      <>
        <div className="game-heading"><div><p className="eyebrow">네 번째 장면 <span>서류 속의 단서</span></p><h1>같은 집, 서로 다른 이름.</h1></div><button className="text-button" onClick={() => setModal('document-guide')}><Icon name="help" /> 서류 읽는 법</button></div>
        <div className="document-layout">
          <section className="document-viewer"><div className="document-toolbar"><span><Icon name="file" /> 등기사항증명서</span><span>01 / 01</span></div>
            <div className="document-tabs" role="group" aria-label="서류 항목">{documentTabs.map((tab) => <button key={tab.id} onClick={() => setGame((previous) => ({ ...previous, docTab: tab.id }))} aria-pressed={game.docTab === tab.id} className={game.docTab === tab.id ? 'active' : ''}>{tab.label}</button>)}</div>
            <div className="paper-wrap">{renderPaper()}</div>
          </section>
          <aside className="document-aside">
            <div className="evidence-heading"><Icon name="eye" /><span>나란히 놓고 살펴보자</span></div>
            <div className="message-card"><div className="message-sender"><span className="story-avatar small">중</span><div><strong>중개사에게 전달받은 메모</strong><span>오늘 오후 2:45</span></div></div>
              <p>“입금은 이쪽으로 해주시면 된대요.<br />계좌 정보 보내드릴게요.”</p>
              <div className="bank-card"><span>이야기은행 · 가상 계좌</span><strong>000-1234-5678</strong><div><span>예금주</span><b>박지훈</b></div></div>
            </div>
            <div className="document-thought"><span className="speaker-label"><Icon name="book" /> 나의 생각</span><p>{game.ownerChecked ? <>“서류 속 소유자는 김민수인데,<br />계좌에는 박지훈이라고 적혀 있다.”</> : <>“서류와 계좌 정보를 나란히 놓았다.<br />무엇을 먼저 확인해야 할까?”</>}</p><span>{game.ownerChecked ? '서로 다른 두 이름을 수첩에 기록했어요.' : '소유자 이름을 눌러 단서를 기록해 보세요.'}</span></div>
            <div className="choices document-choices">
              <button onClick={checkNames}><kbd>1</kbd><span>소유자와 예금주를 비교한다</span><Icon name={game.ownerChecked ? 'check' : 'eye'} /></button>
              <button onClick={completeVisit}><kbd>2</kbd><span>이름이 다른 이유를 묻는다</span><Icon name="chat" /></button>
              <button className="risky-choice" onClick={() => setModal('send-warning')}><kbd>3</kbd><span>안내받은 계좌로 일단 송금한다</span><Icon name="arrow" /></button>
            </div>
            <button className="text-button learn-more" onClick={() => setModal('document-guide')}><Icon name="help" /> 자세히 알아보기</button>
          </aside>
        </div>
      </>
    );
  }

  function renderModal(): ReactNode {
    if (!modal) return null;
    const close = () => setModal(null);
    let title = '';
    let content: ReactNode;
    switch (modal) {
      case 'new':
        title = '새로운 이야기를 시작할까요?';
        content = <><p className="modal-intro">지금까지 이 브라우저에 저장된 진행과 수첩을 비우고 집 선택부터 시작해요.</p><div className="modal-buttons"><button className="secondary" onClick={close}>계속 보관하기</button><button className="primary" onClick={() => { setGame(makeNewGame()); navigate('choose'); }}>새로 시작하기</button></div></>;
        break;
      case 'journey':
        title = '나의 여정';
        content = <><p className="modal-intro">첫 번째 집을 만나러 가는 길.<br />다시 보고 싶은 장면으로 이동할 수 있어요.</p><div className="journey-list">{routes.map((scene, index) => <button key={scene} onClick={() => navigate(scene)} className={route === scene ? 'active' : ''}><span>{String(index).padStart(2, '0')}</span><strong>{labels[scene]}</strong><Icon name="arrow" /></button>)}</div></>;
        break;
      case 'notebook':
        title = '나의 수첩';
        content = <><p className="modal-intro">이번 이야기에서 직접 발견한 것들이에요.<br />기록은 이 브라우저에 자동으로 저장돼요.</p>{game.notes.length ? <div className="notebook-list">{game.notes.map((note, index) => <article key={note.id}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{note.title}</h3><p>{note.text}</p></div></article>)}</div> : <div className="notebook-empty"><Icon name="book" /><h3>이제 첫 페이지를 채울 시간.</h3><p>방을 살펴보고 대화를 나누면 발견한 내용이 쌓여요.</p><button className="primary" onClick={() => navigate('explore')}>방 둘러보기 <Icon name="arrow" /></button></div>}</>;
        break;
      case 'guide':
        title = '이야기를 즐기는 방법';
        content = <><p className="modal-intro">처음 집을 구하는 하루를, 여기서 먼저 경험해 보세요.</p><div className="guide-steps"><article><Icon name="eye" /><div><h3>천천히 살펴보기</h3><p>방 안의 표시를 누르면 그곳을 직접 확인할 수 있어요.</p></div></article><article><Icon name="chat" /><div><h3>나의 말과 행동 선택하기</h3><p>궁금한 것을 물어보세요. 선택에 따라 대화와 기록이 달라져요.</p></div></article><article><Icon name="book" /><div><h3>발견한 내용을 연결하기</h3><p>수첩에 모은 단서를 비교해 보세요. 놓친 부분은 언제든 다시 살펴볼 수 있어요.</p></div></article></div><p className="guide-foot">숫자 1–3으로 행동 선택 · Esc로 창 닫기<br />현재 이야기는 가상 매물의 첫 방문까지 체험할 수 있어요.</p><button className="primary full" onClick={close}>알겠어요 <Icon name="check" /></button></>;
        break;
      case 'document-guide':
        title = '서류 속에서 무엇을 볼까?';
        content = <><p className="modal-intro">이 장면에서는 소유자와 전달받은 계좌의 이름을 비교해요.</p><div className="guide-steps"><article><span className="guide-number">01</span><div><h3>집이 같은지</h3><p>서류의 주소와 실제 방문한 집의 주소·동·호수가 일치하는지 살펴봐요.</p></div></article><article><span className="guide-number">02</span><div><h3>누구와 계약하는지</h3><p>등기상 소유자와 계약 상대방의 신분을 대조해요. 대리인이라면 대리권을 확인할 자료도 필요해요.</p></div></article><article><span className="guide-number">03</span><div><h3>확인되지 않은 부분이 있는지</h3><p>이름이 다르다고 곧바로 사기라고 단정할 수는 없어요. 관계와 권한을 확인하기 전에는 송금을 서두르지 않아요.</p></div></article></div><div className="source-box"><span>함께 확인할 공식 자료</span><a href={sourceUrl} target="_blank" rel="noopener noreferrer">국토교통부 · 전세계약 유의사항 <Icon name="external" /></a><p>이 안내는 일부 확인 절차를 연습하는 내용이에요. 실제 계약에서는 전체 권리관계와 계약 조건을 추가로 확인해야 해요.</p></div><button className="primary full" onClick={close}>서류로 돌아가기 <Icon name="arrow" /></button></>;
        break;
      case 'explore-warning':
        title = '조금 더 둘러볼까?';
        content = <><span className="modal-symbol"><Icon name="eye" /></span><p className="modal-story">{'“마음에 드는 방이지만,\n아직 살펴보지 않은 곳이 있다.”'}</p><p className="modal-intro">{inspectionKeys.filter((key) => !game.inspected.includes(key)).map((key) => inspections[key].title).join(', ')}도 직접 확인할 수 있어요. 대화 후에 돌아와도 괜찮아요.</p><button className="primary full" onClick={close}>돌아가서 살펴보기 <Icon name="eye" /></button><button className="text-button centered" onClick={() => navigate('talk')}>먼저 중개사와 대화하기 <Icon name="arrow" /></button></>;
        break;
      case 'send-warning':
        title = '잠깐, 이 이름은 누구일까?';
        content = <><span className="modal-symbol warning"><Icon name="info" /></span><p className="modal-story">송금 버튼 앞에서,<br />서류에 적힌 이름이 다시 눈에 들어왔다.</p><div className="name-comparison"><div><span>등기상 소유자</span><strong>김민수</strong></div><b>≠</b><div><span>계좌 예금주</span><strong>박지훈</strong></div></div><p className="modal-intro">이름이 다른 이유는 아직 확인하지 못했어요. 관계와 권한을 먼저 확인해 볼까요? 여기서는 돈이 보내지지 않아요.</p><button className="primary full" onClick={() => { close(); checkNames(); }}>돌아가서 직접 비교하기 <Icon name="eye" /></button><button className="text-button centered" onClick={() => setModal('document-guide')}>왜 확인해야 하나요? <Icon name="help" /></button></>;
        break;
      case 'ending':
        title = '서두르지 않은, 좋은 첫걸음.';
        content = <><span className="modal-symbol success"><Icon name="flag" /></span><p className="modal-story">{'“소유자와 예금주가 다른데요.\n관계를 확인할 자료를 볼 수 있을까요?”'}</p><div className="ending-reply"><span>중개사 한서진</span><p>{'“집주인 쪽에 다시 확인해 볼게요.\n자료를 받아 보시고 결정하셔도 괜찮아요.”'}</p></div><p className="modal-intro">당신은 이유를 확인하기 전까지 송금을 보류했다.<br />첫 번째 집에서의 방문은 여기까지. 다음 선택은 조금 덜 낯설 것이다.</p><div className="ending-stats"><span>이번 이야기의 기록</span><strong>{game.notes.length}개의 발견</strong></div><button className="primary full" onClick={() => setModal('notebook')}>나의 수첩 돌아보기 <Icon name="book" /></button><button className="text-button centered" onClick={() => navigate('home')}>홈으로 돌아가기 <Icon name="arrow" /></button></>;
        break;
    }
    return <StoryModal title={title} onClose={close}>{content}</StoryModal>;
  }

  return (
    <div ref={appRef} className="story-app">
      <header className="header">
        <button className="brand" onClick={() => navigate('home')} aria-label="어떡하집 홈"><Icon name="door" /><span>어떡하집<span className="brand-dot">.</span></span></button>
        <span className="brand-caption">나의 첫 독립 이야기</span>
        <nav aria-label="주 메뉴">
          <button onClick={() => setModal('journey')} aria-label="나의 여정"><Icon name="map" /><span>나의 여정</span></button>
          <button onClick={() => setModal('notebook')} aria-label="수첩"><Icon name="book" /><span>수첩</span>{game.notes.length > 0 && <span className="count">{game.notes.length}</span>}</button>
          <span className="nav-divider" /><button className="icon-button" onClick={() => setModal('guide')} aria-label="플레이 가이드"><Icon name="help" /></button>
        </nav>
      </header>
      <main key={route} id="main" ref={mainRef} tabIndex={-1} className={`main ${route === 'home' ? 'home-main' : ''}`}>
        {route !== 'home' && stagebar()}
        {route === 'home' && renderHome()}
        {route === 'choose' && renderChoose()}
        {route === 'explore' && renderExplore()}
        {route === 'talk' && renderTalk()}
        {route === 'document' && renderDocument()}
      </main>
      <footer className="story-footer"><span>모든 첫 독립에는, 연습이 필요하니까.</span><span>어떡하집 <b>·</b> 첫 번째 이야기</span></footer>
      {renderModal()}
      {toast && <div className="story-toast" role="status">{toast}</div>}
    </div>
  );
}

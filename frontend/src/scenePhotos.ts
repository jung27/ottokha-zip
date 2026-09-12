const housingApp = "housing-app";
const brokerMessage = "broker-message";
const office = "real-estate-office";
const agent = "broker";
const oneroom = "oneroom-exterior";
const officetel = "officetel-exterior";
const villa = "villa-exterior";
const rooftop = "rooftop-exterior";
const basement = "basement-exterior";
const goshiwon = "goshiwon-exterior";
const roomEntry = "room-entry";
const room = "room-interior";
const depositMessage = "deposit-message";
const ownerAccount = "owner-account-mismatch";
const lease = "contract-desk";
const signing = "contract-signing";
const moving = "moving-day";
const accountChange = "account-change";
const balanceDay = "balance-day";
const settlement = "move-in-settlement";
const insurance = "deposit-insurance";
const defect = "move-in-defect";
import type { Background } from "./types";

import imageReport from "../image-optimization.json";

export const sceneImageSizes = "(max-width: 600px) calc(100vw - 24px), (max-width: 1100px) calc(100vw - 56px), 1024px";
const imageFiles = import.meta.glob<string>("./assets/optimized/*.webp", { eager: true, import: "default", query: "?url" });
export type ScenePhoto = { description: string; specified: boolean; src?: string; srcSet?: string };
const photo = (name: string, description: string): ScenePhoto => {
  const src = imageFiles[`./assets/optimized/${name}.webp`];
  const small = imageFiles[`./assets/optimized/${name}-small.webp`];
  const dimensions = imageReport.find((entry) => entry.file.replace(/\.[^.]+$/, "") === name)!;
  return { src, srcSet: `${small} ${dimensions["800"].width}w, ${src} ${dimensions["1600"].width}w`, description, specified: true };
};

export const scenePhotos: Record<Background, ScenePhoto> = {
  home: photo(housingApp, "부동산 앱에서 집을 찾아보는 화면"),
  app: photo(housingApp, "부동산 앱에서 집을 찾아보는 화면"),
  message: photo(brokerMessage, "방문을 서두르라는 중개사의 답장"),
  office: photo(office, "매물 사진이 붙어 있는 부동산 사무실 외관"),
  agent: photo(agent, "부동산 사무실 책상 너머에서 설명하는 중개사"),
  oneroom: photo(oneroom, "여러 세대의 창문과 우편함이 있는 다가구 원룸 건물"),
  officetel: photo(officetel, "1층 상가와 부동산이 있는 오피스텔 건물"),
  villa: photo(villa, "주차장과 발코니가 있는 신축 빌라"),
  rooftop: photo(rooftop, "외부 계단과 옥상 바닥이 보이는 옥탑방"),
  basement: photo(basement, "도로 가까이에 낮은 창문이 있는 반지하"),
  goshiwon: photo(goshiwon, "고시원과 운영업체 간판이 있는 건물"),
  "room-entry": photo(roomEntry, "중개사가 방의 현관문을 열어주는 모습"),
  room: photo(room, "도어락, 창문, 욕실과 싱크대가 보이는 방 내부"),
  "deposit-message": photo(depositMessage, "100만 원 선입금과 김○○ 명의 계좌를 안내하는 문자"),
  "owner-account": photo(ownerAccount, "등기부 소유자 박○○와 계좌 예금주 김○○를 비교하는 장면"),
  lease: photo(lease, "여러 계약 서류가 놓여 있는 중개사 사무실 책상"),
  signing: photo(signing, "임대차계약서에 서명하기 전 펜을 든 손"),
  moving: photo(moving, "계약서와 열쇠, 이삿짐이 놓인 입주 당일의 방"),
  "account-change": photo(accountChange, "계좌가 바뀌었다며 다른 계좌로 송금을 요구하는 문자"),
  "balance-day": photo(balanceDay, "중개사 앞에서 오후 4시 50분을 확인하는 휴대전화"),
  settlement: photo(settlement, "도어락과 계량기, 이삿짐이 보이는 현관"),
  insurance: photo(insurance, "전세보증금 반환보증 가입 완료 화면"),
  defect: photo(defect, "입주 후 들뜬 벽지와 곰팡이를 휴대전화로 촬영하는 모습"),
  street: photo(oneroom, "집을 알아보며 걷는 주택가 골목"),
  rain: photo(defect, "습기로 손상된 벽지와 곰팡이"),
};

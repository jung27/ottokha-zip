import housingApp from "./assets/housing-app.png";
import brokerMessage from "./assets/broker-message.png";
import office from "./assets/scenes/real-estate-office.jpg";
import agent from "./assets/scenes/broker.jpg";
import oneroom from "./assets/scenes/oneroom-exterior.jpg";
import officetel from "./assets/scenes/officetel-exterior.jpg";
import villa from "./assets/scenes/villa-exterior.jpg";
import rooftop from "./assets/scenes/rooftop-exterior.jpg";
import basement from "./assets/scenes/basement-exterior.jpg";
import goshiwon from "./assets/scenes/goshiwon-exterior.jpg";
import roomEntry from "./assets/scenes/room-entry.jpg";
import room from "./assets/scenes/room-interior.jpg";
import depositMessage from "./assets/scenes/deposit-message.jpg";
import ownerAccount from "./assets/scenes/owner-account-mismatch.jpg";
import lease from "./assets/scenes/contract-desk.jpg";
import signing from "./assets/scenes/contract-signing.jpg";
import moving from "./assets/scenes/moving-day.jpg";
import accountChange from "./assets/scenes/account-change.jpg";
import balanceDay from "./assets/scenes/balance-day.jpg";
import settlement from "./assets/scenes/move-in-settlement.jpg";
import insurance from "./assets/scenes/deposit-insurance.jpg";
import defect from "./assets/scenes/move-in-defect.jpg";
import type { Background } from "./types";

export type ScenePhoto = { description: string; specified: boolean; src?: string };
const photo = (src: string, description: string): ScenePhoto => ({
  src,
  description,
  specified: true,
});

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

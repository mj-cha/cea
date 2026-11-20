import { morePublications } from "./publications-more";

export type PubCategory = "전체" | "4대 회계법인" | "법무법인" | "임팩트온 · 기사" | "유튜브 영상";

export interface PublicationItem {
  id: string;
  no: string;
  category: Exclude<PubCategory, "전체">;
  source: string;
  topicTag: string;
  title: string;
  date: string;
  authorOrDept: string;
  summary: string[];
  keyTakeaways: string[];
  externalUrl: string;
  youtubeEmbedUrl?: string;
  relatedServiceId: string;
}

export const PUB_CATEGORIES: PubCategory[] = [
  "전체",
  "4대 회계법인",
  "법무법인",
  "임팩트온 · 기사",
  "유튜브 영상",
];

const corePublications: PublicationItem[] = [
  {
    id: "pub-pwc-re100",
    no: "01",
    category: "4대 회계법인",
    source: "삼일PwC",
    topicTag: "RE100 이행 전략",
    title: "국내 기업의 RE100 이행 전략: PPA · REC · 녹색프리미엄 조달 경제성(LCOE) 및 계약 가이드",
    date: "2026-11",
    authorOrDept: "삼일PwC Sustainability Platform 요약·재구성",
    summary: [
      "글로벌 공급망에서 RE100(재생에너지 100% 전환)이 단순 선언을 넘어 수주와 거래 유지의 핵심 계약 조건으로 자리 잡았습니다. 국내 산업용 전기요금 인상과 맞물려 기업들은 단기 비용 방어와 장기 재생에너지 물량 확보라는 이중 과제를 안고 있습니다.",
      "본 리포트는 녹색프리미엄, REC(신재생에너지 공급인증서) 구매, 제3자 PPA 및 직접 PPA, 자가발전 등 5대 이행 수단별 균등화 발전비용(LCOE)과 회계·법률 리스크를 시나리오별로 정밀 비교합니다.",
      "특히 Scope 2 온실가스 감축 실적을 글로벌 고객사와 CDP로부터 확실히 인정받기 위한 조달 포트폴리오 배분 원칙과 장기 PPA 계약 시 필수 검토해야 할 단가 연동·발전량 보증 조건을 제시합니다.",
    ],
    keyTakeaways: [
      "단기(녹색프리미엄·현물 REC)와 중장기(직접 PPA·자가발전) 혼합 포트폴리오로 전력 조달 단가 리스크 헤지",
      "직접 PPA 체결 시 파생상품 회계처리 이슈 및 망사용료·보완공급 부대비용 사전 시뮬레이션 필수",
      "해외 생산법인(미국·유럽·베트남·중국) 권역별 재생에너지 인증제도(GO, I-REC, DPPA) 정합성 확보",
    ],
    externalUrl: "https://www.pwc.com/kr/ko/services/sustainability-platform.html",
    relatedServiceId: "re100",
  },
  {
    id: "pub-pwc-tcfd",
    no: "02",
    category: "4대 회계법인",
    source: "삼일PwC",
    topicTag: "TCFD · 시나리오 분석",
    title: "TCFD 보고서 발간 및 기후 시나리오 기반 재무영향(Climate VaR) 정량화 프레임워크",
    date: "2026-11",
    authorOrDept: "삼일PwC Sustainability Platform 요약·재구성",
    summary: [
      "TCFD(기후변화 관련 재무정보 공개 협의체) 권고안이 IFRS S2 및 국내 KSSB 기후공시 기준의 핵심 골격으로 통합되면서, 정성적 서술 위주의 보고서에서 '재무제표 계정과목과 연결된 정량 시나리오 분석'으로 공시 수준이 급격히 높아졌습니다.",
      "NGFS(녹색금융협의체) 및 IEA(국제에너지기구)의 1.5℃ Net-Zero 시나리오와 2℃·BAU 시나리오를 적용해 탄소배출권 가격 상승, 에너지 전환 비용(전환 리스크) 및 극한기후로 인한 사업장 자산 손상·조업 중단(물리적 리스크)을 화폐 단위로 산출하는 방법론을 다룹니다.",
      "이사회와 감사위원회가 기후 리스크를 실질적으로 감독하고 CAPEX 투자 의사결정에 내부탄소가격(ICP)을 반영하는 선도 기업의 TCFD 보고서 발간 실무 절차를 수록했습니다.",
    ],
    keyTakeaways: [
      "지배구조·전략·위험관리·지표 및 목표 4대 축을 IFRS S2 및 KSSB 제2호 의무공시 요건과 1:1 매핑",
      "전환 리스크(탄소가격·CBAM·전력비)와 물리적 리스크(홍수·태풍·폭염)의 영업이익·자산가치 영향 정량화",
      "Scope 1·2·3 온실가스 인벤토리 데이터 내부통제 및 SBTi 과학기반 감축목표 연계",
    ],
    externalUrl: "https://www.pwc.com/kr/ko/services/sustainability-platform.html",
    relatedServiceId: "tcfd-climate",
  },
  {
    id: "pub-yt-re100-tcfd",
    no: "03",
    category: "유튜브 영상",
    source: "YouTube · ESG 인사이트",
    topicTag: "RE100 · TCFD 영상 브리핑",
    title: "[영상 브리핑] RE100 이행 전략과 TCFD 기후공시 시나리오 분석 핵심 실무 가이드",
    date: "2026-11",
    authorOrDept: "CEA ESG 아카데미 & 글로벌 컨설팅 브리핑",
    summary: [
      "기업 ESG 실무자와 경영진이 가장 많이 질문하는 'RE100 조달 수단(PPA vs REC) 선택 기준'과 'TCFD 기후 시나리오 재무영향 분석'을 10분 만에 핵심만 짚어주는 영상 브리핑입니다.",
      "좌측 플레이어에서 바로 영상을 재생하여 확인하실 수 있으며, 세부 산정 시트와 심화 강의는 CEA 온라인 강의실(#lms)의 'RE100 이행 전략과 PPA·REC 조달 실무' 및 'TCFD 보고서 발간' 과정에서 수강하실 수 있습니다.",
    ],
    keyTakeaways: [
      "글로벌 고객사 RE100 요구사항 대응 시 가장 비용 효율적인 연도별 조달 로드맵 설계법",
      "TCFD 보고서 작성 시 전환·물리적 리스크를 재무 수치로 연결하는 3단계 모델링",
      "온라인 교육 이수 후 우리 회사 데이터로 바로 보고서 초안을 완성하는 CEA 워크숍 연계",
    ],
    externalUrl: "https://www.youtube.com/results?search_query=PwC+Korea+ESG+RE100+TCFD",
    youtubeEmbedUrl: "https://www.youtube.com/embed/M7lc1UVf-VE?rel=0",
    relatedServiceId: "re100",
  },
  {
    id: "pub-kpmg-esg-mgmt",
    no: "04",
    category: "4대 회계법인",
    source: "삼정KPMG",
    topicTag: "ESG 관리체계 수립",
    title: "ESG 공시 의무화 시대, 연결 기준 ESG 관리체계 수립 및 데이터 내부통제 구축 전략",
    date: "2026-10",
    authorOrDept: "삼정KPMG ESG 비즈니스 그룹 인사이트",
    summary: [
      "국내외 ESG 공시 기준(ISSB, EU CSRD, KSSB)은 본사뿐만 아니라 국내외 종속회사를 포함한 '연결 기준' 비재무 정보 공시를 요구합니다. 이에 따라 엑셀 수기 취합 방식을 벗어나 전사 표준화된 ESG 관리체계와 내부통제 프로세스 구축이 시급해졌습니다.",
      "이사회 산하 ESG위원회의 감독 역할 정립부터 경영진 ESG 협의체, 현업 부서별 핵심성과지표(KPI) 부여, 그리고 제3자 검증(Assurance)에 대응 가능한 데이터 거버넌스 설계 방안을 종합 제시합니다.",
    ],
    keyTakeaways: [
      "본사 및 해외 자회사 연결 기준 ESG 데이터 정의서(Data Dictionary)와 산정 매뉴얼 표준화",
      "현업 부서 성과평가(MBO/KPI)와 ESG 중대 이슈 관리 목표의 실질적 연동",
      "재무 공시 수준의 3선 내부통제 및 외부 검증 감사 추적성(Audit Trail) 확보",
    ],
    externalUrl: "https://kpmg.com/kr/ko/home/insights.html",
    relatedServiceId: "esg-management",
  },
  {
    id: "pub-deloitte-green-procurement",
    no: "05",
    category: "4대 회계법인",
    source: "딜로이트 안진",
    topicTag: "Green Procurement · 공급망",
    title: "Green Procurement(녹색구매) 전략 수립과 EU 공급망 실사지침(CSDDD) · Scope 3 대응",
    date: "2026-10",
    authorOrDept: "한국딜로이트그룹 One ESG 센터",
    summary: [
      "제조·유통·IT 기업의 전체 온실가스 배출량 중 70~90%는 협력사 원부자재 구매 등 공급망(Scope 3 Category 1)에서 발생합니다. 따라서 구매(Procurement) 단계에서 탄소발자국과 ESG 기준을 적용하는 Green Procurement 전략이 Net-Zero 달성의 핵심 열쇠입니다.",
      "친환경 조달 품목 기준(Green Spec) 제정, 입찰 및 협력사 정기평가 시 ESG 가점·페널티 반영, 그리고 EU 공급망 실사지침(CSDDD) 대응을 위한 협력사 자가진단(SAQ)·현장 실사·시정조치(CAP) 표준 프로세스를 다룹니다.",
    ],
    keyTakeaways: [
      "원부자재 구매 입찰(RFP) 및 공급사 선정 평가표에 탄소발자국(PCF)·재생원료 비중 반영",
      "1·2차 협력사 대상 온라인 ESG 자가진단(SAQ) 배포 및 고위험 협력사 현장 실사 체계화",
      "협력사 임직원 온라인 ESG 교육 지원 및 수료증 일괄 관리를 통한 공급망 상생 증빙 확보",
    ],
    externalUrl: "https://www2.deloitte.com/kr/ko.html",
    relatedServiceId: "supply-chain",
  },
  {
    id: "pub-ey-responsible-investment",
    no: "06",
    category: "4대 회계법인",
    source: "EY한영",
    topicTag: "책임투자 · ESG 펀드",
    title: "책임투자(Responsible Investment)와 글로벌 연기금 · PEF의 ESG 펀드 운영 및 ESG 실사(DD) 트렌드",
    date: "2026-10",
    authorOrDept: "EY한영 기후변화 및 지속가능경영서비스(CCaSS)",
    summary: [
      "글로벌 기관투자자(LP)와 연기금의 위탁운용사 선정 시 책임투자(UN PRI) 이행 수준과 포트폴리오 금융배출량(PCAF) 관리 역량이 핵심 평가 지표로 작동하고 있습니다.",
      "자산운용사와 사모펀드(PEF)가 ESG 펀드를 기획·운용할 때 준수해야 할 국내외 공시 가이드라인(금감원 ESG 펀드 공시 기준, EU SFDR)과, M&A 투자 전 ESG 실사(Due Diligence)를 통해 인수 후 밸류업(Value Creation) 및 Exit 멀티플을 높이는 실전 전략을 분석합니다.",
    ],
    keyTakeaways: [
      "투자 생애주기(Sourcing → ESG DD → 100-Day Value-up → Exit) 전 과정의 ESG 통합(Integration)",
      "PCAF 표준 기반 포트폴리오 금융배출량 산정 및 K-Taxonomy(한국형 녹색분류체계) 적합성 검증",
      "펀드 그린워싱 규제 대응을 위한 명확한 스크리닝 기준과 연간 LP 임팩트 리포팅",
    ],
    externalUrl: "https://www.ey.com/ko_kr",
    relatedServiceId: "responsible-investment",
  },
];

export const publications: PublicationItem[] = [...corePublications, ...morePublications];

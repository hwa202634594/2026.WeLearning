/**
 * K-Star AI Studio - Celebrity Wikipedia Service
 * 실시간 한국어 위키백과(Wikipedia) REST API 연동 및 K-스타 인물 백과 모듈
 */

const WikiService = (() => {
  // 주요 탑 뉴스 인물 프리셋 보강 데이터
  const ENRICHED_PROFILES = {
    '뉴진스': {
      cleanName: 'NewJeans',
      koreanName: '뉴진스',
      type: '4인조 걸그룹',
      agency: '어도어 (ADOR / HYBE)',
      debut: '2022년 7월 22일',
      fandom: '버니즈 (Bunnies)',
      hits: ['Hype Boy', 'Ditto', 'OMG', 'Super Shy', 'How Sweet'],
      summary: '2022년 데뷔 이래 K-POP의 패러다임을 바꾼 독보적인 이지리스닝 음악과 레트로 Y2K 감성으로 빌보드 200 1위를 기록한 글로벌 슈퍼 루키 그룹입니다.',
      defaultPhoto: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
      keywords: ['빌보드 200 1위', '글로벌 앰버서더', 'Y2K 감성', '음원 차트 올킬']
    },
    '에스파': {
      cleanName: '에스파',
      koreanName: '에스파 (aespa)',
      type: '4인조 다국적 걸그룹 (카리나, 윈터, 지젤, 닝닝)',
      agency: 'SM엔터테인먼트',
      debut: '2020년 11월 17일',
      fandom: 'MY (마이)',
      hits: ['Black Mamba', 'Next Level', 'Savage', 'Drama', 'Supernova', 'Armageddon'],
      summary: '자신의 또 다른 자아인 아바타를 만나 새로운 세계를 경험하게 된다는 세계관과 메탈릭한 미래지향적 사운드로 쇠맛 신드롬을 일으킨 최정상 걸그룹입니다.',
      defaultPhoto: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80',
      keywords: ['슈퍼노바', '쇠맛 돌풍', '코첼라 메인', '밀리언셀러']
    },
    '방탄소년단': {
      cleanName: '방탄소년단',
      koreanName: '방탄소년단 (BTS)',
      type: '7인조 보이그룹 (RM, 진, 슈가, 제이홉, 지민, 뷔, 정국)',
      agency: '빅히트 뮤직 (HYBE)',
      debut: '2013년 6월 13일',
      fandom: '아미 (ARMY)',
      hits: ['Dynamite', 'Butter', '피 땀 눈물', '봄날', '작은 것들을 위한 시', 'Life Goes On'],
      summary: '한국 대중가수 최초로 미국 빌보드 핫 100 1위, 그래미 어워드 노미네이트 등 21세기 팝의 아이콘으로서 전 세계 음악사에 유례없는 신기록을 써 내려간 글로벌 아티스트입니다.',
      defaultPhoto: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
      keywords: ['빌보드 Hot 100 1위', '그래미 노미네이트', 'UN 연설', '스타디움 투어']
    },
    'BTS': {
      aliasOf: '방탄소년단'
    },
    '아이유': {
      cleanName: '아이유',
      koreanName: '아이유 (IU, 이지은)',
      type: '싱어송라이터 & 배우',
      agency: 'EDAM엔터테인먼트',
      debut: '2008년 9월 18일 (EP Lost and Found)',
      fandom: '유애나 (UAENA)',
      hits: ['좋은 날', '밤편지', '금요일에 만나요', '블루밍', 'Love wins all', '나의 아저씨', '호텔 델루나'],
      summary: '대한민국을 대표하는 독보적인 음원 퀸이자 싱어송라이터 겸 연기파 배우로, 여성 솔로 아티스트 최초 잠실주경기장 및 상암월드컵경기장 단독 콘서트를 전석 매진시켰습니다.',
      defaultPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      keywords: ['골든디스크 대상', '멜론 연간 1위', '월드투어 완판', '국민 여동생']
    },
    '송혜교': {
      cleanName: '송혜교',
      koreanName: '송혜교 (Song Hye-kyo)',
      type: '배우',
      agency: 'UAA',
      debut: '1996년 선경스마트 모델 선발대회',
      fandom: '글로벌 드라마 팬덤',
      hits: ['더 글로리', '태양의 후예', '그 겨울, 바람이 분다', '풀하우스', '올인', '가을동화'],
      summary: '한류 1세대를 이끈 대표 톱스타이자 넷플릭스 글로벌 1위를 기록한 <더 글로리> 문동은 역으로 백상예술대상 TV부문 최우수연기상을 수상하며 전성기를 이어가는 명품 배우입니다.',
      defaultPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      keywords: ['더 글로리 문동은', '백상예술대상 최우수상', '한류 여왕', '넷플릭스 글로벌 1위']
    },
    '공유': {
      cleanName: '공유_(배우)',
      koreanName: '공유 (Gong Yoo, 공지철)',
      type: '배우',
      agency: '매니지먼트 숲',
      debut: '2001년 KBS 드라마 학교 4',
      fandom: '유앤아이 (YOO&I)',
      hits: ['도깨비', '부산행', '오징어 게임', '커피프린스 1호점', '도가니', '밀정'],
      summary: '신드롬을 일으킨 드라마 <도깨비>와 천만 영화 <부산행>, 전 세계적 흥행작 <오징어 게임> 등 스크린과 브라운관을 넘나들며 글로벌한 신뢰를 받는 대한민국 대표 배우입니다.',
      defaultPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
      keywords: ['도깨비 김신', '천만 배우', '오징어 게임 딱지남', '글로벌 한류스타']
    }
  };

  /**
   * 이름 정규화 (괄호, 특수기호 제거 및 대표 명칭 매핑)
   */
  function normalizeName(rawName) {
    if (!rawName) return '';
    let name = rawName.trim();
    // 괄호 안 내용 추출 및 정규화 (예: "방탄소년단 (BTS)" -> "방탄소년단")
    const clean = name.replace(/\(.*\)/g, '').replace(/\[.*\]/g, '').trim();
    return clean || name;
  }

  /**
   * 연예인 텍스트에서 개별 인물 추출 (쉼표, 점, 슬래시 분리)
   * 예: "뉴진스, 에스파" -> ["뉴진스", "에스파"]
   */
  function extractCelebrities(starText) {
    if (!starText) return [];
    return starText
      .split(/[,·/&]|와|과/)
      .map(s => s.trim().replace(/\(.*\)/g, '').trim())
      .filter(s => s.length > 0 && s !== '대한민국 톱스타 군단');
  }

  /**
   * 한국어 위키백과 REST API 및 보강 데이터 결합 조회
   */
  async function getCelebrityWiki(name) {
    const normalized = normalizeName(name);
    let searchKey = normalized;

    // 별칭 매핑 (예: BTS -> 방탄소년단)
    if (ENRICHED_PROFILES[searchKey] && ENRICHED_PROFILES[searchKey].aliasOf) {
      searchKey = ENRICHED_PROFILES[searchKey].aliasOf;
    }

    const preset = ENRICHED_PROFILES[searchKey] || null;
    const wikiPageTitle = preset ? preset.cleanName : normalized;

    let apiData = null;
    try {
      const endpoint = `https://ko.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiPageTitle)}`;
      const response = await fetch(endpoint, {
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        apiData = await response.json();
      }
    } catch (err) {
      console.warn('Wikipedia API fetch failed, using fallback data:', err);
    }

    // 데이터 결합 및 최적화
    const title = apiData?.title || preset?.koreanName || normalized;
    const description = apiData?.description || preset?.type || '대한민국 대중문화 아티스트';
    const extract = apiData?.extract || preset?.summary || `${normalized}에 대한 실시간 연예 위키백과 프로필 정보입니다.`;
    const photoUrl = apiData?.thumbnail?.source || apiData?.originalimage?.source || preset?.defaultPhoto || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80';
    const wikiUrl = apiData?.content_urls?.desktop?.page || `https://ko.wikipedia.org/wiki/${encodeURIComponent(normalized)}`;

    return {
      name: normalized,
      displayTitle: title,
      description,
      extract,
      photoUrl,
      wikiUrl,
      hasLiveWiki: !!apiData,
      agency: preset?.agency || '대한민국 주요 엔터테인먼트',
      debut: preset?.debut || '공식 활동 중',
      fandom: preset?.fandom || '글로벌 K-CULTURE 팬덤',
      hits: preset?.hits || ['대표 활동 및 주요 히트작 다수'],
      keywords: preset?.keywords || ['실시간 핫토픽', '글로벌 트렌드', 'K-STAR 화제성']
    };
  }

  return {
    ENRICHED_PROFILES,
    normalizeName,
    extractCelebrities,
    getCelebrityWiki
  };
})();

if (typeof window !== 'undefined') {
  window.WikiService = WikiService;
}

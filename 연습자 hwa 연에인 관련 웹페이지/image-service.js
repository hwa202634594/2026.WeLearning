/**
 * K-Star AI Studio - Image Service
 * 연예 뉴스 비주얼 연동, AI 이미지 생성(Pollinations API), 캔버스 카드 합성 및 다운로드 모듈
 */

const ImageService = (() => {
  // 고화질 연예 뉴스 프리셋 라이브러리 (카테고리별 테마)
  const PRESET_GALLERY = {
    idol: [
      {
        url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
        caption: '화려한 레이저와 조명 속 대형 아레나 월드투어 무대 퍼포먼스',
        badge: 'LIVE STAGE'
      },
      {
        url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
        caption: '열광하는 수만 명의 관객과 호흡하는 글로벌 K-POP 콘서트',
        badge: 'CONCERT'
      },
      {
        url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80',
        caption: '컴백 무대에서 독보적인 비주얼을 발산하는 현장',
        badge: 'COMEBACK'
      }
    ],
    drama: [
      {
        url: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80',
        caption: '글로벌 OTT 대작 시리즈 제작발표회 포토월 현장',
        badge: 'PRESS CON'
      },
      {
        url: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=1200&q=80',
        caption: '긴장감 넘치는 시네마틱 무드의 촬영 현장 비하인드',
        badge: 'BEHIND'
      },
      {
        url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=80',
        caption: '스크린을 압도하는 주연 배우들의 깊이 있는 눈빛',
        badge: 'CINEMA'
      }
    ],
    redcarpet: [
      {
        url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
        caption: '연말 시상식 레드카펫 위를 수놓은 럭셔리 드레스 자태',
        badge: 'RED CARPET'
      },
      {
        url: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=1200&q=80',
        caption: '수많은 프레스 플래시 세례를 받는 톱스타의 포즈',
        badge: 'AWARDS'
      }
    ],
    exclusive: [
      {
        url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
        caption: '스포트라이트 중심에 선 연예계 핫이슈의 주인공',
        badge: 'EXCLUSIVE'
      },
      {
        url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
        caption: '마이크 앞에 선 스타의 진솔한 입장 인터뷰 현장',
        badge: 'INTERVIEW'
      }
    ]
  };

  let currentImageSrc = 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80';
  let currentBadge = '속보';
  let currentHeadline = 'K-STAR NEWS AI 스튜디오';
  let currentSub = '실시간 대한민국 연예 핫뉴스 & 보도 사진';

  /**
   * 카테고리/키워드에 맞는 최적의 이미지 가져오기
   */
  function pickPresetByCategory(category) {
    const list = PRESET_GALLERY[category] || PRESET_GALLERY.idol;
    const item = list[Math.floor(Math.random() * list.length)];
    return item;
  }

  /**
   * 무료 실시간 AI 이미지 생성 (Pollinations AI)
   * 연예 보도 뉴스 사진 스타일에 최적화된 프롬프트 생성
   */
  function buildAiImageUrl(starName, topicTitle, category) {
    const cleanStar = starName ? starName.trim() : 'Korean top celebrity';
    const seed = Math.floor(Math.random() * 999999);
    
    // 언론사 프레스 포토, 고화질 4k 연예 뉴스 보도 스타일 프롬프트
    const prompt = `Korean entertainment press photo of ${cleanStar}, ${topicTitle}, red carpet award show or press conference, paparazzi camera flash, cinematic lighting, ultra-realistic portrait, 8k photography, Reuters entertainment news style`;
    
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1200&height=750&nologo=true&seed=${seed}`;
  }

  /**
   * 카드뉴스 캔버스 이미지 생성 및 PNG 다운로드
   */
  function exportCardAsImage({ badgeText, headlineText, subText }) {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      const width = 1200;
      const height = 750;
      canvas.width = width;
      canvas.height = height;

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = currentImageSrc;

      img.onload = () => {
        // 1. 배경 이미지 드로우 (커버 비율)
        const hRatio = canvas.width / img.width;
        const vRatio = canvas.height / img.height;
        const ratio = Math.max(hRatio, vRatio);
        const centerShiftX = (canvas.width - img.width * ratio) / 2;
        const centerShiftY = (canvas.height - img.height * ratio) / 2;
        ctx.drawImage(img, 0, 0, img.width, img.height, centerShiftX, centerShiftY, img.width * ratio, img.height * ratio);

        // 2. 비네팅 & 하단 그라디언트 오버레이
        const gradient = ctx.createLinearGradient(0, height * 0.35, 0, height);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.55)');
        gradient.addColorStop(1, 'rgba(5, 8, 15, 0.95)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // 상단 가벼운 딤 처리
        const topGrad = ctx.createLinearGradient(0, 0, 0, 160);
        topGrad.addColorStop(0, 'rgba(0, 0, 0, 0.6)');
        topGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = topGrad;
        ctx.fillRect(0, 0, width, 160);

        // 3. 상단 워터마크 로고 & LIVE 태그
        ctx.fillStyle = '#ff2d55';
        ctx.beginPath();
        ctx.roundRect(50, 40, 110, 36, 6);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 18px Pretendard, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(badgeText || currentBadge || 'HOT NEWS', 105, 58);

        // 우측 워터마크
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.font = '800 20px Outfit, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('K-STAR NEWS AI', width - 50, 58);

        // 4. 하단 자막바 디자인
        const bottomBoxY = height - 170;
        
        // 붉은 악센트 바
        ctx.fillStyle = '#ff2d55';
        ctx.fillRect(50, bottomBoxY, 8, 90);

        // 헤드라인 (자동 줄바꿈 처리)
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 38px Pretendard, sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';

        const rawTitle = headlineText || currentHeadline;
        const maxTextWidth = width - 130;
        
        let displayTitle = rawTitle;
        if (ctx.measureText(displayTitle).width > maxTextWidth) {
          // 글자 수 축약 또는 2줄 표시
          while (ctx.measureText(displayTitle + '...').width > maxTextWidth && displayTitle.length > 0) {
            displayTitle = displayTitle.slice(0, -1);
          }
          displayTitle += '...';
        }
        ctx.fillText(displayTitle, 75, bottomBoxY + 5);

        // 서브 캡션
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '500 22px Pretendard, sans-serif';
        const sub = subText || currentSub;
        ctx.fillText(sub, 75, bottomBoxY + 55);

        // 다운로드 실행
        try {
          const dataUrl = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          const filename = `K-STAR_NEWS_${Date.now()}.png`;
          link.download = filename;
          link.href = dataUrl;
          link.click();
          resolve(filename);
        } catch (e) {
          console.warn('Canvas toDataURL CORS restricted, saving snapshot fallback', e);
          // CORS 이슈 발생 시 새 탭으로 원본 열기 지원
          window.open(currentImageSrc, '_blank');
          resolve(null);
        }
      };

      img.onerror = (err) => {
        reject(err);
      };
    });
  }

  return {
    PRESET_GALLERY,
    pickPresetByCategory,
    buildAiImageUrl,
    exportCardAsImage,
    setCurrent: (src, badge, headline, sub) => {
      if (src) currentImageSrc = src;
      if (badge) currentBadge = badge;
      if (headline) currentHeadline = headline;
      if (sub) currentSub = sub;
    },
    getCurrentImageSrc: () => currentImageSrc
  };
})();

if (typeof window !== 'undefined') {
  window.ImageService = ImageService;
}

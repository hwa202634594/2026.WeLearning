/**
 * K-Star AI Studio - Application Logic
 * 대한민국 연예 탑뉴스 AI 글쓰기 툴 핵심 로직
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const trendChipsContainer = document.getElementById('trendChips');
  const starInput = document.getElementById('starInput');
  const topicInput = document.getElementById('topicInput');
  const detailsInput = document.getElementById('detailsInput');
  const formatCards = document.querySelectorAll('.format-card');
  const imageTabs = document.querySelectorAll('.image-tab');
  const generateBtn = document.getElementById('generateBtn');
  
  const articleBody = document.getElementById('articleBody');
  const articleDate = document.getElementById('articleDate');
  const articleCategory = document.getElementById('articleCategory');
  const wordCountBadge = document.getElementById('wordCountBadge');
  
  const visualImg = document.getElementById('visualImg');
  const overlayBadge = document.getElementById('overlayBadge');
  const overlayHeadline = document.getElementById('overlayHeadline');
  const overlaySub = document.getElementById('overlaySub');
  const imageStatusText = document.getElementById('imageStatusText');
  
  const btnDownloadCard = document.getElementById('btnDownloadCard');
  const btnChangeImage = document.getElementById('btnChangeImage');
  const btnUploadImage = document.getElementById('btnUploadImage');
  const imageFileInput = document.getElementById('imageFileInput');
  
  const btnCopyText = document.getElementById('btnCopyText');
  const btnCopyMd = document.getElementById('btnCopyMd');
  const btnSpeak = document.getElementById('btnSpeak');
  const btnSettings = document.getElementById('btnSettings');
  
  const settingsModal = document.getElementById('settingsModal');
  const closeSettingsBtn = document.getElementById('closeSettingsBtn');
  const saveSettingsBtn = document.getElementById('saveSettingsBtn');
  const apiKeyInput = document.getElementById('apiKeyInput');
  
  const toastContainer = document.getElementById('toastContainer');

  // Application State
  let currentFormat = 'standard';
  let currentImageMode = 'curated'; // 'curated' | 'ai' | 'upload'
  let currentTopicCategory = 'idol';
  let generatedResult = null;
  let isGenerating = false;
  let isSpeaking = false;
  let speechSynthUtterance = null;

  // Preset Entertainment Top News
  const HOT_TRENDS = [
    {
      category: 'idol',
      tag: '음악/글로벌',
      title: '뉴진스·에스파 빌보드 200 최상위권 동시 석권... K-POP 새 지평',
      star: '뉴진스, 에스파',
      topic: '빌보드 200 메인 앨범 차트 동시 TOP 5 진입 및 글로벌 월드투어 완판',
      details: '음원 공개 2주 만에 글로벌 스트리밍 3억 회 돌파, 북미 및 유럽 15개 도시 아레나 스타디움 투어 전석 매진 신기록'
    },
    {
      category: 'exclusive',
      tag: '단독/특종',
      title: '[단독] 방탄소년단(BTS) 완전체 컴백 카운트다운... 역대급 월드투어 예고',
      star: '방탄소년단 (BTS)',
      topic: '군 복무 완료 후 완전체 컴백 앨범 및 글로벌 스타디움 메가 투어 계획 발표',
      details: '글로벌 팝스타 피처링 참여 소식 및 서울 주경기장을 시작으로 전 세계 25개국 50회 이상 초대형 스타디움 투어 확정'
    },
    {
      category: 'drama',
      tag: '드라마/OTT',
      title: '송혜교·공유 주연 500억 텐트폴 시리즈 넷플릭스 1위 폭발',
      star: '송혜교, 공유',
      topic: '대한민국 시대극 대작 글로벌 80개국 1위 및 칸 시리즈 페스티벌 초청',
      details: '방영 첫 주 만에 넷플릭스 글로벌 비영어권 TV 부문 1위, 탄탄한 서사와 압도적 영상미로 외신 극찬 쇄도'
    },
    {
      category: 'redcarpet',
      tag: '시상식/패션',
      title: '백상예술대상 레드카펫, 스타들의 눈부신 드레스와 스포트라이트',
      star: '대한민국 톱스타 군단',
      topic: '연예계 최대 축제 백상예술대상 레드카펫 현장 패션 및 플래시 세례',
      details: '독보적인 블랙 앤 화이트 드레스코드, 글로벌 럭셔리 하우스 앰버서더들의 화려한 비주얼 경쟁과 팬들의 뜨거운 환호'
    },
    {
      category: 'idol',
      tag: '음원/차트',
      title: '아이유 신곡 발표 1시간 만에 멜론 TOP 100 퍼펙트 올킬(PAK)',
      star: '아이유 (IU)',
      topic: '새 싱글 발매 직후 국내외 전 음원 차트 1위 및 유튜브 인급동 싹쓸이',
      details: '발매 직후 실시간 이용자 수 60만 명 돌파, 서정적인 멜로디와 독보적인 음색으로 대중과 평단의 동시 찬사'
    }
  ];

  // Initialize UI
  initDate();
  renderTrends();
  initEventListeners();
  loadSavedApiKey();

  function initDate() {
    const now = new Date();
    const formatted = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    articleDate.textContent = formatted;
  }

  function renderTrends() {
    trendChipsContainer.innerHTML = '';
    HOT_TRENDS.forEach((trend, index) => {
      const chip = document.createElement('div');
      chip.className = `trend-chip ${index === 0 ? 'active' : ''}`;
      chip.innerHTML = `
        <span class="chip-tag">${trend.tag}</span>
        <span class="chip-title">${trend.title}</span>
      `;
      chip.addEventListener('click', () => {
        document.querySelectorAll('.trend-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        selectTrend(trend);
      });
      trendChipsContainer.appendChild(chip);
    });

    // Default first selection
    selectTrend(HOT_TRENDS[0]);
  }

  function selectTrend(trend) {
    starInput.value = trend.star;
    topicInput.value = trend.topic;
    detailsInput.value = trend.details;
    currentTopicCategory = trend.category;

    // Update Visual Preview to match
    updateVisualImage(trend.title, trend.star, trend.category);
  }

  function initEventListeners() {
    // Format Cards
    formatCards.forEach(card => {
      card.addEventListener('click', () => {
        formatCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        currentFormat = card.dataset.format;
        showToast(`글쓰기 모드: ${card.querySelector('.format-title').textContent} 선택`);
      });
    });

    // Image Source Tabs
    imageTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        imageTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentImageMode = tab.dataset.mode;
        
        if (currentImageMode === 'upload') {
          imageFileInput.click();
        } else {
          showToast(`이미지 모드: ${tab.textContent}`);
          refreshCurrentImage();
        }
      });
    });

    // Upload Image Handler
    imageFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          visualImg.src = event.target.result;
          ImageService.setCurrent(event.target.result, '현장 포토', overlayHeadline.textContent, overlaySub.textContent);
          imageStatusText.innerHTML = `<span>📷 업로드된 맞춤 포토 연동 완료</span>`;
          showToast('로컬 이미지가 성공적으로 연동되었습니다.');
        };
        reader.readAsDataURL(file);
      }
    });

    btnUploadImage.addEventListener('click', () => {
      imageFileInput.click();
    });

    // Change / Re-roll Image
    btnChangeImage.addEventListener('click', () => {
      refreshCurrentImage(true);
    });

    // Download Card as PNG
    btnDownloadCard.addEventListener('click', async () => {
      try {
        btnDownloadCard.disabled = true;
        btnDownloadCard.innerHTML = `<span>⏳ 렌더링 중...</span>`;
        await ImageService.exportCardAsImage({
          badgeText: overlayBadge.textContent,
          headlineText: overlayHeadline.textContent,
          subText: overlaySub.textContent
        });
        showToast('뉴스 카드 이미지가 다운로드되었습니다!');
      } catch (err) {
        showToast('이미지 저장 중 오류가 발생했습니다.');
      } finally {
        btnDownloadCard.disabled = false;
        btnDownloadCard.innerHTML = `<span>💾 카드 다운로드 (PNG)</span>`;
      }
    });

    // Generate Button
    generateBtn.addEventListener('click', handleGenerate);

    // Copy Plain Text
    btnCopyText.addEventListener('click', () => {
      if (!generatedResult) return showToast('먼저 기사를 생성해 주세요.');
      navigator.clipboard.writeText(generatedResult.plainText).then(() => {
        showToast('기사 전문이 클립보드에 복사되었습니다.');
      });
    });

    // Copy Markdown
    btnCopyMd.addEventListener('click', () => {
      if (!generatedResult) return showToast('먼저 기사를 생성해 주세요.');
      navigator.clipboard.writeText(generatedResult.markdown).then(() => {
        showToast('마크다운 형식이 클립보드에 복사되었습니다.');
      });
    });

    // TTS Voice Briefing
    btnSpeak.addEventListener('click', handleSpeech);

    // Settings Modal
    btnSettings.addEventListener('click', () => {
      settingsModal.classList.add('open');
    });

    closeSettingsBtn.addEventListener('click', () => {
      settingsModal.classList.remove('open');
    });

    saveSettingsBtn.addEventListener('click', () => {
      const key = apiKeyInput.value.trim();
      localStorage.setItem('kstar_gemini_api_key', key);
      settingsModal.classList.remove('open');
      showToast(key ? 'Gemini API Key가 저장되었습니다!' : '기본 내장 AI 모드로 전환되었습니다.');
    });
  }

  function loadSavedApiKey() {
    const saved = localStorage.getItem('kstar_gemini_api_key');
    if (saved) apiKeyInput.value = saved;
  }

  function refreshCurrentImage(forceNewSeed = false) {
    const star = starInput.value || '대한민국 톱스타';
    const topic = topicInput.value || '연예 핫뉴스';
    updateVisualImage(topic, star, currentTopicCategory, forceNewSeed);
  }

  function updateVisualImage(headline, star, category, forceNewSeed = false) {
    if (currentImageMode === 'curated') {
      const preset = ImageService.pickPresetByCategory(category);
      visualImg.src = preset.url;
      overlayBadge.textContent = preset.badge || '속보';
      overlayHeadline.textContent = headline.slice(0, 36);
      overlaySub.textContent = `${star} | K-STAR 보도국`;
      imageStatusText.innerHTML = `<span>📸 포토: ${preset.caption}</span>`;
      ImageService.setCurrent(preset.url, preset.badge, headline, `${star} | K-STAR 보도국`);
    } else if (currentImageMode === 'ai') {
      imageStatusText.innerHTML = `<span class="spinner"></span> AI 연예 뉴스 포토 생성 중...`;
      const aiUrl = ImageService.buildAiImageUrl(star, headline, category);
      
      const tempImg = new Image();
      tempImg.src = aiUrl;
      tempImg.onload = () => {
        visualImg.src = aiUrl;
        overlayBadge.textContent = 'AI PHOTO';
        overlayHeadline.textContent = headline.slice(0, 36);
        overlaySub.textContent = `${star} | 단독 포토`;
        imageStatusText.innerHTML = `<span>✨ Pollinations AI 고화질 프레스 포토 연동 완료</span>`;
        ImageService.setCurrent(aiUrl, 'AI PHOTO', headline, `${star} | 단독 포토`);
      };
      tempImg.onerror = () => {
        // Fallback to curated if network issues
        const preset = ImageService.pickPresetByCategory(category);
        visualImg.src = preset.url;
        imageStatusText.innerHTML = `<span>📸 대체 프리셋 포토 연동</span>`;
      };
    }
  }

  async function handleGenerate() {
    if (isGenerating) return;

    const star = starInput.value.trim();
    const topic = topicInput.value.trim();
    const details = detailsInput.value.trim();

    if (!topic) {
      showToast('기사 주제 또는 핫토픽을 입력해 주세요.');
      topicInput.focus();
      return;
    }

    isGenerating = true;
    generateBtn.disabled = true;
    generateBtn.innerHTML = `<span class="spinner"></span> AI 기사 및 비주얼 생성 중...`;
    
    // Stop any ongoing speech
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    btnSpeak.classList.remove('playing');
    btnSpeak.innerHTML = `<span>🔊 음성 브리핑</span>`;

    // 1. Update Visual Studio
    updateVisualImage(topic, star, currentTopicCategory);

    // 2. Generate Content
    const apiKey = localStorage.getItem('kstar_gemini_api_key');
    let articleData = null;

    try {
      if (apiKey) {
        articleData = await generateWithGeminiApi(apiKey, star, topic, details, currentFormat);
      } else {
        // High quality intelligent built-in generator
        articleData = generateWithBuiltInEngine(star, topic, details, currentFormat);
      }

      generatedResult = articleData;
      articleCategory.textContent = getFormatCategoryLabel(currentFormat);
      initDate();

      // Streaming Typewriter Effect
      await streamArticleContent(articleData.html, articleData.plainText);

    } catch (err) {
      console.error(err);
      showToast('생성 중 오류가 발생했습니다. 기본 엔진으로 전환합니다.');
      articleData = generateWithBuiltInEngine(star, topic, details, currentFormat);
      generatedResult = articleData;
      await streamArticleContent(articleData.html, articleData.plainText);
    } finally {
      isGenerating = false;
      generateBtn.disabled = false;
      generateBtn.innerHTML = `<span>⚡ AI 연예 뉴스 기사 & 비주얼 생성</span>`;
    }
  }

  function getFormatCategoryLabel(fmt) {
    switch (fmt) {
      case 'standard': return '정통 연예 기사 / 특종';
      case 'blog': return '네이버/다음 블로그 리뷰';
      case 'sns': return '인스타 & 스레드 카드뉴스';
      case 'shorts': return '유튜브 쇼츠 / 릴스 대본';
      default: return '연예 뉴스';
    }
  }

  /**
   * Built-in Professional Entertainment News Generation Engine
   */
  function generateWithBuiltInEngine(star, topic, details, format) {
    const starName = star || '해당 아티스트';
    const mainTopic = topic || '연예계 핫이슈';
    const subDetails = details || '관계자들의 뜨거운 관심 속에 팬들의 축하가 이어지고 있다.';
    
    let html = '';
    let plainText = '';
    let markdown = '';
    let headline = '';

    if (format === 'standard') {
      headline = `[단독] ${starName}, ${mainTopic}... "글로벌 신드롬 재입증"`;
      const summaryPoints = [
        `${starName}, 독보적 화제성 속 연예계 중심 우뚝`,
        `주요 팩트: ${subDetails.slice(0, 45)}...`,
        `국내외 외신 및 팬덤 열광적인 반응 쇄도`
      ];

      const bodyText1 = `[K-STAR NEWS 취재팀] 대한민국을 대표하는 스타 ${starName}이(가) 또 한 번 대중문화계의 역사를 새로 쓰고 있다. 10일 복수의 연예계 관계자에 따르면, ${starName}은(는) 최근 '${mainTopic}'을(를) 통해 글로벌 팬들과 대중의 폭발적인 스포트라이트를 한몸에 받고 있다.`;
      const bodyText2 = `이번 이슈의 핵심은 ${subDetails}라는 점이다. 현장 관계자는 "프로젝트 기획 초기부터 ${starName} 특유의 독보적인 아우라와 프로페셔널한 역량이 완벽히 어우러져 기대 이상의 결과물이 탄생했다"라며 "국내뿐 아니라 북미, 아시아 등 해외 메이저 플랫폼에서도 러브콜이 쏟아지고 있는 상황"이라고 분위기를 전했다.`;
      const bodyText3 = `소식이 전해지자 각종 온라인 커뮤니티와 글로벌 SNS에서는 "역시 대체 불가능한 클래스", "기다린 보람이 있다", "연예계 원탑의 위엄" 등 열렬한 환호와 지지 댓글이 잇따르고 있다. 한편, ${starName}은(는) 이번 성과를 발판 삼아 향후 더욱 다채로운 공식 활동과 무대를 통해 팬들과 만날 예정이다.`;
      
      const hashtags = [`#${starName.replace(/\s+/g, '')}`, `#연예탑뉴스`, `#특종`, `#K컬처`, `#단독보도`];

      html = `
        <h1>${headline}</h1>
        <div class="summary-box">
          <strong>📌 3줄 핵심 요약</strong>
          <ul>
            ${summaryPoints.map(p => `<li>${p}</li>`).join('')}
          </ul>
        </div>
        <p>${bodyText1}</p>
        <p>${bodyText2}</p>
        <p>${bodyText3}</p>
        <div class="hashtag-box">
          ${hashtags.map(h => `<span class="hashtag-tag">${h}</span>`).join('')}
        </div>
      `;

      plainText = `${headline}\n\n[3줄 요약]\n- ${summaryPoints.join('\n- ')}\n\n${bodyText1}\n\n${bodyText2}\n\n${bodyText3}\n\n${hashtags.join(' ')}`;
      markdown = `# ${headline}\n\n> **3줄 핵심 요약**\n> - ${summaryPoints.join('\n> - ')}\n\n${bodyText1}\n\n${bodyText2}\n\n${bodyText3}\n\n${hashtags.join(' ')}`;

    } else if (format === 'blog') {
      headline = `✨ 역대급 난리 난 ${starName}! ${mainTopic} 솔직 총정리 & 관전 포인트`;
      
      const intro = `안녕하세요, 연예 트렌드 전문 에디터입니다! 오늘은 지금 실시간 검색어와 SNS를 완전히 뒤흔들고 있는 <strong>${starName}</strong>의 초특급 소식을 발 빠르게 들고 왔습니다. 벌써부터 커뮤니티가 들썩이고 있는데요, 무슨 일인지 핵심만 쏙쏙 짚어드릴게요! 🔥`;
      const point1 = `<h3>Point 1. 왜 이렇게 반응이 뜨거울까?</h3><p>${subDetails} 특히 이번 ${mainTopic} 소식은 단순한 이슈를 넘어 팬들과 대중 모두의 기대치를 200% 충족시켰다는 평입니다. 현장 비하인드만 봐도 완성도가 장난이 아니었다고 하죠!</p>`;
      const point2 = `<h3>Point 2. 실시간 네티즌 & 팬덤 반응</h3><p>💬 "이 조합 실화냐...", "진짜 연예인 하려고 태어난 사람", "올해 최고의 도파민 충전이다" 등 벌써부터 각종 밈과 숏폼 영상이 폭발적으로 쏟아지고 있습니다.</p>`;
      const outro = `<p>앞으로 보여줄 행보가 더 기대되는 ${starName}! 여러분은 이번 소식 어떻게 보셨나요? 댓글로 여러분의 최애 모먼트를 자유롭게 남겨주세요! 공감과 이웃추가는 큰 힘이 됩니다. ❤️</p>`;
      
      const hashtags = [`#${starName}`, `#연예이슈`, `#블로그포스팅`, `#핫토픽`, `#추천`];

      html = `
        <h1>${headline}</h1>
        <p>${intro}</p>
        ${point1}
        ${point2}
        ${outro}
        <div class="hashtag-box">
          ${hashtags.map(h => `<span class="hashtag-tag">${h}</span>`).join('')}
        </div>
      `;

      plainText = `${headline}\n\n${intro.replace(/<[^>]*>?/gm, '')}\n\nPoint 1. 왜 이렇게 반응이 뜨거울까?\n${subDetails}\n\nPoint 2. 실시간 네티즌 반응\n폭발적인 환호와 지지 지속!\n\n${hashtags.join(' ')}`;
      markdown = `# ${headline}\n\n${intro.replace(/<[^>]*>?/gm, '')}\n\n### Point 1. 왜 이렇게 뜨거울까?\n${subDetails}\n\n### Point 2. 실시간 반응\n\n${hashtags.join(' ')}`;

    } else if (format === 'sns') {
      headline = `🚨 [속보] 지금 난리 난 ${starName}, ${mainTopic}`;
      const hook = `와… 이건 진짜 역대급이다… 🫢 방금 전 전 세계 팬들 도파민 폭발시킨 ${starName}의 레전드 순간!`;
      const points = [
        `✔️ 팩트 체크: ${subDetails}`,
        `✔️ 현장 분위기: 압도적 비주얼 + 폭발적 환호`,
        `✔️ 글로벌 차트 & SNS 실시간 트렌드 1위 장악!`
      ];
      const cta = `친구에게 공유하고 함께 소리 질러요! 📢 지금 바로 프로필 링크에서 상세 보도 사진 확인하기!`;
      const hashtags = [`#${starName}`, `#KSTAR`, `#실시간이슈`, `#연예인`, `#스레드`, `#인스타뉴스`];

      html = `
        <h1>${headline}</h1>
        <p style="font-size: 1.15rem; font-weight: 700; color: #ff6b8b;">${hook}</p>
        <div class="summary-box">
          <ul>
            ${points.map(p => `<li style="font-size: 1rem; margin-bottom: 6px;">${p}</li>`).join('')}
          </ul>
        </div>
        <p style="margin-top: 18px;">${cta}</p>
        <div class="hashtag-box">
          ${hashtags.map(h => `<span class="hashtag-tag">${h}</span>`).join('')}
        </div>
      `;

      plainText = `${headline}\n\n${hook}\n\n${points.join('\n')}\n\n${cta}\n\n${hashtags.join(' ')}`;
      markdown = `# ${headline}\n\n**${hook}**\n\n${points.map(p => `- ${p}`).join('\n')}\n\n${cta}\n\n${hashtags.join(' ')}`;

    } else if (format === 'shorts') {
      headline = `🎬 [쇼츠 대본] 60초 만에 끝내는 ${starName}의 ${mainTopic} 비하인드!`;
      
      const scriptItems = [
        { time: '00:00 ~ 00:05', type: 'HOOK', text: `(긴박한 효과음 + 줌인) "여러분, 방금 전 연예계에 터진 이 소식 들으셨습니까?!"` },
        { time: '00:05 ~ 00:20', type: 'SCENE 1', text: `글로벌 대세 ${starName}이(가) 또 한 번 세상을 뒤흔들었습니다. 바로 ${mainTopic} 때문인데요!` },
        { time: '00:20 ~ 00:40', type: 'SCENE 2', text: `(자료화면 플래시) 알고 보면 ${subDetails}라는 소식이 전해지면서 현재 커뮤니티는 그야말로 초토화 상태입니다.` },
        { time: '00:40 ~ 00:55', type: 'CLIMAX', text: `외신들도 '역대 최고 기록'이라며 입을 모으고 있는데요. 역시 ${starName}의 클라스는 영원합니다.` },
        { time: '00:55 ~ 01:00', type: 'OUTRO', text: `"여러분의 생각은 어떠신가요? 구독 누르고 다음 속보도 가장 빠르게 확인하세요!"` }
      ];

      html = `
        <h1>${headline}</h1>
        <p style="color: var(--text-accent); font-weight: 600;">⏱️ 예상 러닝타임: 60초 | 화면 비율: 9:16 세로형</p>
        <div style="margin-top: 18px; display: flex; flex-direction: column; gap: 14px;">
          ${scriptItems.map(item => `
            <div style="background: rgba(255,255,255,0.04); padding: 12px 16px; border-radius: 8px; border-left: 3px solid #8b5cf6;">
              <span style="color: #c4b5fd; font-weight: 700; font-size: 0.85rem;">[${item.time}] ${item.type}</span>
              <p style="margin: 6px 0 0 0; font-size: 0.98rem;">${item.text}</p>
            </div>
          `).join('')}
        </div>
      `;

      plainText = `${headline}\n\n` + scriptItems.map(i => `[${i.time}] ${i.type}\n${i.text}`).join('\n\n');
      markdown = `# ${headline}\n\n` + scriptItems.map(i => `**[${i.time}] ${i.type}**\n> ${i.text}`).join('\n\n');
    }

    return { headline, html, plainText, markdown };
  }

  /**
   * Optional Gemini API Generator
   */
  async function generateWithGeminiApi(apiKey, star, topic, details, format) {
    const prompt = `
당신은 대한민국 최고 권위의 연예 전문 미디어 기획자이자 수석 기자입니다.
다음 정보를 바탕으로 독자의 시선을 사로잡는 프리미엄 연예 콘텐츠를 작성해 주세요.

- 주인공/스타: ${star || '대한민국 톱스타'}
- 핵심 주제/토픽: ${topic}
- 세부 팩트/비하인드: ${details}
- 글쓰기 형식: ${getFormatCategoryLabel(format)}

규칙:
1. 헤드라인은 강력한 임팩트와 후킹이 있어야 합니다.
2. 내용은 풍부하고 전문적인 연예 보도 톤을 유지해야 합니다.
3. 3줄 핵심 요약, 본문(육하원칙), 생생한 반응, 관련 해시태그 5개를 반드시 포함해 주세요.
4. 마크다운 형식으로 깔끔하게 출력해 주세요.
    `;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API Error: ${response.statusText}`);
    }

    const data = await response.json();
    const rawMarkdown = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Simple markdown-to-html conversion for display
    const lines = rawMarkdown.split('\n');
    let headline = lines[0]?.replace(/^#+\s*/, '') || 'K-STAR NEWS AI';
    
    let html = rawMarkdown
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/\n\n/gim, '</p><p>')
      .replace(/\n/gim, '<br>');
    html = `<p>${html}</p>`;

    return {
      headline,
      html,
      plainText: rawMarkdown.replace(/[*#>`]/g, ''),
      markdown: rawMarkdown
    };
  }

  /**
   * Fast Streaming typewriter effect into DOM
   */
  async function streamArticleContent(htmlContent, plainText) {
    articleBody.innerHTML = '';
    
    // Quick render container
    const container = document.createElement('div');
    container.innerHTML = htmlContent;
    
    articleBody.appendChild(container);
    
    // Word Count
    const words = plainText.trim().length;
    wordCountBadge.textContent = `${words} 자 작성됨`;
    
    // Update visual banner headline
    if (generatedResult && generatedResult.headline) {
      overlayHeadline.textContent = generatedResult.headline.slice(0, 36);
    }
  }

  /**
   * Speech Synthesis Briefing
   */
  function handleSpeech() {
    if (!generatedResult) return showToast('먼저 기사를 생성해 주세요.');
    if (!('speechSynthesis' in window)) return showToast('이 브라우저는 음성 낭독을 지원하지 않습니다.');

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      isSpeaking = false;
      btnSpeak.classList.remove('playing');
      btnSpeak.innerHTML = `<span>🔊 음성 브리핑</span>`;
      return;
    }

    window.speechSynthesis.cancel();

    // Prepare speech text
    const textToRead = generatedResult.plainText.slice(0, 500); // 낭독용 첫 500자
    speechSynthUtterance = new SpeechSynthesisUtterance(textToRead);
    speechSynthUtterance.lang = 'ko-KR';
    speechSynthUtterance.rate = 1.05; // 깔끔한 뉴스 리딩 템포

    speechSynthUtterance.onstart = () => {
      isSpeaking = true;
      btnSpeak.classList.add('playing');
      btnSpeak.innerHTML = `<span>⏹️ 낭독 중지</span>`;
      showToast('아나운서 음성 브리핑을 시작합니다.');
    };

    speechSynthUtterance.onend = () => {
      isSpeaking = false;
      btnSpeak.classList.remove('playing');
      btnSpeak.innerHTML = `<span>🔊 음성 브리핑</span>`;
    };

    speechSynthUtterance.onerror = () => {
      isSpeaking = false;
      btnSpeak.classList.remove('playing');
      btnSpeak.innerHTML = `<span>🔊 음성 브리핑</span>`;
    };

    window.speechSynthesis.speak(speechSynthUtterance);
  }

  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>⚡</span> <span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.4s ease';
      setTimeout(() => toast.remove(), 400);
    }, 2800);
  }
});

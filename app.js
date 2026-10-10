/**
 * LEAGUE OF LEGENDS - LUX SUPPORT DYNAMIC PORTFOLIO
 * Candidate: Nguyễn Bá Tiệp (FTU K64 - Logistics & Supply Chain Management)
 * Main Interactive Engine
 */

(function() {
  'use strict';

  // =========================================================================
  // 1. ASSET INITIALIZATION & FALLBACK
  // =========================================================================
  const ASSETS = window.LOL_ASSETS || {
    summonersRift: 'assets/summoners-rift.jpg',
    luxAvatar: 'assets/lux-avatar.png',
    userAvatar: 'assets/user-avatar.png',
    luxUlt: 'assets/lux-ult.png',
    iconBot: 'assets/icon-bot.png',
    iconMid: 'assets/icon-mid.png',
    iconTop: 'assets/icon-top.png',
    iconJungle: 'assets/icon-jungle.png',
    iconSupport: 'assets/icon-support.png'
  };

  // Pre-apply assets to image tags
  function initAssets() {
    const luxHeaderAvatar = document.getElementById('luxHeaderAvatar');
    if (luxHeaderAvatar && ASSETS.luxAvatar) luxHeaderAvatar.src = ASSETS.luxAvatar;

    const luxSpriteImg = document.getElementById('luxSpriteImg');
    if (luxSpriteImg && ASSETS.luxAvatar) luxSpriteImg.src = ASSETS.luxAvatar;

    const userRealAvatar = document.getElementById('userRealAvatar');
    if (userRealAvatar && ASSETS.userAvatar) userRealAvatar.src = ASSETS.userAvatar;

    const mapImage = document.getElementById('mapImage');
    if (mapImage && ASSETS.summonersRift) mapImage.src = ASSETS.summonersRift;
  }

  // =========================================================================
  // 2. WEB AUDIO API SYNTHESIZER (NO EXTERNAL AUDIO FILES NEEDED)
  // =========================================================================
  let audioCtx = null;
  let isSoundEnabled = true;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // Ping sound: Authentic League of Legends "On My Way" ping chime
  function playPingSound() {
    if (!isSoundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, now); // A5
    osc1.frequency.exponentialRampToValueAtTime(1760, now + 0.12); // A6

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1320, now); // E6
    osc2.frequency.exponentialRampToValueAtTime(2640, now + 0.12);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.35);
    osc2.stop(now + 0.35);
  }

  // Beam charge sound: Rising energy vortex
  function playBeamCharge() {
    if (!isSoundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Sub rumble
    const sub = ctx.createOscillator();
    const subGain = ctx.createGain();
    sub.type = 'sawtooth';
    sub.frequency.setValueAtTime(80, now);
    sub.frequency.exponentialRampToValueAtTime(240, now + 0.8);
    subGain.gain.setValueAtTime(0.3, now);
    subGain.gain.exponentialRampToValueAtTime(0.01, now + 0.85);

    // Resonant high whistle
    const lead = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const leadGain = ctx.createGain();

    lead.type = 'triangle';
    lead.frequency.setValueAtTime(220, now);
    lead.frequency.exponentialRampToValueAtTime(1200, now + 0.8);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(400, now);
    filter.frequency.exponentialRampToValueAtTime(2500, now + 0.8);
    filter.Q.value = 4.0;

    leadGain.gain.setValueAtTime(0.2, now);
    leadGain.gain.exponentialRampToValueAtTime(0.4, now + 0.7);
    leadGain.gain.exponentialRampToValueAtTime(0.01, now + 0.85);

    lead.connect(filter);
    filter.connect(leadGain);
    leadGain.connect(ctx.destination);

    sub.connect(subGain);
    subGain.connect(ctx.destination);

    sub.start(now);
    lead.start(now);
    sub.stop(now + 0.85);
    lead.stop(now + 0.85);
  }

  // Beam blast sound: Tremendous laser explosion
  function playBeamBlast() {
    if (!isSoundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Noise burst for laser impact
    const bufferSize = ctx.sampleRate * 1.0;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(3000, now);
    noiseFilter.frequency.exponentialRampToValueAtTime(150, now + 0.9);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.5, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.9);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    // Deep sub drop
    const bass = ctx.createOscillator();
    const bassGain = ctx.createGain();
    bass.type = 'sine';
    bass.frequency.setValueAtTime(160, now);
    bass.frequency.exponentialRampToValueAtTime(40, now + 0.6);
    bassGain.gain.setValueAtTime(0.6, now);
    bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

    bass.connect(bassGain);
    bassGain.connect(ctx.destination);

    noise.start(now);
    bass.start(now);
    noise.stop(now + 1.0);
    bass.stop(now + 0.7);
  }

  // Pentakill Fanfare sound: Brass triumphant progression
  function playPentakillFanfare() {
    if (!isSoundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const chords = [
      { notes: [293.66, 369.99, 440.0], time: 0, dur: 0.3 },   // D4, F#4, A4
      { notes: [369.99, 440.0, 554.37], time: 0.25, dur: 0.35 },// F#4, A4, C#5
      { notes: [440.0, 587.33, 739.99], time: 0.55, dur: 1.2 }  // A4, D5, F#5
    ];

    chords.forEach(c => {
      c.notes.forEach(freq => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.15, now + c.time);
        gain.gain.exponentialRampToValueAtTime(0.001, now + c.time + c.dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + c.time);
        osc.stop(now + c.time + c.dur);
      });
    });
  }

  // Hextech UI Click
  function playClickSound() {
    if (!isSoundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.05);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  // Spell sounds (Q, W, E, D, F)
  function playSpellSound(type) {
    if (!isSoundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (type === 'W') { // Shield
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.25);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
    } else if (type === 'Q') { // Binding
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(500, now);
      osc.frequency.exponentialRampToValueAtTime(250, now + 0.2);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    } else if (type === 'Flash') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.15);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    } else { // Generic
      osc.type = 'sine';
      osc.frequency.setValueAtTime(350, now);
      osc.frequency.exponentialRampToValueAtTime(700, now + 0.2);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    }

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.4);
  }

  // =========================================================================
  // 3. MAP NODES, WAYPOINTS & PATHING ENGINE
  // =========================================================================
  const LANES = [
    {
      id: 'fountain',
      name: 'BỆ ĐÁ CỔ (XUẤT PHÁT)',
      x: 14,
      y: 83,
      markerId: 'marker-fountain',
      tabId: 'content-fountain',
      pillClass: 'base-pill',
      quote: 'Khởi đầu trận đấu tại Bệ Đá Cổ: Định hình mục tiêu và tâm thế gánh đội.'
    },
    {
      id: 'bot',
      name: 'ĐƯỜNG DƯỚI (HỌC VẤN FTU - LSCM)',
      x: 77,
      y: 86,
      markerId: 'marker-bot',
      tabId: 'content-bot',
      pillClass: 'bot-pill',
      quote: 'Laning Phase đường dưới vững vàng cùng chuyên ngành Logistics & Kinh doanh quốc tế FTU.'
    },
    {
      id: 'jungle',
      name: 'KHU VỰC RỪNG & SÔNG (KỸ NĂNG & TẦM NHÌN)',
      x: 36,
      y: 63,
      markerId: 'marker-jungle',
      tabId: 'content-jungle',
      pillClass: 'jg-pill',
      quote: 'Kiểm soát tầm nhìn, research thông tin, thiết kế Canva sáng tạo và giao tiếp linh hoạt.'
    },
    {
      id: 'mid',
      name: 'ĐƯỜNG GIỮA (KINH NGHIỆM LEADER & SALES)',
      x: 50,
      y: 50,
      markerId: 'marker-mid',
      tabId: 'content-mid',
      pillClass: 'mid-pill',
      quote: 'Đảo đường gank Mid: Lãnh đạo lớp đạt điểm A tuyệt đối và bản lĩnh Sales Smile Media.'
    },
    {
      id: 'top',
      name: 'ĐƯỜNG TRÊN (GIẢI THƯỞNG I-BUDDY)',
      x: 17,
      y: 23,
      markerId: 'marker-top',
      tabId: 'content-top',
      pillClass: 'top-pill',
      quote: 'Pha gank Top lật kèo: Đạt Giải 3 cuộc thi khởi nghiệp I-Buddy IBCONNECT.'
    }
  ];

  // Detailed Blue-Side Roaming Waypoints (Natural paths through jungle and river)
  const PATH_SEGMENTS = {
    // Fountain -> Bot
    'fountain_to_bot': [
      { x: 14, y: 83 },
      { x: 26, y: 86 },
      { x: 52, y: 88 },
      { x: 77, y: 86 }
    ],
    // Bot -> Jungle
    'bot_to_jungle': [
      { x: 77, y: 86 },
      { x: 65, y: 76 },
      { x: 48, y: 68 },
      { x: 36, y: 63 }
    ],
    // Jungle -> Mid
    'jungle_to_mid': [
      { x: 36, y: 63 },
      { x: 40, y: 55 },
      { x: 50, y: 50 }
    ],
    // Mid -> Top
    'mid_to_top': [
      { x: 50, y: 50 },
      { x: 36, y: 36 },
      { x: 22, y: 30 },
      { x: 17, y: 23 }
    ],
    // Top -> Fountain (completing 1 full circuit loop)
    'top_to_fountain': [
      { x: 17, y: 23 },
      { x: 15, y: 48 },
      { x: 14, y: 70 },
      { x: 14, y: 83 }
    ]
  };

  // State
  let currentLaneIndex = 0;
  let isAutoRoaming = false;
  let isMoving = false;
  let roamSpeed = 1; // 1x or 2x
  let luxPos = { x: 14, y: 83 };
  let movementAnimId = null;
  let autoRoamTimeoutId = null;

  // DOM Elements
  const luxSprite = document.getElementById('luxSprite');
  const luxPing = document.getElementById('luxPing');
  const currentLaneBadge = document.getElementById('currentLaneBadge');
  const autoRoamBtn = document.getElementById('autoRoamBtn');
  const autoRoamText = document.getElementById('autoRoamText');
  const prevLaneBtn = document.getElementById('prevLaneBtn');
  const nextLaneBtn = document.getElementById('nextLaneBtn');
  const roamProgressBar = document.getElementById('roamProgressBar');
  const mapPathCanvas = document.getElementById('mapPathCanvas');
  const mapContainer = document.getElementById('mapContainer');

  // Update Lux Sprite position on map (% coordinates)
  function setLuxPosition(x, y) {
    luxPos = { x, y };
    if (luxSprite) {
      luxSprite.style.left = `${x}%`;
      luxSprite.style.top = `${y}%`;
    }
  }

  // Draw glowing circuit path on map canvas
  function renderMapCircuitPath() {
    if (!mapPathCanvas) return;
    const ctx = mapPathCanvas.getContext('2d');
    const w = mapPathCanvas.width = mapContainer.clientWidth;
    const h = mapPathCanvas.height = mapContainer.clientHeight;
    ctx.clearRect(0, 0, w, h);

    // Full circuit sequence of points
    const fullCircuit = [
      ...PATH_SEGMENTS.fountain_to_bot,
      ...PATH_SEGMENTS.bot_to_jungle.slice(1),
      ...PATH_SEGMENTS.jungle_to_mid.slice(1),
      ...PATH_SEGMENTS.mid_to_top.slice(1),
      ...PATH_SEGMENTS.top_to_fountain.slice(1)
    ];

    // Draw outer glow path
    ctx.beginPath();
    fullCircuit.forEach((pt, idx) => {
      const px = (pt.x / 100) * w;
      const py = (pt.y / 100) * h;
      if (idx === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.closePath();

    ctx.strokeStyle = 'rgba(10, 200, 185, 0.35)';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Draw dashed core line
    ctx.beginPath();
    fullCircuit.forEach((pt, idx) => {
      const px = (pt.x / 100) * w;
      const py = (pt.y / 100) * h;
      if (idx === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.closePath();

    ctx.setLineDash([6, 6]);
    ctx.strokeStyle = 'rgba(240, 230, 210, 0.7)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Smooth movement along waypoints
  function moveLuxAlongPath(waypoints, onComplete) {
    if (movementAnimId) cancelAnimationFrame(movementAnimId);
    isMoving = true;

    // Show Ping at destination
    const destination = waypoints[waypoints.length - 1];
    if (luxPing) {
      luxPing.classList.add('active');
    }
    playPingSound();

    // Interpolate points
    const points = [];
    const stepsPerSegment = Math.max(15, Math.floor(30 / roamSpeed));

    for (let i = 0; i < waypoints.length - 1; i++) {
      const p0 = waypoints[i];
      const p1 = waypoints[i + 1];
      for (let s = 0; s < stepsPerSegment; s++) {
        const t = s / stepsPerSegment;
        points.push({
          x: p0.x + (p1.x - p0.x) * t,
          y: p0.y + (p1.y - p0.y) * t
        });
      }
    }
    points.push(destination);

    let currStep = 0;

    function step() {
      if (currStep < points.length) {
        setLuxPosition(points[currStep].x, points[currStep].y);
        currStep++;
        movementAnimId = requestAnimationFrame(step);
      } else {
        setLuxPosition(destination.x, destination.y);
        isMoving = false;
        if (luxPing) luxPing.classList.remove('active');
        if (onComplete) onComplete();
      }
    }

    movementAnimId = requestAnimationFrame(step);
  }

  // Travel to a specific lane index
  function goToLane(laneIndex, isAutoTrigger = false) {
    if (laneIndex < 0) laneIndex = LANES.length - 1;
    if (laneIndex >= LANES.length) laneIndex = 0;

    const fromLane = LANES[currentLaneIndex];
    const targetLane = LANES[laneIndex];
    currentLaneIndex = laneIndex;

    // Determine path waypoints
    let pathKey = `${fromLane.id}_to_${targetLane.id}`;
    let waypoints = PATH_SEGMENTS[pathKey];

    if (!waypoints) {
      // Direct interpolate if no specific named segment
      waypoints = [
        { x: luxPos.x, y: luxPos.y },
        { x: (luxPos.x + targetLane.x) / 2, y: (luxPos.y + targetLane.y) / 2 },
        { x: targetLane.x, y: targetLane.y }
      ];
    }

    // Update active marker UI
    LANES.forEach((l, idx) => {
      const m = document.getElementById(l.markerId);
      if (m) {
        if (idx === laneIndex) m.classList.add('active-marker');
        else m.classList.remove('active-marker');
      }
    });

    // Update Badge text
    if (currentLaneBadge) {
      currentLaneBadge.textContent = targetLane.name;
    }

    // Update progress bar
    if (roamProgressBar) {
      const progressPercent = ((laneIndex + 1) / LANES.length) * 100;
      roamProgressBar.style.width = `${progressPercent}%`;
    }

    // Move Lux along the path
    moveLuxAlongPath(waypoints, () => {
      // Arrived at lane!
      showCVSection(targetLane.id);

      // If auto-roaming, schedule next lane
      if (isAutoRoaming) {
        const pauseTime = (4500 / roamSpeed); // Time to read CV section
        autoRoamTimeoutId = setTimeout(() => {
          if (isAutoRoaming) {
            goToLane((currentLaneIndex + 1) % LANES.length, true);
          }
        }, pauseTime);
      }
    });
  }

  // Show corresponding CV content tab
  function showCVSection(laneId) {
    // Hide all sections
    document.querySelectorAll('.cv-lane-content').forEach(el => {
      el.classList.remove('active');
    });

    // Show target section
    const targetContent = document.getElementById(`content-${laneId}`);
    if (targetContent) {
      targetContent.classList.add('active');
    }

    // Update tab button active states
    document.querySelectorAll('.tab-btn').forEach(btn => {
      if (btn.dataset.lane === laneId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // Toggle Auto-Roam
  function toggleAutoRoam() {
    isAutoRoaming = !isAutoRoaming;
    if (isAutoRoaming) {
      autoRoamBtn.classList.add('active');
      autoRoamText.textContent = 'ĐANG ĐẢO ĐƯỜNG (DỪNG)';
      playClickSound();
      // Start moving to next lane
      goToLane((currentLaneIndex + 1) % LANES.length, true);
    } else {
      autoRoamBtn.classList.remove('active');
      autoRoamText.textContent = 'TỰ ĐỘNG ĐẢO ĐƯỜNG';
      if (autoRoamTimeoutId) clearTimeout(autoRoamTimeoutId);
    }
  }

  // =========================================================================
  // 4. INTERACTIVE FEATURE: LUX R (CẦU VỒNG TỐI THƯỢNG - FINAL SPARK)
  // =========================================================================
  let isAimingR = false;
  let aimTarget = { x: 50, y: 50 };
  const aimCrosshair = document.getElementById('aimCrosshair');
  const vfxCanvas = document.getElementById('vfxCanvas');
  const pentakillBanner = document.getElementById('pentakillBanner');
  const recruiterModal = document.getElementById('recruiterModal');

  function resizeVfxCanvas() {
    if (vfxCanvas) {
      vfxCanvas.width = window.innerWidth;
      vfxCanvas.height = window.innerHeight;
    }
  }
  window.addEventListener('resize', () => {
    resizeVfxCanvas();
    renderMapCircuitPath();
  });

  // Start Aiming R
  function activateAimingR() {
    playClickSound();
    isAimingR = true;
    if (aimCrosshair) aimCrosshair.classList.remove('hidden');

    // Visual pulse on skill slot
    const skillR = document.getElementById('skillR');
    if (skillR) skillR.style.transform = 'scale(1.15)';
  }

  // Cancel Aiming R
  function cancelAimingR() {
    isAimingR = false;
    if (aimCrosshair) aimCrosshair.classList.add('hidden');
    const skillR = document.getElementById('skillR');
    if (skillR) skillR.style.transform = '';
  }

  // FIRE LUX ULTIMATE BEAM!
  function fireFinalSpark(targetScreenX, targetScreenY) {
    cancelAimingR();

    // Lux position in screen coordinates
    const luxRect = luxSprite.getBoundingClientRect();
    const startX = luxRect.left + luxRect.width / 2;
    const startY = luxRect.top + luxRect.height / 2;

    // Default target if not clicked on screen
    let endX = targetScreenX || (window.innerWidth * 0.7);
    let endY = targetScreenY || (window.innerHeight * 0.3);

    // Audio: Channeling charge
    playBeamCharge();

    // Channeling energy rings on canvas for 350ms before blast
    let channelTime = 0;
    const channelDuration = 22; // frames ~350ms
    const ctx = vfxCanvas.getContext('2d');

    function animateChannel() {
      ctx.clearRect(0, 0, vfxCanvas.width, vfxCanvas.height);

      if (channelTime < channelDuration) {
        // Draw spinning celestial runes around Lux
        ctx.save();
        ctx.translate(startX, startY);
        ctx.rotate((channelTime * 0.2));
        
        ctx.beginPath();
        ctx.arc(0, 0, 30 + channelTime * 1.5, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(241, 196, 15, ${0.5 + channelTime / channelDuration * 0.5})`;
        ctx.lineWidth = 4;
        ctx.stroke();

        // Cross rays
        for (let i = 0; i < 4; i++) {
          ctx.rotate(Math.PI / 2);
          ctx.beginPath();
          ctx.moveTo(-15, 0);
          ctx.lineTo(15, 0);
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
        ctx.restore();

        // Thin red warning laser to target
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = `rgba(232, 64, 87, ${0.4 + Math.sin(channelTime) * 0.3})`;
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        channelTime++;
        requestAnimationFrame(animateChannel);
      } else {
        // CHARGE COMPLETE -> BLAST!
        triggerBeamBlastAnimation(startX, startY, endX, endY);
      }
    }

    requestAnimationFrame(animateChannel);
  }

  // Massive Laser Beam Blast Animation
  function triggerBeamBlastAnimation(x0, y0, x1, y1) {
    playBeamBlast();

    // Add screen shake
    const appRoot = document.getElementById('appRoot');
    if (appRoot) {
      appRoot.classList.remove('shake-screen');
      void appRoot.offsetWidth; // trigger reflow
      appRoot.classList.add('shake-screen');
    }

    // Extend beam past target across whole screen
    const dx = x1 - x0;
    const dy = y1 - y0;
    const len = Math.hypot(dx, dy) || 1;
    const extendDist = 2500;
    const finalEndX = x0 + (dx / len) * extendDist;
    const finalEndY = y0 + (dy / len) * extendDist;

    const ctx = vfxCanvas.getContext('2d');
    let blastFrame = 0;
    const maxBlastFrames = 45; // ~750ms

    // Particles along beam
    const particles = [];
    for (let p = 0; p < 80; p++) {
      const dist = Math.random() * 1200;
      particles.push({
        x: x0 + (dx / len) * dist + (Math.random() - 0.5) * 50,
        y: y0 + (dy / len) * dist + (Math.random() - 0.5) * 50,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        color: Math.random() > 0.5 ? '#fde047' : '#0ac8b9',
        size: Math.random() * 4 + 2,
        life: 1
      });
    }

    function renderBeam() {
      ctx.clearRect(0, 0, vfxCanvas.width, vfxCanvas.height);

      if (blastFrame < maxBlastFrames) {
        const progress = blastFrame / maxBlastFrames;
        const beamIntensity = progress < 0.2 ? progress / 0.2 : 1 - (progress - 0.2) / 0.8;
        const currentWidth = (65 + Math.sin(blastFrame * 0.8) * 12) * beamIntensity;

        // 1. Rainbow Outer Halo
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(finalEndX, finalEndY);
        ctx.strokeStyle = `rgba(230, 126, 34, ${0.4 * beamIntensity})`;
        ctx.lineWidth = currentWidth * 2.2;
        ctx.lineCap = 'round';
        ctx.stroke();

        // 2. Bright Prismatic Gold Corona
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(finalEndX, finalEndY);
        ctx.strokeStyle = `rgba(253, 224, 71, ${0.85 * beamIntensity})`;
        ctx.lineWidth = currentWidth * 1.3;
        ctx.stroke();

        // 3. Cyan Light Ribbon
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(finalEndX, finalEndY);
        ctx.strokeStyle = `rgba(10, 200, 185, ${0.7 * beamIntensity})`;
        ctx.lineWidth = currentWidth * 0.8;
        ctx.stroke();

        // 4. White-Hot Solar Core
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(finalEndX, finalEndY);
        ctx.strokeStyle = `rgba(255, 255, 255, ${1.0 * beamIntensity})`;
        ctx.lineWidth = currentWidth * 0.45;
        ctx.stroke();

        // 5. Origin Flash Flare
        ctx.beginPath();
        ctx.arc(x0, y0, (50 + Math.random() * 20) * beamIntensity, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${0.9 * beamIntensity})`;
        ctx.fill();

        // 6. Impact explosion at target area
        ctx.beginPath();
        ctx.arc(x1, y1, (45 + Math.random() * 25) * beamIntensity, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(241, 196, 15, ${0.8 * beamIntensity})`;
        ctx.fill();

        // 7. Render Sparks
        particles.forEach(p => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * beamIntensity, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
          p.x += p.vx;
          p.y += p.vy;
        });

        blastFrame++;
        requestAnimationFrame(renderBeam);
      } else {
        // Clear canvas
        ctx.clearRect(0, 0, vfxCanvas.width, vfxCanvas.height);

        // SHOW PENTAKILL BANNER!
        setTimeout(() => {
          showPentakillAnnouncement();
        }, 150);
      }
    }

    requestAnimationFrame(renderBeam);
  }

  // Show Announcer Banner
  function showPentakillAnnouncement() {
    playPentakillFanfare();
    if (pentakillBanner) {
      pentakillBanner.classList.remove('hidden');
    }
  }

  // =========================================================================
  // 5. EVENT LISTENERS & WIRING
  // =========================================================================
  function setupEventListeners() {
    // 1. Lane Marker clicks
    LANES.forEach((lane, idx) => {
      const marker = document.getElementById(lane.markerId);
      if (marker) {
        marker.addEventListener('click', (e) => {
          e.stopPropagation();
          if (isAimingR) {
            // If aiming R, fire at this marker!
            const rect = marker.getBoundingClientRect();
            fireFinalSpark(rect.left + rect.width / 2, rect.top + rect.height / 2);
            return;
          }
          // Direct navigation
          if (isAutoRoaming) toggleAutoRoam();
          goToLane(idx);
        });
      }
    });

    // 2. Tab button clicks
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        playClickSound();
        const targetId = btn.dataset.lane;
        const targetIdx = LANES.findIndex(l => l.id === targetId);
        if (targetIdx !== -1) {
          if (isAutoRoaming) toggleAutoRoam();
          goToLane(targetIdx);
        }
      });
    });

    // 3. Controller buttons
    if (autoRoamBtn) autoRoamBtn.addEventListener('click', toggleAutoRoam);

    if (prevLaneBtn) {
      prevLaneBtn.addEventListener('click', () => {
        playClickSound();
        if (isAutoRoaming) toggleAutoRoam();
        goToLane(currentLaneIndex - 1);
      });
    }

    if (nextLaneBtn) {
      nextLaneBtn.addEventListener('click', () => {
        playClickSound();
        if (isAutoRoaming) toggleAutoRoam();
        goToLane(currentLaneIndex + 1);
      });
    }

    // Speed toggle
    document.querySelectorAll('.speed-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        playClickSound();
        document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        roamSpeed = parseFloat(btn.dataset.speed) || 1;
      });
    });

    // 4. Ultimate Ability Triggers (R)
    const skillR = document.getElementById('skillR');
    if (skillR) {
      skillR.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isAimingR) {
          // Double click fires immediately!
          fireFinalSpark();
        } else {
          activateAimingR();
        }
      });
    }

    const triggerUltBtn = document.getElementById('triggerUltBtn');
    if (triggerUltBtn) {
      triggerUltBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isAimingR) fireFinalSpark();
        else activateAimingR();
      });
    }

    // Map click during aiming
    if (mapContainer) {
      mapContainer.addEventListener('click', (e) => {
        if (isAimingR) {
          e.stopPropagation();
          fireFinalSpark(e.clientX, e.clientY);
        }
      });

      // Crosshair follow mouse
      mapContainer.addEventListener('mousemove', (e) => {
        if (isAimingR && aimCrosshair) {
          const rect = mapContainer.getBoundingClientRect();
          const targetX = e.clientX - rect.left;
          const targetY = e.clientY - rect.top;
          // Position reticle
          const reticle = aimCrosshair.querySelector('.aim-reticle');
          if (reticle) {
            reticle.style.left = `${targetX}px`;
            reticle.style.top = `${targetY}px`;
          }
        }
      });
    }

    // Keyboard Shortcuts (R, Q, W, E, D, F, Space)
    window.addEventListener('keydown', (e) => {
      const key = e.key.toUpperCase();
      if (key === 'R') {
        if (isAimingR) fireFinalSpark();
        else activateAimingR();
      } else if (key === 'Q') {
        playSpellSound('Q');
        flashAbilityButton('skillQ');
      } else if (key === 'W') {
        playSpellSound('W');
        flashAbilityButton('skillW');
      } else if (key === 'E') {
        playSpellSound('E');
        flashAbilityButton('skillE');
      } else if (key === 'D') {
        playSpellSound('Flash');
        flashAbilityButton('spellD');
      } else if (key === 'F') {
        playSpellSound('Ignite');
        flashAbilityButton('spellF');
      } else if (key === 'ESCAPE') {
        cancelAimingR();
        closeModals();
      } else if (e.code === 'Space') {
        e.preventDefault();
        toggleAutoRoam();
      }
    });

    // Regular ability buttons clicks
    ['skillQ', 'skillW', 'skillE'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('click', () => {
          const type = id.replace('skill', '');
          playSpellSound(type);
          flashAbilityButton(id);
        });
      }
    });

    // Summoner Spells clicks
    const spellD = document.getElementById('spellD');
    if (spellD) spellD.addEventListener('click', () => { playSpellSound('Flash'); flashAbilityButton('spellD'); });
    const spellF = document.getElementById('spellF');
    if (spellF) spellF.addEventListener('click', () => { playSpellSound('Ignite'); flashAbilityButton('spellF'); });

    // Sound toggle
    const soundToggleBtn = document.getElementById('soundToggleBtn');
    const soundLabel = document.getElementById('soundLabel');
    if (soundToggleBtn) {
      soundToggleBtn.addEventListener('click', () => {
        isSoundEnabled = !isSoundEnabled;
        if (soundLabel) soundLabel.textContent = isSoundEnabled ? 'ÂM THANH: BẬT' : 'ÂM THANH: TẮT';
        playClickSound();
      });
    }

    // Guide Modal
    const guideBtn = document.getElementById('guideBtn');
    const guideModal = document.getElementById('guideModal');
    const closeGuideModalBtn = document.getElementById('closeGuideModalBtn');
    if (guideBtn && guideModal) {
      guideBtn.addEventListener('click', () => {
        playClickSound();
        guideModal.classList.remove('hidden');
      });
    }
    if (closeGuideModalBtn && guideModal) {
      closeGuideModalBtn.addEventListener('click', () => {
        guideModal.classList.add('hidden');
      });
    }

    // Pentakill Banner Dismiss -> Opens Recruiter Modal
    const closeBannerBtn = document.getElementById('closeBannerBtn');
    if (closeBannerBtn && pentakillBanner && recruiterModal) {
      closeBannerBtn.addEventListener('click', () => {
        playClickSound();
        pentakillBanner.classList.add('hidden');
        recruiterModal.classList.remove('hidden');
      });
    }

    // Recruiter Modal Close
    const closeModalBtn = document.getElementById('closeModalBtn');
    if (closeModalBtn && recruiterModal) {
      closeModalBtn.addEventListener('click', () => {
        playClickSound();
        recruiterModal.classList.add('hidden');
      });
    }

    // Download CV Original PDF
    const downloadPdfBtn = document.getElementById('downloadPdfBtn');
    if (downloadPdfBtn) {
      downloadPdfBtn.addEventListener('click', () => {
        playClickSound();
        window.open('assets/cv-original.pdf', '_blank');
      });
    }
  }

  function flashAbilityButton(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.transform = 'translateY(-6px) scale(1.1)';
    el.style.borderColor = '#00ffff';
    el.style.boxShadow = '0 0 15px rgba(0, 255, 255, 0.8)';
    setTimeout(() => {
      el.style.transform = '';
      el.style.borderColor = '';
      el.style.boxShadow = '';
    }, 250);
  }

  function closeModals() {
    const guideModal = document.getElementById('guideModal');
    if (guideModal) guideModal.classList.add('hidden');
    if (pentakillBanner) pentakillBanner.classList.add('hidden');
    if (recruiterModal) recruiterModal.classList.add('hidden');
  }

  // Realistic Match Clock incrementer
  function startMatchClock() {
    const clockEl = document.getElementById('matchClock');
    if (!clockEl) return;
    let totalSeconds = 25 * 60 + 10;
    setInterval(() => {
      totalSeconds++;
      const min = Math.floor(totalSeconds / 60);
      const sec = totalSeconds % 60;
      clockEl.textContent = `${min}:${sec < 10 ? '0' : ''}${sec}`;
    }, 1000);
  }

  // =========================================================================
  // 6. INITIALIZATION
  // =========================================================================
  window.addEventListener('DOMContentLoaded', () => {
    initAssets();
    resizeVfxCanvas();
    renderMapCircuitPath();
    setLuxPosition(LANES[0].x, LANES[0].y);
    showCVSection('fountain');
    setupEventListeners();
    startMatchClock();

    // Auto-select initial marker
    const initMarker = document.getElementById(LANES[0].markerId);
    if (initMarker) initMarker.classList.add('active-marker');
  });

})();

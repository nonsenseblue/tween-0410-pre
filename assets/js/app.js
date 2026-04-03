/* ============================================================
   SST資料.exe — Presentation Engine
   ============================================================ */

/* ── DOM Cache ── */
const $winPres       = document.getElementById('win-pres');
const $winTitle      = document.getElementById('win-title');
const $taskbarSst    = document.getElementById('taskbar-sst');
const $btnPrev       = document.getElementById('btn-prev');
const $btnNext       = document.getElementById('btn-next');
const $slideCounter  = document.getElementById('slide-counter');
const $statusText    = document.getElementById('status-text');
const $statusSlide   = document.getElementById('status-slide');
const $progressBar   = document.getElementById('progress-bar');
const $bsod          = document.getElementById('bsod');
const $shutdown      = document.getElementById('shutdown');
const $shutdownFinal = document.getElementById('shutdown-final');
const $errorDialog   = document.getElementById('error-dialog');
const $errorTitle    = document.getElementById('error-title');
const $errorIcon     = document.getElementById('error-icon');
const $errorMsg      = document.getElementById('error-msg');
const $errorBtns     = document.getElementById('error-btns');
const $clock         = document.getElementById('clock');
const $mmSvg         = document.getElementById('minminchi-svg');
const $mmEyes        = document.getElementById('mm-eyes');
const $mmMouth       = document.getElementById('mm-mouth');
const $mmBlush       = document.getElementById('mm-blush');
const $mmAccessory   = document.getElementById('mm-accessory');
const $mmBubble      = document.getElementById('minminchi-bubble');
const $appMsgDialog  = document.getElementById('app-msg-dialog');
const $appMsgTitle   = document.getElementById('app-msg-title');
const $appMsgText    = document.getElementById('app-msg-text');
const $appMsgIcon    = document.getElementById('app-msg-icon');

/* ── Constants ── */
const BSOD_SLIDE   = 5;
const BSOD_RESUME  = 6;

/* Mode configs */
const MODES = {
  sst: {
    totalSlides: 20,
    skipSlides: [3, 4, 5, 6, 12, 13, 15],
    defaultTitle: 'SST資料.exe \u2014 Tween 82.8 社内勉強会',
    container: 'slides-sst'
  },
  synergy: {
    totalSlides: 20,
    skipSlides: [],
    defaultTitle: 'シナジー資料.exe \u2014 Tween 82.8 クリエイティブシナジー',
    container: 'slides-synergy'
  }
};
let currentMode = 'sst';
let TOTAL_SLIDES = MODES.sst.totalSlides;
let SKIP_SLIDES  = MODES.sst.skipSlides;
let DEFAULT_TITLE = MODES.sst.defaultTitle;

const SLIDE_STATUS_SST = [
  '準備完了', 'アジェンダ', 'Tween 82.8 について', 'きっかけ',
  'デモ準備中...', 'FATAL ERROR', 'デモタイム', '技術構成',
  '技術詳細', 'Win95 UI', 'Code \u2192 Figma 背景', 'Code \u2192 Figma 仕組み',
  '技術スタック', 'Claude Code カスタマイズ', '.claude ディレクトリ構成',
  '比較: 自作 vs HtD', 'Code \u2192 Figma 実践', 'まとめ',
  '予告', 'ご清聴ありがとうございました'
];
const SLIDE_STATUS_SYNERGY = [
  '準備完了', 'アジェンダ', 'きっかけ', 'Tween 82.8',
  'なぜ Windows 95？', 'Win95 デザイン原則',
  'デモ準備中...', 'FATAL ERROR', '全機能デモ',
  '世界観の仕掛け', '交流タイム',
  '技術構成', 'Cloudflare深掘り',
  'Code \u2192 Figma（Tween）', 'BBNaviパイプライン', '比較 + 実践',
  'Claude Code', 'AIとの付き合い方',
  'まとめ', 'ご清聴ありがとうございました'
];
let SLIDE_STATUS = SLIDE_STATUS_SST;

const SLIDE_TITLES_SST = {
  5: 'SST資料.exe \u2014 [応答なし]',
  6: 'SST資料.exe \u2014 デモタイム'
};
const SLIDE_TITLES_SYNERGY = {
  7: 'シナジー資料.exe \u2014 [応答なし]',
  8: 'シナジー資料.exe \u2014 デモタイム'
};
let SLIDE_TITLES = SLIDE_TITLES_SST;

const WIN95_ICONS = {
  '!': '<svg width="32" height="32" viewBox="0 0 32 32"><polygon points="16,2 30,28 2,28" fill="#ffff00" stroke="#000" stroke-width="2"/><rect x="14" y="10" width="4" height="10" fill="#000"/><rect x="14" y="22" width="4" height="4" fill="#000"/></svg>',
  'i': '<svg width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" fill="#0078d7" stroke="#000" stroke-width="2"/><rect x="14" y="12" width="4" height="12" fill="#fff"/><rect x="14" y="6" width="4" height="4" fill="#fff"/></svg>',
  'X': '<svg width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" fill="#ff0000" stroke="#000" stroke-width="2"/><line x1="10" y1="10" x2="22" y2="22" stroke="#fff" stroke-width="3"/><line x1="22" y1="10" x2="10" y2="22" stroke="#fff" stroke-width="3"/></svg>'
};

const APP_POSITIONS = {
  mycomputer: { left: 120, top: 60,  width: 440 },
  recycle:    { left: 160, top: 100, width: 520 },
  network:    { left: 140, top: 80,  width: 420 },
  notepad:    { left: 200, top: 50,  width: 480 },
  mydocs:     { left: 130, top: 70,  width: 380 },
  msdos:      { left: 100, top: 90,  width: 460 },
  inbox:      { left: 110, top: 60,  width: 500 }
};

/* ── Mutable state ── */
let currentSlide    = 0;
let windowOpen      = false;
let errorCallback   = null;
let appZIndex       = 2000;
let minminTimer     = null;
let minminAnimTimer = null;

/* Error triggers (deleted after use) */
const SLIDE_ERRORS_SST = {
  9:  { title: 'explorer.exe',    icon: 'i', msg: 'ちなみにこの資料自体が\nWin95 UIで作られています。\n\n再帰的ですね。', btns: ['なるほど'] }
};
const SLIDE_ERRORS_SYNERGY = {
  6:  { title: 'demo_env.exe',    icon: '!', msg: 'デモ環境に接続しています...\n本当に続行しますか？', btns: ['はい', 'はい'] },
  5:  { title: 'explorer.exe',    icon: 'i', msg: 'ちなみにこの資料自体が\nWin95 UIで作られています。\n\n再帰的ですね。', btns: ['なるほど'] },
  13: { title: 'design_data.fig', icon: 'X', msg: 'デザインデータが見つかりません。\n\nパス: C:\\BBNAVI\\design\\*.fig\n\n0 個のファイルが見つかりました。', btns: ['OK'] }
};
let slideErrors = SLIDE_ERRORS_SST;

/* ── Clock ── */
function updateClock() {
  const now = new Date();
  $clock.textContent = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
}
updateClock();
setInterval(updateClock, 10000);

/* ── Spectrum bars ── */
function generateSpectrum(id) {
  const el = document.getElementById(id);
  if (!el) return;
  for (let i = 0; i < 60; i++) {
    const bar = document.createElement('div');
    bar.className = 'spectrum-bar';
    bar.style.height = (Math.random() * 18 + 4) + 'px';
    bar.style.opacity = (0.4 + Math.random() * 0.5).toFixed(2);
    el.appendChild(bar);
  }
}
generateSpectrum('title-spectrum');
generateSpectrum('end-spectrum');

/* ── Window controls ── */
function startPresentation(mode) {
  mode = mode || 'sst';
  currentMode = mode;
  var cfg = MODES[mode];
  TOTAL_SLIDES = cfg.totalSlides;
  SKIP_SLIDES = cfg.skipSlides;
  DEFAULT_TITLE = cfg.defaultTitle;
  SLIDE_STATUS = (mode === 'synergy') ? SLIDE_STATUS_SYNERGY : SLIDE_STATUS_SST;
  MINMINCHI_REACTIONS = (mode === 'synergy') ? MINMINCHI_REACTIONS_SYNERGY : MINMINCHI_REACTIONS_SST;
  SLIDE_TITLES = (mode === 'synergy') ? SLIDE_TITLES_SYNERGY : SLIDE_TITLES_SST;

  /* Show correct slide set */
  document.getElementById('slides-sst').style.display = (mode === 'sst') ? '' : 'none';
  document.getElementById('slides-synergy').style.display = (mode === 'synergy') ? '' : 'none';

  /* Reset error triggers */
  slideErrors = (mode === 'synergy')
    ? JSON.parse(JSON.stringify(SLIDE_ERRORS_SYNERGY))
    : JSON.parse(JSON.stringify(SLIDE_ERRORS_SST));

  $winTitle.textContent = DEFAULT_TITLE;
  /* Update BSOD / error / shutdown titles for current mode */
  var exeName = (mode === 'synergy') ? 'シナジー資料.exe' : 'SST資料.exe';
  var fullTitle = (mode === 'synergy') ? 'シナジー資料.exe — Tween 82.8 クリエイティブシナジー' : 'SST資料.exe — Tween 82.8 社内勉強会';
  var bsodEl = document.getElementById('bsod-title');
  var errorEl = document.getElementById('error-title');
  var creditsEl = document.getElementById('shutdown-credits-title');
  if (bsodEl) bsodEl.innerHTML = '&nbsp;' + exeName + '&nbsp;';
  if (errorEl) errorEl.textContent = exeName;
  if (creditsEl) creditsEl.textContent = fullTitle;
  var taskbarLabel = document.getElementById('taskbar-sst-label');
  if (taskbarLabel) taskbarLabel.textContent = exeName;
  $winPres.classList.add('active');
  $taskbarSst.style.display = 'flex';
  windowOpen = true;
  currentSlide = 0;
  showSlide(0);
}

function focusPresentation() {
  if ($winPres.classList.contains('active')) {
    $winPres.classList.remove('active');
  } else {
    $winPres.classList.add('active');
  }
}

var isMaximized = false;
function toggleMaximize() {
  isMaximized = !isMaximized;
  if (isMaximized) {
    $winPres.classList.add('maximized');
    rescaleSlides();
  } else {
    $winPres.classList.remove('maximized');
    clearScale();
  }
}

function rescaleSlides() {
  var body = $winPres.querySelector('.win-body');
  if (!body) return;
  var bodyW = body.clientWidth;
  /* Original design width (880 - padding 28*2) */
  var baseW = 824;
  var scale = (bodyW / baseW) * 0.85;
  /* Scale to fit width, scroll if taller */
  var slides = body.querySelectorAll('.slide');
  slides.forEach(function(s) {
    s.style.transformOrigin = 'top center';
    s.style.transform = 'scale(' + scale + ')';
    s.style.width = baseW + 'px';
    s.style.margin = '0 auto';
    s.style.height = '';
  });
}

function clearScale() {
  var body = $winPres.querySelector('.win-body');
  if (!body) return;
  var slides = body.querySelectorAll('.slide');
  slides.forEach(function(s) {
    s.style.transform = '';
    s.style.width = '';
    s.style.height = '';
    s.style.margin = '';
    s.style.transformOrigin = '';
  });
}

/* Rescale on window resize when maximized */
window.addEventListener('resize', function() {
  if (isMaximized) rescaleSlides();
});

function minimizeWindow() {
  $winPres.classList.remove('active');
}

function closePresentation() {
  $shutdown.classList.add('active');
}

function cancelShutdown() {
  $shutdown.classList.remove('active');
}

function doShutdown() {
  $shutdown.classList.remove('active');
  $winPres.classList.remove('active');
  $taskbarSst.style.display = 'none';
  $shutdownFinal.classList.add('active');
}

/* ── Typewriter effect ── */
var twTimer = null;
function typewriterH1(el) {
  var text = el.textContent;
  el.textContent = '';
  el.style.visibility = 'visible';
  var i = 0;
  var cursor = document.createElement('span');
  cursor.className = 'tw-cursor';
  el.appendChild(cursor);
  clearInterval(twTimer);
  twTimer = setInterval(function() {
    if (i < text.length) {
      el.insertBefore(document.createTextNode(text[i]), cursor);
      i++;
    } else {
      clearInterval(twTimer);
      setTimeout(function() { if (cursor.parentNode) cursor.remove(); }, 800);
    }
  }, 40);
}

/* ── Fade-in lines ── */
function triggerFadeLines(slide) {
  var lines = slide.querySelectorAll('.fade-line');
  lines.forEach(function(el) { el.classList.remove('visible'); });
  lines.forEach(function(el) {
    var delay = (parseInt(el.getAttribute('data-fade')) || 1) * 600;
    setTimeout(function() { el.classList.add('visible'); }, delay);
  });
}

/* ── Blackout (きっかけ slide) ── */
var $blackout = document.getElementById('blackout');
var $boTerminal = document.getElementById('bo-terminal');
var boLines = [
  { text: '1990年代後半。', cls: 'dim' },
  { text: 'バブルが弾けて、大人たちは「もうダメだ」と言ってた。', cls: '' },
  { text: '青春のまっただ中にいた人たちは、それを聞きながら育った。', cls: '' },
  { text: '将来への漠然とした不安。', cls: '' },
  { text: '', cls: '' },
  { text: 'でも、深夜だけは自由だった。', cls: 'bright' },
  { text: '', cls: '' },
  { text: 'エヴァンゲリオン。カウボーイビバップ。', cls: 'dim' },
  { text: '残酷な天使のテーゼが流れるテレビの前。Tank!のカウントが始まるWOWOWの深夜。', cls: '' },
  { text: '攻殻機動隊。PERFECT BLUE。パプリカ。', cls: 'dim' },
  { text: '深夜のブラウン管が映したものが、海を越えて、世界を変えた。', cls: '' },
  { text: '耳をすませば。Love Letter。リリイ・シュシュのすべて。', cls: 'dim' },
  { text: '小樽から届いた手紙。イヤホンの中だけが逃げ場だった教室。', cls: '' },
  { text: 'オールナイトニッポン。JET STREAM。', cls: 'dim' },
  { text: '「遠い地平線が消えて、深々とした夜の闇に心を休めるとき...」', cls: '' },
  { text: '', cls: '' },
  { text: '深夜ラジオ、深夜アニメ、深夜のネット。', cls: '' },
  { text: '大人が寝た後の時間だけが、自分だけの世界だった。', cls: '' },
  { text: '', cls: '' },
  { text: '仕事をしながら、通勤しながら、眠れない夜。', cls: '' },
  { text: 'ふと、あの頃の空気が欲しくなる瞬間がある。', cls: '' },
  { text: '', cls: '' },
  { text: '曲を選ぶんじゃなくて、ただ耳を傾けるだけの場所。', cls: '' },
  { text: 'だから作った。', cls: 'bright' },
];
var boTimers = [];
var boStopped = false;
function triggerBlackout() {
  if (!$blackout || !$boTerminal) return;
  $boTerminal.innerHTML = '';
  $blackout.classList.add('active');
  boTimers.forEach(clearTimeout);
  boTimers = [];
  boStopped = false;

  var cursor = document.createElement('span');
  cursor.className = 'bo-cursor';

  var lineIdx = 0;
  function typeLine() {
    if (boStopped || lineIdx >= boLines.length) {
      /* All done — show cursor blinking at end */
      $boTerminal.appendChild(cursor);
      boTimers.push(setTimeout(enableDismiss, 1500));
      return;
    }
    var line = boLines[lineIdx];
    lineIdx++;
    var el = document.createElement('div');
    el.className = 'bo-line visible' + (line.cls ? ' ' + line.cls : '');

    if (line.text === '') {
      el.innerHTML = '&nbsp;';
      $boTerminal.appendChild(el);
      $boTerminal.scrollTop = $boTerminal.scrollHeight;
      boTimers.push(setTimeout(typeLine, 300));
      return;
    }

    $boTerminal.appendChild(el);
    el.appendChild(cursor);
    $boTerminal.scrollTop = $boTerminal.scrollHeight;
    var chars = line.text.split('');
    var charIdx = 0;
    var speed = 35;

    function typeChar() {
      if (boStopped) return;
      if (charIdx < chars.length) {
        el.insertBefore(document.createTextNode(chars[charIdx]), cursor);
        charIdx++;
        boTimers.push(setTimeout(typeChar, speed));
      } else {
        /* Line done, pause then next line */
        cursor.remove();
        $boTerminal.scrollTop = $boTerminal.scrollHeight;
        boTimers.push(setTimeout(typeLine, 400));
      }
    }
    typeChar();
  }

  boTimers.push(setTimeout(typeLine, 600));

  function enableDismiss() {
    $blackout.addEventListener('click', dismiss);
    document.addEventListener('keydown', dismissKey);
  }
  function dismiss() {
    boStopped = true;
    $blackout.classList.remove('active');
    $blackout.removeEventListener('click', dismiss);
    document.removeEventListener('keydown', dismissKey);
    boTimers.forEach(clearTimeout);
  }
  function dismissKey() { dismiss(); }
}

/* ── Slide engine ── */
function showSlide(n) {
  document.querySelectorAll('.slide').forEach(function(s) { s.classList.remove('active'); });
  var container = document.getElementById(MODES[currentMode].container);
  var target = container.querySelector('[data-slide="' + n + '"]');
  if (target) target.classList.add('active');

  var bsodSlide = (currentMode === 'synergy') ? 7 : BSOD_SLIDE;
  if (n === bsodSlide && SKIP_SLIDES.indexOf(bsodSlide) === -1) {
    setTimeout(function() { $bsod.classList.add('active'); }, 400);
  }

  /* Typewriter effect on h1 */
  if (target && n > 0) {
    var h1 = target.querySelector('h1');
    if (h1) typewriterH1(h1);
  }

  /* Fade-in lines (summary slide = 18 in synergy) */
  if (target && currentMode === 'synergy' && n === 18) {
    triggerFadeLines(target);
  }

  /* Blackout (きっかけ slide = 2 in synergy) */
  if (currentMode === 'synergy' && n === 2) {
    triggerBlackout(target);
  }

  /* Minminchi slide reaction */
  if (currentMode === 'synergy' && MINMINCHI_SLIDE_REACTIONS[n]) {
    var sr = MINMINCHI_SLIDE_REACTIONS[n];
    setTimeout(function() {
      $mmBubble.textContent = sr.msg;
      $mmBubble.classList.add('show');
      setMinminchiFace(sr.face);
      setMinminchiAnim(sr.anim);
      clearTimeout(minminTimer);
      minminTimer = setTimeout(function() {
        $mmBubble.classList.remove('show');
        setMinminchiFace('normal');
      }, 3500);
    }, 800);
  }

  /* Re-center window on every slide change */
  $winPres.classList.remove('dragged');
  $winPres.style.left = '50%';
  $winPres.style.top = 'calc(50% - 14px)';
  $winPres.style.transform = 'translate(-50%, -50%)';

  var activeSlides = [];
  for (var i = 0; i < TOTAL_SLIDES; i++) { if (SKIP_SLIDES.indexOf(i) === -1) activeSlides.push(i); }
  var pos = activeSlides.indexOf(n);
  if (pos === -1) pos = 0;
  var total = activeSlides.length;

  const isLast = (n === activeSlides[activeSlides.length - 1]);
  $btnPrev.disabled = (n === 0);
  $btnNext.textContent = isLast ? '\u2715 終了' : '次へ \u2192';
  $slideCounter.textContent = (pos + 1) + ' / ' + total;
  $statusSlide.textContent = 'Slide ' + (pos + 1) + '/' + total;
  $progressBar.style.width = ((pos + 1) / total * 100) + '%';
  $winTitle.textContent = SLIDE_TITLES[n] || DEFAULT_TITLE;
  $statusText.textContent = SLIDE_STATUS[n] || '';
}

function nextSlide() {
  if (currentSlide >= TOTAL_SLIDES - 1) { closePresentation(); return; }
  var nextIdx = currentSlide + 1;
  while (SKIP_SLIDES.indexOf(nextIdx) !== -1 && nextIdx < TOTAL_SLIDES - 1) nextIdx++;

  if (slideErrors[currentSlide]) {
    const err = slideErrors[currentSlide];
    showError(err.title, err.icon, err.msg, err.btns, function() {
      currentSlide = nextIdx;
      showSlide(currentSlide);
    });
    delete slideErrors[currentSlide];
    return;
  }
  currentSlide = nextIdx;
  showSlide(currentSlide);
}

function prevSlide() {
  var prev = currentSlide - 1;
  while (SKIP_SLIDES.indexOf(prev) !== -1 && prev > 0) prev--;
  if (prev >= 0) { currentSlide = prev; showSlide(currentSlide); }
}

/* ── BSOD ── */
function dismissBsod() {
  $bsod.classList.remove('active');
  var resume = (currentMode === 'synergy') ? 8 : BSOD_RESUME;
  currentSlide = resume;
  showSlide(currentSlide);
}

/* ── Error dialog ── */
function showError(title, icon, msg, btns, callback) {
  $errorTitle.textContent = title;
  $errorIcon.innerHTML = WIN95_ICONS[icon] || icon;
  $errorMsg.textContent = msg;
  errorCallback = callback;

  $errorBtns.innerHTML = '';
  btns.forEach(function(label) {
    const btn = document.createElement('button');
    btn.textContent = label;
    btn.onclick = dismissError;
    $errorBtns.appendChild(btn);
  });
  $errorDialog.classList.add('active');
}

function dismissError() {
  $errorDialog.classList.remove('active');
  if (errorCallback) { const cb = errorCallback; errorCallback = null; cb(); }
}

/* ── Keyboard ── */
document.addEventListener('keydown', function(e) {
  if ($bsod.classList.contains('active')) { dismissBsod(); return; }
  if ($errorDialog.classList.contains('active')) {
    if (e.key === 'Enter' || e.key === ' ') dismissError();
    return;
  }
  if ($shutdownFinal.classList.contains('active')) {
    $shutdownFinal.classList.remove('active'); return;
  }
  if ($shutdown.classList.contains('active')) {
    if (e.key === 'Enter') doShutdown();
    if (e.key === 'Escape') cancelShutdown();
    return;
  }
  if (!windowOpen) return;
  if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter' || e.key === 'PageDown') {
    e.preventDefault(); nextSlide();
  } else if (e.key === 'ArrowLeft' || e.key === 'Backspace' || e.key === 'PageUp') {
    e.preventDefault(); prevSlide();
  }
});

document.addEventListener('dblclick', function() {
  if (window.getSelection) window.getSelection().removeAllRanges();
});

/* ── Minminchi ── */
const MINMINCHI_FACES = {
  normal: {
    eyes: '<rect x="7" y="7" width="3" height="2" fill="#ffcc00"/><rect x="8" y="7" width="1" height="2" fill="#1a1a1a"/><rect x="13" y="7" width="3" height="2" fill="#ffcc00"/><rect x="14" y="7" width="1" height="2" fill="#1a1a1a"/>',
    mouth: '<rect x="11" y="10" width="1" height="1" fill="#ff8899"/><rect x="10" y="11" width="1" height="1" fill="#444"/><rect x="12" y="11" width="1" height="1" fill="#444"/>',
    blush: '<rect x="3" y="9" width="3" height="1" fill="#444" opacity="0.5"/><rect x="3" y="11" width="3" height="1" fill="#444" opacity="0.5"/><rect x="17" y="9" width="3" height="1" fill="#444" opacity="0.5"/><rect x="17" y="11" width="3" height="1" fill="#444" opacity="0.5"/>',
    accessory: ''
  },
  happy: {
    eyes: '<rect x="7" y="7" width="3" height="1" fill="#ffcc00"/><rect x="7" y="8" width="3" height="1" fill="#1a1a1a"/><rect x="13" y="7" width="3" height="1" fill="#ffcc00"/><rect x="13" y="8" width="3" height="1" fill="#1a1a1a"/>',
    mouth: '<rect x="11" y="10" width="1" height="1" fill="#ff8899"/><rect x="10" y="11" width="3" height="1" fill="#ff8899"/><rect x="9" y="11" width="1" height="1" fill="#444"/>',
    blush: '<rect x="3" y="9" width="3" height="1" fill="#444" opacity="0.5"/><rect x="17" y="9" width="3" height="1" fill="#444" opacity="0.5"/><rect x="5" y="10" width="2" height="1" fill="#ff6666" opacity="0.4"/><rect x="16" y="10" width="2" height="1" fill="#ff6666" opacity="0.4"/>',
    accessory: ''
  },
  sleepy: {
    eyes: '<rect x="7" y="8" width="3" height="1" fill="#666"/><rect x="13" y="8" width="3" height="1" fill="#666"/>',
    mouth: '<rect x="11" y="11" width="1" height="1" fill="#444"/>',
    blush: '<rect x="3" y="9" width="3" height="1" fill="#444" opacity="0.3"/><rect x="17" y="9" width="3" height="1" fill="#444" opacity="0.3"/>',
    accessory: '<text x="19" y="4" fill="#888" font-size="4" font-family="monospace">z</text><text x="21" y="2" fill="#888" font-size="3" font-family="monospace">z</text>'
  },
  angry: {
    eyes: '<rect x="7" y="7" width="3" height="2" fill="#ff6600"/><rect x="8" y="7" width="1" height="2" fill="#1a1a1a"/><rect x="13" y="7" width="3" height="2" fill="#ff6600"/><rect x="14" y="7" width="1" height="2" fill="#1a1a1a"/><rect x="7" y="6" width="3" height="1" fill="#1a1a1a" transform="rotate(-8,8.5,6.5)"/><rect x="13" y="6" width="3" height="1" fill="#1a1a1a" transform="rotate(8,14.5,6.5)"/>',
    mouth: '<rect x="10" y="11" width="3" height="1" fill="#444"/><rect x="10" y="10" width="1" height="1" fill="#444"/><rect x="12" y="10" width="1" height="1" fill="#444"/>',
    blush: '<rect x="3" y="9" width="3" height="1" fill="#444" opacity="0.7"/><rect x="17" y="9" width="3" height="1" fill="#444" opacity="0.7"/>',
    accessory: ''
  },
  love: {
    eyes: '<rect x="7" y="7" width="1" height="1" fill="#ff6688"/><rect x="9" y="7" width="1" height="1" fill="#ff6688"/><rect x="7" y="8" width="3" height="1" fill="#ff6688"/><rect x="8" y="9" width="1" height="1" fill="#ff6688"/><rect x="13" y="7" width="1" height="1" fill="#ff6688"/><rect x="15" y="7" width="1" height="1" fill="#ff6688"/><rect x="13" y="8" width="3" height="1" fill="#ff6688"/><rect x="14" y="9" width="1" height="1" fill="#ff6688"/>',
    mouth: '<rect x="11" y="10" width="1" height="1" fill="#ff8899"/><rect x="10" y="11" width="3" height="1" fill="#ff8899"/>',
    blush: '<rect x="5" y="10" width="2" height="1" fill="#ff6666" opacity="0.6"/><rect x="16" y="10" width="2" height="1" fill="#ff6666" opacity="0.6"/>',
    accessory: ''
  },
  surprised: {
    eyes: '<circle cx="8.5" cy="8" r="2" fill="#ffcc00"/><circle cx="8.5" cy="8" r="1" fill="#1a1a1a"/><circle cx="14.5" cy="8" r="2" fill="#ffcc00"/><circle cx="14.5" cy="8" r="1" fill="#1a1a1a"/>',
    mouth: '<rect x="11" y="11" width="1" height="2" fill="#444"/>',
    blush: '<rect x="3" y="9" width="3" height="1" fill="#444" opacity="0.7"/><rect x="17" y="9" width="3" height="1" fill="#444" opacity="0.7"/>',
    accessory: ''
  },
  eating: {
    eyes: '<rect x="7" y="7" width="3" height="1" fill="#ffcc00"/><rect x="7" y="8" width="3" height="1" fill="#1a1a1a"/><rect x="13" y="7" width="3" height="1" fill="#ffcc00"/><rect x="13" y="8" width="3" height="1" fill="#1a1a1a"/>',
    mouth: '<rect x="10" y="10" width="3" height="2" fill="#444"/><rect x="11" y="10" width="1" height="2" fill="#ff8899"/>',
    blush: '<rect x="5" y="10" width="2" height="1" fill="#ff6666" opacity="0.3"/><rect x="16" y="10" width="2" height="1" fill="#ff6666" opacity="0.3"/>',
    accessory: '<rect x="2" y="12" width="3" height="2" fill="#cc8844"/><rect x="3" y="11" width="1" height="1" fill="#cc8844"/>'
  },
  wink: {
    eyes: '<rect x="7" y="7" width="3" height="2" fill="#ffcc00"/><rect x="8" y="7" width="1" height="2" fill="#1a1a1a"/><rect x="13" y="8" width="3" height="1" fill="#666"/>',
    mouth: '<rect x="11" y="10" width="1" height="1" fill="#ff8899"/><rect x="10" y="11" width="3" height="1" fill="#ff8899"/>',
    blush: '<rect x="5" y="10" width="2" height="1" fill="#ff6666" opacity="0.4"/><rect x="16" y="10" width="2" height="1" fill="#ff6666" opacity="0.4"/>',
    accessory: ''
  },
  purr: {
    eyes: '<rect x="7" y="7" width="3" height="1" fill="#ffcc00"/><rect x="7" y="8" width="3" height="1" fill="#1a1a1a"/><rect x="13" y="7" width="3" height="1" fill="#ffcc00"/><rect x="13" y="8" width="3" height="1" fill="#1a1a1a"/>',
    mouth: '<rect x="11" y="10" width="1" height="1" fill="#ff8899"/><rect x="10" y="11" width="1" height="1" fill="#444"/><rect x="12" y="11" width="1" height="1" fill="#444"/>',
    blush: '<rect x="5" y="10" width="2" height="1" fill="#ff6666" opacity="0.5"/><rect x="16" y="10" width="2" height="1" fill="#ff6666" opacity="0.5"/><rect x="3" y="9" width="3" height="1" fill="#444" opacity="0.6"/><rect x="3" y="11" width="3" height="1" fill="#444" opacity="0.6"/><rect x="17" y="9" width="3" height="1" fill="#444" opacity="0.6"/><rect x="17" y="11" width="3" height="1" fill="#444" opacity="0.6"/>',
    accessory: '<text x="1" y="6" fill="#ff8899" font-size="3" font-family="monospace">\u2665</text><text x="20" y="6" fill="#ff8899" font-size="3" font-family="monospace">\u2665</text>'
  }
};

const MINMINCHI_REACTIONS_SST = [
  { msg: 'がんばれ〜',         face: 'happy',     anim: 'bounce' },
  { msg: '次のスライド！',     face: 'normal',    anim: 'bounce' },
  { msg: 'いい発表！',         face: 'happy',     anim: 'spin' },
  { msg: 'もぐもぐ...',        face: 'eating',    anim: 'wiggle' },
  { msg: 'zzZ...',             face: 'sleepy',    anim: 'sway' },
  { msg: '計画通り。',         face: 'wink',      anim: 'bounce' },
  { msg: '正確にやれ！',       face: 'angry',     anim: 'shake' },
  { msg: 'おなかすいた',       face: 'eating',    anim: 'wiggle' },
  { msg: 'Win95ｻｲｺｰ',         face: 'happy',     anim: 'spin' },
  { msg: '雑な仕事は許さない', face: 'angry',     anim: 'shake' },
  { msg: 'SST楽しい！',       face: 'happy',     anim: 'jump' },
  { msg: 'みんみん！',         face: 'love',      anim: 'bounce' },
  { msg: '集中！集中！',       face: 'normal',    anim: 'shake' },
  { msg: 'ﾊﾟﾁﾊﾟﾁﾊﾟﾁ',         face: 'happy',     anim: 'jump' },
  { msg: 'えっ！？',           face: 'surprised', anim: 'jump' },
  { msg: 'うふふ♪',            face: 'wink',      anim: 'sway' },
  { msg: '( ˘ω˘ )ｽﾔｧ',        face: 'sleepy',    anim: 'sway' },
  { msg: 'だいすき！',         face: 'love',      anim: 'spin' }
];

const MINMINCHI_REACTIONS_SYNERGY = [
  { msg: 'シナジー！',         face: 'happy',     anim: 'bounce' },
  { msg: 'いい発表！',         face: 'happy',     anim: 'spin' },
  { msg: '次のスライド！',     face: 'normal',    anim: 'bounce' },
  { msg: '1時間がんばろ',      face: 'happy',     anim: 'jump' },
  { msg: 'Win95ｻｲｺｰ',         face: 'happy',     anim: 'spin' },
  { msg: '質問タイム？',       face: 'surprised', anim: 'jump' },
  { msg: 'ﾊﾟﾁﾊﾟﾁﾊﾟﾁ',         face: 'happy',     anim: 'jump' },
  { msg: 'もっと聞きたい！',   face: 'love',      anim: 'bounce' },
  { msg: 'おなかすいた...',    face: 'eating',    anim: 'wiggle' },
  { msg: 'zzZ...',             face: 'sleepy',    anim: 'sway' },
  { msg: 'クリエイティブ！',   face: 'wink',      anim: 'bounce' },
  { msg: 'みんみん！',         face: 'love',      anim: 'bounce' },
  { msg: 'えっ！？',           face: 'surprised', anim: 'jump' },
  { msg: 'コード書きたい',     face: 'normal',    anim: 'shake' },
  { msg: 'Figmaすごい',        face: 'happy',     anim: 'spin' }
];

/* ── Slide-specific Minminchi reactions (synergy) ── */
var MINMINCHI_SLIDE_REACTIONS = {
  0:  { msg: 'はじまるよ！',           face: 'happy',     anim: 'jump' },
  1:  { msg: '前半と後半あるにゃ',     face: 'normal',    anim: 'bounce' },
  2:  { msg: '深夜...zzZ...',         face: 'sleepy',    anim: 'sway' },
  3:  { msg: '場所、大事にゃ',         face: 'happy',     anim: 'bounce' },
  4:  { msg: 'Win95ｻｲｺｰ！',           face: 'happy',     anim: 'spin' },
  5:  { msg: 'ボーダー！ボーダー！',   face: 'wink',      anim: 'bounce' },
  6:  { msg: 'デモ！デモ！',           face: 'happy',     anim: 'jump' },
  8:  { msg: '11個もあるの！？',       face: 'surprised', anim: 'jump' },
  9:  { msg: 'youth.exe...泣',        face: 'love',      anim: 'sway' },
  10: { msg: 'みんな書いてにゃ〜',     face: 'happy',     anim: 'bounce' },
  11: { msg: 'ここから技術の話',       face: 'normal',    anim: 'bounce' },
  12: { msg: 'Cloudflareすごい',       face: 'happy',     anim: 'spin' },
  13: { msg: 'パイプライン長い...',    face: 'sleepy',    anim: 'wiggle' },
  14: { msg: 'BBNaviはもっと長い！',   face: 'surprised', anim: 'shake' },
  15: { msg: '自作の方が強い！',       face: 'wink',      anim: 'bounce' },
  16: { msg: '.claudeの中身〜',        face: 'normal',    anim: 'bounce' },
  17: { msg: 'AIは道具にゃ',           face: 'wink',      anim: 'bounce' },
  18: { msg: 'ないなら作る！',         face: 'happy',     anim: 'jump' },
  19: { msg: 'おつかれさまでした！',   face: 'love',      anim: 'spin' },
};

let MINMINCHI_REACTIONS = MINMINCHI_REACTIONS_SST;

const BLINK_SVG = '<rect x="7" y="8" width="3" height="1" fill="#666"/><rect x="13" y="8" width="3" height="1" fill="#666"/>';

function setMinminchiFace(name) {
  const face = MINMINCHI_FACES[name] || MINMINCHI_FACES.normal;
  $mmEyes.innerHTML      = face.eyes;
  $mmMouth.innerHTML     = face.mouth;
  $mmBlush.innerHTML     = face.blush;
  $mmAccessory.innerHTML = face.accessory;
}

function setMinminchiAnim(name) {
  $mmSvg.className.baseVal = 'minminchi-pixel mm-anim-' + name;
  clearTimeout(minminAnimTimer);
  minminAnimTimer = setTimeout(function() {
    $mmSvg.className.baseVal = 'minminchi-pixel mm-anim-idle';
  }, 2000);
}

function minminchiTap() {
  const r = MINMINCHI_REACTIONS[Math.floor(Math.random() * MINMINCHI_REACTIONS.length)];
  $mmBubble.textContent = r.msg;
  $mmBubble.classList.add('show');
  setMinminchiFace(r.face);
  setMinminchiAnim(r.anim);
  clearTimeout(minminTimer);
  minminTimer = setTimeout(function() {
    $mmBubble.classList.remove('show');
    setMinminchiFace('normal');
  }, 3000);
}

/* ── Pet (撫でる) ── */
const PET_REACTIONS = [
  { msg: 'ゴロゴロ...',     face: 'purr',   anim: 'sway' },
  { msg: 'にゃ〜ん',        face: 'happy',  anim: 'wiggle' },
  { msg: 'ふにゃ...',       face: 'purr',   anim: 'sway' },
  { msg: 'もっと撫でて！',  face: 'love',   anim: 'bounce' },
  { msg: 'きもちい〜',      face: 'purr',   anim: 'wiggle' },
  { msg: 'ぐるぐる...',     face: 'happy',  anim: 'sway' },
];

function minminchiPet() {
  const r = PET_REACTIONS[Math.floor(Math.random() * PET_REACTIONS.length)];
  $mmBubble.textContent = r.msg;
  $mmBubble.classList.add('show');
  setMinminchiFace(r.face);
  setMinminchiAnim(r.anim);
  clearTimeout(minminTimer);
  minminTimer = setTimeout(function() {
    $mmBubble.classList.remove('show');
    setMinminchiFace('normal');
  }, 3000);
}

/* ── Feed (餌やり) ── */
const FEED_REACTIONS = [
  { msg: 'もぐもぐ...',       face: 'eating',    anim: 'wiggle' },
  { msg: 'カリカリおいしい！', face: 'eating',    anim: 'bounce' },
  { msg: 'おかわり！',         face: 'happy',     anim: 'jump' },
  { msg: 'ちゅ〜る！？',      face: 'surprised', anim: 'jump' },
  { msg: 'うまうま',           face: 'eating',    anim: 'wiggle' },
  { msg: 'おなかいっぱい',     face: 'sleepy',    anim: 'sway' },
];

function minminchiFeed() {
  const r = FEED_REACTIONS[Math.floor(Math.random() * FEED_REACTIONS.length)];
  $mmBubble.textContent = r.msg;
  $mmBubble.classList.add('show');
  setMinminchiFace(r.face);
  setMinminchiAnim(r.anim);
  clearTimeout(minminTimer);
  minminTimer = setTimeout(function() {
    $mmBubble.classList.remove('show');
    setMinminchiFace('normal');
  }, 3000);
}

(function autoSpeak() {
  const delay = 20000 + Math.random() * 25000;
  setTimeout(function() {
    if (!$bsod.classList.contains('active') && !$shutdownFinal.classList.contains('active')) {
      minminchiTap();
    }
    autoSpeak();
  }, delay);
})();

(function idleBlink() {
  const delay = 3000 + Math.random() * 3000;
  setTimeout(function() {
    if ($mmEyes && !$mmBubble.classList.contains('show')) {
      const saved = $mmEyes.innerHTML;
      $mmEyes.innerHTML = BLINK_SVG;
      setTimeout(function() { $mmEyes.innerHTML = saved; }, 150);
    }
    idleBlink();
  }, delay);
})();

/* ── App Windows ── */
function openApp(name) {
  const el = document.getElementById('app-' + name);
  if (!el) return;
  if (el.classList.contains('active')) {
    el.style.zIndex = ++appZIndex;
    return;
  }
  const pos = APP_POSITIONS[name] || { left: 150, top: 80, width: 400 };
  el.style.left   = pos.left + 'px';
  el.style.top    = pos.top + 'px';
  el.style.width  = pos.width + 'px';
  el.style.zIndex = ++appZIndex;
  el.classList.add('active');
}

function closeApp(name) {
  const el = document.getElementById('app-' + name);
  if (el) el.classList.remove('active');
}

function showAppMsg(appName, msg, icon) {
  $appMsgTitle.textContent = appName;
  $appMsgText.textContent  = msg;
  $appMsgIcon.innerHTML    = WIN95_ICONS[icon] || icon;
  $appMsgDialog.classList.add('active');
}

function closeAppMsg() {
  $appMsgDialog.classList.remove('active');
}

/* ── Start Menu ── */
function toggleStartMenu() {
  var el = document.getElementById('start-menu');
  if (el) el.classList.toggle('active');
}
function closeStartMenu() {
  var el = document.getElementById('start-menu');
  if (el) el.classList.remove('active');
}

/* ── Desktop Context Menu ── */
var $ctxMenu = document.getElementById('ctx-menu');
function closeCtxMenu() {
  if ($ctxMenu) $ctxMenu.classList.remove('active');
}
document.getElementById('desktop').addEventListener('contextmenu', function(e) {
  if (e.target.closest('.desktop-icon')) return;
  e.preventDefault();
  $ctxMenu.style.left = e.clientX + 'px';
  $ctxMenu.style.top  = e.clientY + 'px';
  $ctxMenu.classList.add('active');
});
document.addEventListener('mousedown', function(e) {
  if ($ctxMenu && !$ctxMenu.contains(e.target)) closeCtxMenu();
});

/* ── Window Drag ── */
(function() {
  let isDragging = false;
  let dragWin    = null;
  let startX, startY, origLeft, origTop;
  const presTitleBar = $winPres.querySelector('.title-bar');

  document.addEventListener('mousedown', function(e) {
    if (presTitleBar.contains(e.target) && !e.target.closest('.title-btns')) {
      isDragging = true;
      dragWin = $winPres;
      const rect = $winPres.getBoundingClientRect();
      if (!$winPres.classList.contains('dragged')) {
        $winPres.style.left = rect.left + 'px';
        $winPres.style.top  = rect.top + 'px';
        $winPres.style.transform = 'none';
        $winPres.classList.add('dragged');
      }
      startX = e.clientX; startY = e.clientY;
      origLeft = rect.left; origTop = rect.top;
      e.preventDefault();
      return;
    }

    const titleBar = e.target.closest('[data-drag]');
    if (titleBar && !e.target.closest('.title-btns')) {
      const appId = titleBar.getAttribute('data-drag');
      dragWin = document.getElementById(appId);
      if (!dragWin) return;
      isDragging = true;
      dragWin.style.zIndex = ++appZIndex;
      const rect = dragWin.getBoundingClientRect();
      startX = e.clientX; startY = e.clientY;
      origLeft = rect.left; origTop = rect.top;
      e.preventDefault();
    }
  });

  document.addEventListener('mousemove', function(e) {
    if (!isDragging || !dragWin) return;
    dragWin.style.left = (origLeft + e.clientX - startX) + 'px';
    dragWin.style.top  = (origTop + e.clientY - startY) + 'px';
  });

  document.addEventListener('mouseup', function() {
    isDragging = false;
    dragWin = null;
  });
})();

/* ── Desktop Icon Drag ── */
(function() {
  var icons = document.querySelectorAll('.desktop .desktop-icon');
  var rowGap = 80, padX = 12, padY = 12;

  /* Initial grid layout — two columns */
  var perCol = Math.ceil(icons.length / 2);
  var colWidth = 80;
  icons.forEach(function(icon, i) {
    var col = Math.floor(i / perCol);
    var row = i % perCol;
    icon.style.left = (padX + col * colWidth) + 'px';
    icon.style.top  = (padY + row * rowGap) + 'px';
  });

  var dragIcon = null, offsetX = 0, offsetY = 0;

  document.addEventListener('mousedown', function(e) {
    var icon = e.target.closest('.desktop .desktop-icon');
    if (!icon) return;
    dragIcon = icon;
    var rect = icon.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    icon.classList.add('dragging');
    e.preventDefault();
  });

  document.addEventListener('mousemove', function(e) {
    if (!dragIcon) return;
    var desktop = document.getElementById('desktop');
    var dRect = desktop.getBoundingClientRect();
    dragIcon.style.left = (e.clientX - dRect.left - offsetX) + 'px';
    dragIcon.style.top  = (e.clientY - dRect.top - offsetY) + 'px';
  });

  document.addEventListener('mouseup', function() {
    if (dragIcon) {
      dragIcon.classList.remove('dragging');
      dragIcon = null;
    }
  });
})();

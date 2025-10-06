/* Lightweight scene engine for the healing journey */
(() => {
  // ===== helpers =====
  const $  = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => Array.from(p.querySelectorAll(s));

  // ===== elements =====
  const sceneEl = $('#scene');
  const btnPrev = $('#btn-prev');
  const btnNext = $('#btn-next');
  const dots    = $('#dots');

  // ===== birds & score =====
  const BIRDS = {
    budgie:   { name: 'นกหงส์หยก',  bg: 'assets/bird-budgie.jpg',   desc: 'ด้านจิตใจ : ร่าเริง ขี้เล่น ชอบสื่อสาร ปรับตัวเก่ง กิจกรรม : เหมาะกับนักพูด การวาดภาพ ร้องเพลง ' },
    hornbill: { name: 'นกเงือก',    bg: 'assets/bird-hornbill.jpg', desc: 'ด้านจิตใจ : มีความรับผิดชอบ กล้าหาญ รักครอบครัวและคนที่รัก กิจกรรม : ปลูกป่า เล่าเรื่อง เหมาะกับกิจกรรมที่สร้างสรรค์' },
    owl:      { name: 'นกฮูก',      bg: 'assets/bird-owl.jpg',      desc: 'ด้านจิตใจ : เหมาะกับคนชอบคิด เงียบขรึม ชั่งสังเกต รักสงบ กิจกรรม : เหมาะกับการเขียน การวิเคราะห์ การทำงานกลางคืน ทำสมาธิ โยคะ' },
    dove:     { name: 'นกพิราบขาว', bg: 'assets/bird-dove.jpg',     desc: 'ด้านจิตใจ : สงบ รักสันติ รักความยุติธรรท เปรียบเสมือนผู้ใกล่เกลี่ย กิจกรรม : ให้คำปรึกษา การบำบัด การให้พลังบวก การว่ายน้ำที่ไม่แข็งขัน กิจกรรมเบาๆเช่นปั่นจักรยานในสวน' },
    eagle:    { name: 'นกอินทรีย์',  bg: 'assets/bird-eagle.jpg',    desc: 'ด้านจิตใจ : มุ่งมั่น แข็งแกร่ง วิสัยทัศน์และเป้าหมายแน่วแน่ชัดเจน ไม่กลัวความท้าทาย กิจกรรม : ปีนเขา กิจกรรมที่เน้นการแข่งขัน วิ่งมาราธอน ไตรกีฬา เดินป่า การท้าทาย' },
  };

  // ===== app state =====
  let state = {
  i: 0,
  name: localStorage.getItem('hj_name') || '',
  feelings: JSON.parse(localStorage.getItem('hj_feelings') || '[]'),
  tired: localStorage.getItem('hj_tired') || '',
  journal: localStorage.getItem('hj_journal') || '',
  // NEW: ที่เก็บคะแนนแต่ละนก
  scores: JSON.parse(localStorage.getItem('hj_scores') || '{"budgie":0,"dove":0,"owl":0,"hornbill":0,"eagle":0}')
};

  // ===== dots =====
  function renderDots() {
    dots.innerHTML = '';
    for (let k = 0; k < SCENES.length; k++) {
      const d = document.createElement('div');
      d.className = 'dot' + (k === state.i ? ' active' : '');
      dots.appendChild(d);
    }
  }

  // ===== router =====
  function renderScene() {
    const s = SCENES[state.i];
    if (!s) return;

    btnPrev.disabled = state.i === 0;
    btnNext.textContent = state.i === SCENES.length - 1 ? 'จบการเดินทาง' : 'ถัดไป →';
    renderDots();

    switch (s.type) {
      case 'start':    sceneStart(s);     break;
      case 'narrate':  sceneNarrate(s);   break;
      case 'question': sceneQuestion(s);  break;
      case 'timer':    sceneTimer(s);     break;
      case 'result':   sceneResult(s);    break;
      default:         sceneNarrate(s);   break;
    }
  }
  const route = () => renderScene();

  btnPrev.addEventListener('click', () => {
    if (state.i > 0) { state.i--; route(); }
  });
  btnNext.addEventListener('click', () => {
    if (state.i < SCENES.length - 1) { state.i++; route(); }
    else { state.i = 0; route(); }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') btnPrev.click();
    if (e.key === 'ArrowRight' || e.key === 'Enter') btnNext.click();
  });

  // ===== scenes =====
  function applyBg(s) {
    if (s.bg) {
      sceneEl.style.backgroundImage    = `url('${s.bg}')`;
      sceneEl.style.backgroundSize     = 'cover';
      sceneEl.style.backgroundPosition = 'center';
    } else {
      sceneEl.style.backgroundImage = '';
    }
  }

  function sceneStart(s) {
    sceneEl.className = 'scene center hero';
    applyBg(s);

    btnPrev.style.display = 'none';
    btnNext.style.display = 'none';
    dots.style.display    = 'none';

    sceneEl.innerHTML = `
      <div class="center fade-in">
        <button id="btn-begin" class="start-btn">เริ่มเดินทาง</button>
      </div>
    `;
    $('#btn-begin').addEventListener('click', () => {
      btnPrev.style.display = '';
      btnNext.style.display = '';
      dots.style.display    = '';
      state.i = 1;
      route();
    });
  }

  function sceneNarrate(s) {
    sceneEl.className = 'scene hero';
    applyBg(s);

    sceneEl.innerHTML = `
      <div class="narrate-wrap fade-in-up">
        <div class="bubble">${s.text || ''}</div>
        ${s.text2 ? `<div class="bubble small">${s.text2}</div>` : ''}
        <div class="tap-hint">แตะ/คลิก เพื่อไปต่อ</div>
      </div>
    `;
    $('.narrate-wrap').addEventListener('click', () => {
      if (state.i < SCENES.length - 1) { state.i++; route(); }
    });
  }

  // Question scene: มี 2 ช่วง (เล่าเรื่อง -> คำถาม)
  function sceneQuestion(s) {
    sceneEl.className = 'scene';
    applyBg(s);

    let stage = 'story'; // 'story' -> 'ask'
    render();

    function render() {
      if (stage === 'story' && s.text) {
        sceneEl.innerHTML = `
          <div class="narrate-wrap fade-in-up">
            <div class="bubble">${s.text}</div>
            <div class="bubble small">${s.question}</div>
            <div class="tap-hint">แตะเพื่อดูตัวเลือก</div>
          </div>
        `;
        $('.narrate-wrap').addEventListener('click', () => {
          stage = 'ask';
          render();
        });
      } else {
        sceneEl.innerHTML = `
          <div class="qa-wrap fade-in-up">
            ${s.text ? `<div class="bubble small">${s.text}</div>` : ''}
            <h3 class="q-title">${s.question}</h3>
            <div class="q-choices">
              ${s.options.map((o,i)=>`
                <button class="q-btn" data-to="${o.to}" data-score="${o.score}">
                  ${o.text}
                </button>
              `).join('')}
            </div>
          </div>
        `;
        $$('.q-btn').forEach(btn=>{
          btn.addEventListener('click', () => {
            const to    = btn.dataset.to;          // คีย์นก
            const score = Number(btn.dataset.score || 0);
            if (state.scores[to] != null) state.scores[to] += score;

            localStorage.setItem('hj_scores', JSON.stringify(state.scores));
            if (state.i < SCENES.length - 1) { state.i++; route(); }
          });
        });
      }
    }
  }

  // Timer scene (ท่ากาย/นับถอยหลัง)
  function sceneTimer(s) {
    sceneEl.className = 'scene center';
    applyBg(s);

    const secs = Number(s.seconds || 10);
    sceneEl.innerHTML = `
      <div class="panel timer fade-in-up">
        <h3>${s.title || ''}</h3>
        <p class="note">${s.subtitle || 'นับถอยหลัง'}</p>
        <div class="big-timer" id="tm"> ${secs} </div>
        <div class="tap-hint" style="display:none">แตะเพื่อไปต่อ</div>
      </div>
    `;
    let t = secs;
    const el = $('#tm');
    const hint = $('.tap-hint');
    const intv = setInterval(() => {
      t--; el.textContent = t;
      if (t <= 0) {
        clearInterval(intv);
        el.textContent = '✔︎';
        hint.style.display = 'block';
        sceneEl.addEventListener('click', () => {
          if (state.i < SCENES.length - 1) { state.i++; route(); }
        }, { once: true });
      }
    }, 1000);
  }

 function sceneResult(s) {
  sceneEl.className = 'scene center hero';

  // คำนวณนกที่ได้คะแนนสูงสุด
  const entries = Object.entries(state.scores);
  entries.sort((a, b) => b[1] - a[1]);
  const topKey = (entries[0] && entries[0][0]) || 'owl';
  const bird   = BIRDS[topKey] || { name:'นกปริศนา', bg:'', desc:'' };

  // ใช้รูปนกเป็นพื้นหลัง + ไส้กรองมืดเพื่อให้อ่านตัวอักษรง่าย
  const bgLayer = bird.bg 
    ? `linear-gradient(180deg, rgba(0,0,0,.6), rgba(0,0,0,.6)), url('${bird.bg}')`
    : `radial-gradient(1200px 800px at 50% 30%, #14223a 0%, #0b1020 60%)`;
  sceneEl.style.backgroundImage    = bgLayer;
  sceneEl.style.backgroundSize     = 'cover';
  sceneEl.style.backgroundPosition = 'center';

  // เนื้อหา
  sceneEl.innerHTML = `
    <div class="center fade-in-up">
      <h2 class="result-title">นกคู่ใจของคุณคือ</h2>

      <div class="bird-card">
        ${bird.bg ? `<img class="bird-img" src="${bird.bg}" alt="${bird.name}" onerror="this.style.display='none'">` : ``}
        <div class="bird-info">
          <h1 class="big bird-name">🕊️ ${bird.name}</h1>
          ${bird.desc ? `<p class="note">${bird.desc}</p>` : ``}
        </div>
      </div>

      <div class="row" style="justify-content:center;margin-top:14px">
        <button id="btn-restart" class="ghost">เริ่มใหม่</button>
        <button id="btn-clear" class="ghost">ล้างข้อมูลคะแนน</button>
      </div>
    </div>
  `;

  // ปุ่ม
  $('#btn-restart').addEventListener('click', () => {
    state.i = 0; 
    route();
  });

  $('#btn-clear').addEventListener('click', () => {
    state.scores = { budgie:0, hornbill:0, owl:0, dove:0, eagle:0 };
    localStorage.setItem('hj_scores', JSON.stringify(state.scores));
    alert('ล้างคะแนนแล้ว');
  });
}

  // start
  renderScene();
})();
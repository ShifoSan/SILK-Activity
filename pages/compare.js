// pages/compare.js — Trade Compare Matrix. Mechanical parity with trade_compare.py.
let _busy = false;
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const ICON = {
  key: `<img class="cmp-cur-icon" src="./assets/Key.webp" alt="" onerror="this.style.display='none'">`,
  scroll: `<img class="cmp-cur-icon" src="./assets/PrestigeScroll.webp" alt="" onerror="this.style.display='none'">`,
  mask: `<img class="cmp-cur-icon" src="./assets/Vizardmask.webp" alt="" onerror="this.style.display='none'">`
};
const VERDICTS = {
  massive: { text: '🚀 VERDICT: MASSIVE WIN (HUGE W)', color: '#00FF00' },
  profit:  { text: '✅ VERDICT: PROFIT (SLIGHT W)',  color: '#2ECC71' },
  fair:    { text: '🤝 VERDICT: FAIR TRADE',         color: '#3498DB' },
  loss:    { text: '⚠️ VERDICT: LOSS (SLIGHT L)',     color: '#E67E22' },
  severe:  { text: '🛑 VERDICT: SEVERE DEFICIT (MASSIVE L)', color: '#E74C3C' }
};
const fmtInt = (n) => { const x = Number(n) || 0; return Number.isInteger(x) ? x.toLocaleString('en-US') : x.toLocaleString('en-US', { maximumFractionDigits: 2 }); };
const fmt2 = (n) => (Number(n) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmt1 = (n) => (Number(n) || 0).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const MAX_LINES = 20;

export const ComparePage = {
  render() {
    return `
      <style>
        @keyframes cmpFadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
        @keyframes cmpShimmer { 0%{background-position:-200% 0;} 100%{background-position:200% 0;} }
        @keyframes cmpShake { 0%,100%{transform:translateX(0);} 25%{transform:translateX(-4px);} 75%{transform:translateX(4px);} }

        .premium-designed-panel {
          position:relative; width:55vw; max-width:760px; height:88vh; min-width:320px; padding:26px 30px;
          background:linear-gradient(135deg, rgba(5,4,4,.96) 0%, rgba(0,0,0,.99) 100%);
          box-shadow:0 24px 50px rgba(0,0,0,.95), inset 0 0 30px rgba(0,0,0,.9);
          display:flex; flex-direction:column; overflow:hidden; backdrop-filter:blur(4px);
        }
        @media (max-width:1024px){ .premium-designed-panel{ width:78vw; } }
        @media (max-width:768px){ .premium-designed-panel{ width:93vw; padding:18px; } }
        @media (max-height:580px){
          .premium-designed-panel{ height:93vh; padding:14px 16px; }
          #compare-header-container{ padding-bottom:8px !important; margin-bottom:10px !important; }
          #compare-title{ font-size:1.25rem !important; }
          .cmp-hint{ margin-bottom:8px !important; }
        }

        #compare-header-container{ z-index:3; position:relative; display:flex; align-items:center; gap:12px;
          border-bottom:1px solid rgba(214,175,55,.2); padding-bottom:12px; margin-bottom:14px; }
        #compare-title{ font-family:'Viaoda Libre',serif; color:#E5C158; margin:0; font-size:1.6rem;
          letter-spacing:2px; text-align:center; flex:1; text-shadow:0 3px 6px rgba(0,0,0,.8),0 0 10px rgba(229,193,88,.2); }
        .cmp-back-btn{ flex:0 0 auto; display:inline-flex; align-items:center; gap:6px; cursor:pointer;
          background:rgba(0,0,0,.4); border:1px solid rgba(212,175,55,.35); color:#E5C158;
          padding:6px 12px; border-radius:6px; font-size:.78rem; letter-spacing:1px; transition:all .2s; }
        .cmp-back-btn:hover{ background:rgba(212,175,55,.12); border-color:#E5C158; }
        .cmp-header-spacer{ flex:0 0 auto; width:64px; }

        #compare-panel-body{ z-index:3; position:relative; flex:1; display:flex; flex-direction:column; overflow:hidden; color:#F7FAFC; }

        /* ---- compact input zone ---- */
        .cmp-inputs{ display:grid; grid-template-columns:1fr auto 1fr; gap:12px; align-items:end; flex:0 0 auto; }
        .cmp-field label{ display:block; font-size:.68rem; letter-spacing:1.5px; color:rgba(229,193,88,.75); margin-bottom:5px; }
        .cmp-field input{ width:100%; padding:10px 12px; background:rgba(0,0,0,.6); border:1px solid rgba(212,175,55,.3);
          border-radius:6px; color:#fff; font-size:.88rem; outline:none; transition:all .3s; }
        .cmp-field input:focus{ border-color:#E5C158; box-shadow:0 0 10px rgba(229,193,88,.25); }
        .cmp-field input:disabled{ opacity:.5; cursor:not-allowed; }
        .cmp-field input.cmp-invalid{ border-color:#E74C3C; animation:cmpShake .3s ease; }
        #cmp-btn{ padding:10px 18px; background:linear-gradient(135deg,#D4AF37 0%,#AA7C11 100%); border:none; border-radius:6px;
          color:#050404; font-weight:700; font-size:.85rem; letter-spacing:1px; cursor:pointer;
          box-shadow:0 4px 15px rgba(170,124,17,.3); transition:transform .2s, opacity .2s, filter .2s; white-space:nowrap; }
        #cmp-btn:hover:not(:disabled){ transform:scale(1.03); filter:brightness(1.08); }
        #cmp-btn:disabled{ opacity:.6; cursor:not-allowed; }
        .cmp-hint{ display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin:8px 0 12px; flex:0 0 auto;
          color:rgba(247,250,252,.42); font-size:.68rem; letter-spacing:.4px; }
        .cmp-hint code{ color:rgba(229,193,88,.8); background:rgba(0,0,0,.4); padding:1px 5px; border-radius:4px; }
        .cmp-swap{ margin-left:auto; cursor:pointer; border:1px solid rgba(212,175,55,.25); background:rgba(0,0,0,.3);
          color:rgba(229,193,88,.8); font-size:.66rem; letter-spacing:.5px; padding:3px 8px; border-radius:999px; transition:all .2s; }
        .cmp-swap:hover{ border-color:#E5C158; color:#E5C158; }
        .cmp-note{ flex:0 0 auto; min-height:16px; margin:-4px 0 6px; color:#E74C3C; font-size:.7rem; letter-spacing:.5px; }

        #cmp-result{ flex:1; overflow-y:auto; padding-right:4px; }
        #cmp-result::-webkit-scrollbar{ width:6px; }
        #cmp-result::-webkit-scrollbar-thumb{ background:rgba(212,175,55,.4); border-radius:3px; }

        /* ---- idle / loading / states ---- */
        .cmp-idle{ height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; text-align:center; }
        .cmp-sigil{ font-size:2.6rem; filter:drop-shadow(0 0 14px rgba(212,175,55,.4)); opacity:.85; }
        .cmp-idle-title{ font-family:'Viaoda Libre',serif; color:#E5C158; letter-spacing:3px; font-size:1rem; }
        .cmp-idle-sub{ color:rgba(247,250,252,.5); font-size:.78rem; max-width:340px; line-height:1.5; }
        .cmp-loading{ height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; }
        .cmp-sk-line{ height:12px; border-radius:6px; background:linear-gradient(90deg, rgba(212,175,55,.05) 25%, rgba(212,175,55,.14) 50%, rgba(212,175,55,.05) 75%); background-size:200% 100%; animation:cmpShimmer 1.4s infinite; }
        .cmp-state{ height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; text-align:center; padding:20px; }
        .cmp-state-icon{ font-size:2.2rem; opacity:.85; }
        .cmp-state-title{ font-family:'Viaoda Libre',serif; color:#E5C158; letter-spacing:2px; font-size:1.05rem; }
        .cmp-state-msg{ color:rgba(247,250,252,.6); font-size:.82rem; max-width:380px; line-height:1.5; }
        .cmp-retry{ margin-top:4px; cursor:pointer; padding:8px 18px; border-radius:6px; font-size:.78rem; letter-spacing:1px;
          background:rgba(0,0,0,.4); border:1px solid rgba(212,175,55,.4); color:#E5C158; transition:all .2s; }
        .cmp-retry:hover{ background:rgba(212,175,55,.12); }

        /* ---- result ---- */
        .cmp-wrap{ animation:cmpFadeUp .4s ease both; padding-bottom:8px; }
        .cmp-verdict{ border:1px solid; border-radius:10px; padding:12px 16px; text-align:center; margin-bottom:12px; background:rgba(0,0,0,.45); }
        .cmp-verdict-text{ font-family:'Viaoda Libre',serif; font-size:1.15rem; letter-spacing:1.5px; }
        .cmp-ratio{ margin-top:4px; color:rgba(247,250,252,.5); font-size:.7rem; letter-spacing:1px; }
        .cmp-sides{ display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        @media (max-width:768px){ .cmp-sides{ grid-template-columns:1fr; } .cmp-inputs{ grid-template-columns:1fr; } #cmp-btn{ width:100%; } }
        .cmp-side{ border:1px solid rgba(212,175,55,.16); border-radius:10px; background:rgba(0,0,0,.35); overflow:hidden; display:flex; flex-direction:column; }
        .cmp-side-title{ padding:9px 12px; font-size:.74rem; letter-spacing:1.5px; color:#E5C158; border-left:3px solid #D4AF37;
          background:linear-gradient(90deg, rgba(212,175,55,.1), transparent); }
        .cmp-lines{ padding:6px 12px; }
        .cmp-line{ display:flex; justify-content:space-between; gap:10px; padding:5px 0; border-bottom:1px dashed rgba(212,175,55,.1); font-size:.78rem; }
        .cmp-line:last-child{ border-bottom:none; }
        .cmp-line-name{ color:rgba(247,250,252,.65); min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .cmp-line-val{ display:inline-flex; align-items:center; gap:5px; color:#F7FAFC; font-weight:600; white-space:nowrap; }
        .cmp-more{ padding:4px 0 2px; color:rgba(247,250,252,.45); font-size:.7rem; font-style:italic; }
        .cmp-totals{ margin-top:auto; border-top:1px solid rgba(212,175,55,.16); padding:8px 12px 10px; background:rgba(0,0,0,.3); }
        .cmp-totals-label{ font-size:.66rem; letter-spacing:1.2px; color:rgba(229,193,88,.7); margin-bottom:6px; }
        .cmp-total-line{ display:flex; align-items:center; flex-wrap:wrap; gap:5px; font-size:.76rem; color:rgba(247,250,252,.75); padding:2px 0; }
        .cmp-total-line b{ color:#F7FAFC; }
        .cmp-cur-icon{ width:15px; height:15px; object-fit:contain; flex:0 0 auto; filter:drop-shadow(0 1px 2px rgba(0,0,0,.6)); }
        .cmp-margin{ margin-top:12px; border-radius:10px; border:1px solid rgba(212,175,55,.16); background:rgba(0,0,0,.5); padding:10px 14px; }
        .cmp-margin-title{ font-size:.72rem; letter-spacing:1.5px; color:#E5C158; margin-bottom:6px; }
        .cmp-margin-line{ font-variant-numeric:tabular-nums; font-size:.85rem; font-weight:700; letter-spacing:.3px; }
        .cmp-warn{ margin-top:12px; border:1px solid rgba(230,126,34,.35); border-radius:10px; background:rgba(230,126,34,.06); padding:10px 14px; }
        .cmp-warn-title{ font-size:.74rem; letter-spacing:1.2px; color:#E67E22; margin-bottom:5px; }
        .cmp-warn-sub{ color:rgba(247,250,252,.55); font-size:.7rem; margin-bottom:6px; }
        .cmp-warn-item{ color:rgba(247,250,252,.75); font-size:.74rem; padding:2px 0; }
        .cmp-footer{ margin-top:14px; text-align:center; font-style:italic; color:rgba(247,250,252,.4); font-size:.72rem; }
      </style>

      <div id="page-compare" class="page-layer" style="opacity:0; transition:opacity .5s ease-in-out; width:100%; height:100vh; position:relative; background-color:#000; overflow:hidden; display:flex; justify-content:center; align-items:center;">
        <video autoplay loop muted playsinline style="position:absolute; top:0; left:0; width:100vw; height:100vh; object-fit:cover; filter:blur(12px); transform:scale(1.1); z-index:1;">
          <source src="./assets/vtc_bg.mp4" type="video/mp4" />
        </video>
        <div style="position:absolute; top:0; left:0; width:100%; height:100%; background:radial-gradient(circle at center, rgba(0,0,0,.45) 0%, rgba(0,0,0,.85) 100%); z-index:2; pointer-events:none;"></div>
        <div style="position:relative; z-index:3; width:100%; height:100%; display:flex; flex-direction:column; justify-content:center; align-items:center; pointer-events:auto;">
          <div class="premium-designed-panel">
            <div style="position:absolute; top:0; left:0; right:0; bottom:0; border-radius:12px; border:2px solid transparent; background:linear-gradient(135deg,#FFF176 0%,#D4AF37 25%,#5D4037 50%,#AA7C11 75%,#FFFDE7 100%) border-box; -webkit-mask:linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0); -webkit-mask-composite:destination-out; mask-composite:exclude; pointer-events:none; z-index:1;"></div>
            <div style="position:absolute; top:8px; left:8px; right:8px; bottom:8px; border:1px dashed rgba(212,175,55,.25); border-radius:8px; pointer-events:none; z-index:1;"></div>
            <div style="position:absolute; top:4px; left:4px; width:16px; height:16px; border-top:3px solid #FFE082; border-left:3px solid #FFE082; border-top-left-radius:4px; z-index:2; pointer-events:none;"></div>
            <div style="position:absolute; top:4px; right:4px; width:16px; height:16px; border-top:3px solid #D4AF37; border-right:3px solid #D4AF37; border-top-right-radius:4px; z-index:2; pointer-events:none;"></div>
            <div style="position:absolute; bottom:4px; left:4px; width:16px; height:16px; border-bottom:3px solid #AA7C11; border-left:3px solid #AA7C11; border-bottom-left-radius:4px; z-index:2; pointer-events:none;"></div>
            <div style="position:absolute; bottom:4px; right:4px; width:16px; height:16px; border-bottom:3px solid #FFE082; border-right:3px solid #FFE082; border-bottom-right-radius:4px; z-index:2; pointer-events:none;"></div>

            <div id="compare-header-container">
              <button id="cmp-back" class="cmp-back-btn" type="button">‹ MENU</button>
              <h2 id="compare-title">TRADE COMPARE MATRIX</h2>
              <div class="cmp-header-spacer"></div>
            </div>

            <div id="compare-panel-body">
              <div class="cmp-inputs">
                <div class="cmp-field">
                  <label for="cmp-giving">📤 GIVING</label>
                  <input id="cmp-giving" type="text" autocomplete="off" placeholder="Fritz + 2x Emperor Key" />
                </div>
                <button id="cmp-btn" type="button">️ COMPARE</button>
                <div class="cmp-field">
                  <label for="cmp-getting">📥 GETTING</label>
                  <input id="cmp-getting" type="text" autocomplete="off" placeholder="Vizard Mask + 500 keys" />
                </div>
              </div>
              <div class="cmp-hint">
                <span>split <code>+</code></span><span>qty <code>3x</code></span><span>raw <code>500 keys</code></span><span>perk lvl10 <code>max</code></span>
                <button id="cmp-swap" class="cmp-swap" type="button" title="Swap sides">⇄ swap</button>
              </div>
              <div class="cmp-note" id="cmp-note"></div>
              <div id="cmp-result"></div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  init() {
    const layer = document.getElementById('page-compare');
    setTimeout(() => { if (layer) layer.style.opacity = '1'; }, 50);

    const giving = document.getElementById('cmp-giving');
    const getting = document.getElementById('cmp-getting');
    const btn = document.getElementById('cmp-btn');
    const note = document.getElementById('cmp-note');
    const result = document.getElementById('cmp-result');
    const setHTML = (h) => { result.innerHTML = h; };

    const renderIdle = () => setHTML(`
      <div class="cmp-idle">
        <div class="cmp-sigil">⚖️</div>
        <div class="cmp-idle-title">AWAITING TRADE</div>
        <div class="cmp-idle-sub">Enter what you're giving and receiving — the mechanical engine returns an instant Win / Loss verdict.</div>
      </div>`);

    const renderLoading = () => setHTML(`
      <div class="cmp-loading">
        <div class="cmp-sk-line" style="width:50%;"></div>
        <div class="cmp-sk-line" style="width:85%;"></div>
        <div class="cmp-sk-line" style="width:85%;"></div>
        <div class="cmp-sk-line" style="width:60%;"></div>
      </div>`);

    const renderError = (msg) => {
      setHTML(`
        <div class="cmp-state">
          <div class="cmp-state-icon">⚠️</div>
          <div class="cmp-state-title">ENGINE OFFLINE</div>
          <div class="cmp-state-msg">${esc(msg || 'Could not reach the trade analytics backend. Check the server and try again.')}</div>
          <button class="cmp-retry" type="button" id="cmp-retry">RETRY</button>
        </div>`);
      const r = document.getElementById('cmp-retry');
      if (r) r.addEventListener('click', () => performCompare());
    };

    const linesHTML = (breakdown) => {
      const visible = breakdown.slice(0, MAX_LINES);
      let html = visible.map(b => `
        <div class="cmp-line">
          <span class="cmp-line-name">• ${esc(b.name)}</span>
          <span class="cmp-line-val">${ICON.key}${esc(b.keys > 0 ? fmtInt(b.keys) : 'N/A / O/C')} Keys</span>
        </div>`).join('');
      if (breakdown.length > MAX_LINES) {
        html += `<div class="cmp-more">…and ${breakdown.length - MAX_LINES} more item(s) included in the totals.</div>`;
      }
      return html;
    };

    const sideCard = (title, totalLabel, taxLabel, side) => `
      <div class="cmp-side">
        <div class="cmp-side-title">${title}</div>
        <div class="cmp-lines">${linesHTML(side.breakdown)}</div>
        <div class="cmp-totals">
          <div class="cmp-totals-label">${totalLabel}</div>
          <div class="cmp-total-line">${ICON.key}<b>${fmtInt(side.totals.keys)} Keys</b> · ${ICON.scroll}<b>${fmt2(side.totals.scrolls)} Scrolls</b> · ${ICON.mask}<b>${fmt2(side.totals.vizard)} Viz</b></div>
          <div class="cmp-total-line">💼 ${taxLabel} 💎 <b>${fmtInt(side.totals.gemsTax)} Gems</b> · 🪙 <b>${fmtInt(side.totals.goldTax)} Gold</b></div>
        </div>
      </div>`;

    const renderResult = (d) => {
      const v = VERDICTS[d.verdict] || VERDICTS.fair;
      const marginColor = d.margins.keys >= 0 ? '#2ECC71' : '#E74C3C';
      const unmatched = [
        ...d.sideA.unmatched.map(n => `${n} (Giving Side)`),
        ...d.sideB.unmatched.map(n => `${n} (Getting Side)`)
      ];
      setHTML(`
        <div class="cmp-wrap">
          <div class="cmp-verdict" style="border-color:${v.color}; box-shadow:0 0 22px ${v.color}22, inset 0 0 18px ${v.color}11;">
            <div class="cmp-verdict-text" style="color:${v.color}; text-shadow:0 0 12px ${v.color}55;">${v.text}</div>
            <div class="cmp-ratio">VALUE RATIO ${Number(d.ratio).toFixed(2)}×</div>
          </div>
          <div class="cmp-sides">
            ${sideCard('📤 SIDE A (WHAT YOU ARE GIVING)', 'TOTAL OUTBOUND VALUE', 'YOUR REQUIRED TRADE TAX:', d.sideA)}
            ${sideCard('📥 SIDE B (WHAT YOU ARE RECEIVING)', 'TOTAL INBOUND VALUE', 'THEIR REQUIRED TRADE TAX:', d.sideB)}
          </div>
          <div class="cmp-margin">
            <div class="cmp-margin-title">📊 TRANSACTION BREAKDOWN</div>
            <div class="cmp-margin-line" style="color:${marginColor};">📈 NET MARGIN: ${d.sign}${fmtInt(d.margins.keys)} Keys (${d.sign}${fmt1(d.margins.scrolls)} Scrolls / ${d.sign}${fmt2(d.margins.vizard)} Viz)</div>
          </div>
          ${unmatched.length ? `
          <div class="cmp-warn">
            <div class="cmp-warn-title">⚠️ TYPO WARNING / ITEMS NOT FOUND</div>
            <div class="cmp-warn-sub">The following inputs could not be cleanly identified and calculated as 0 Keys:</div>
            ${unmatched.map(u => `<div class="cmp-warn-item">• ${esc(u)}</div>`).join('')}
          </div>` : ''}
          <div class="cmp-footer">${esc(d.footer)}</div>
        </div>`);
    };

    const performCompare = async () => {
      if (_busy) return;
      const a = giving.value.trim(), b = getting.value.trim();
      giving.classList.remove('cmp-invalid'); getting.classList.remove('cmp-invalid');
      note.textContent = '';
      if (!a || !b) {
        if (!a) giving.classList.add('cmp-invalid');
        if (!b) getting.classList.add('cmp-invalid');
        note.textContent = 'Both sides are required — split items with +.';
        return;
      }
      _busy = true; btn.disabled = true; giving.disabled = true; getting.disabled = true; btn.textContent = '…';
      renderLoading();
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 15000);
      try {
        const res = await fetch('/api/compare', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ giving: a, getting: b }), signal: ctrl.signal });
        if (res.status === 400) throw new Error('invalid_format');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        renderResult(data);
      } catch (e) {
        renderError(e.message === 'invalid_format' ? 'Invalid formatting. Provide items for both fields split by +.' : (e.name === 'AbortError' ? 'The comparison timed out.' : null));
      } finally {
        clearTimeout(timer); _busy = false; btn.disabled = false; giving.disabled = false; getting.disabled = false; btn.textContent = '⚖️ COMPARE';
      }
    };

    btn.addEventListener('click', performCompare);
    giving.addEventListener('keydown', (e) => { if (e.key === 'Enter') performCompare(); });
    getting.addEventListener('keydown', (e) => { if (e.key === 'Enter') performCompare(); });
    document.getElementById('cmp-swap').addEventListener('click', () => {
      const t = giving.value; giving.value = getting.value; getting.value = t;
      giving.focus();
    });

    document.getElementById('cmp-back').addEventListener('click', async () => {
      window.silkAudio.playClick();
      layer.style.opacity = '0'; layer.style.pointerEvents = 'none';
      setTimeout(async () => {
        layer.remove();
        const { MenuPage } = await import('./menu.js');
        const viewport = document.getElementById('app-viewport');
        viewport.innerHTML = MenuPage.render();
        MenuPage.init();
      }, 500);
    });

    renderIdle();
  }
};

// pages/values.js — manual Atlas valuation registry (no AI). Mirrors the /value bot.
let _busy = false;
const EXAMPLES = ['Fritz', 'Emperor Key', 'Prestige Scroll', 'Vizard Mask']; // edit freely to match hot items
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const ICON = {
  key: `<img class="vtc-cur-icon" src="./assets/Key.webp" alt="" onerror="this.style.display='none'">`,
  scroll: `<img class="vtc-cur-icon" src="./assets/PrestigeScroll.webp" alt="" onerror="this.style.display='none'">`,
  mask: `<img class="vtc-cur-icon" src="./assets/Vizardmask.webp" alt="" onerror="this.style.display='none'">`
};

export const ValuesPage = {
  render() {
    return `
      <style>
        #vtc-input:focus { border-color:#E5C158 !important; box-shadow:0 0 10px rgba(229,193,88,.25); }
        @keyframes vtcSpin { to { transform:rotate(360deg); } }
        @keyframes vtcFadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
        @keyframes vtcShimmer { 0%{background-position:-200% 0;} 100%{background-position:200% 0;} }
        @keyframes vtcPulse { 0%,100%{opacity:.35;} 50%{opacity:.8;} }

        .premium-designed-panel {
          position:relative; width:55vw; max-width:760px; height:88vh; min-width:320px; padding:26px 30px;
          background:linear-gradient(135deg, rgba(5,4,4,.96) 0%, rgba(0,0,0,.99) 100%);
          box-shadow:0 24px 50px rgba(0,0,0,.95), inset 0 0 30px rgba(0,0,0,.9);
          display:flex; flex-direction:column; overflow:hidden; backdrop-filter:blur(4px);
        }
        @media (max-width:1024px){ .premium-designed-panel{ width:78vw; } }
        @media (max-width:768px){ .premium-designed-panel{ width:93vw; padding:18px 18px; } }
        @media (max-height:580px){
          .premium-designed-panel{ height:93vh; padding:14px 16px; }
          #registry-header-container{ padding-bottom:8px !important; margin-bottom:10px !important; }
          #registry-title{ font-size:1.25rem !important; }
          .vtc-search-row{ margin-bottom:10px !important; }
        }

        #registry-header-container{ z-index:3; position:relative; display:flex; align-items:center; gap:12px;
          border-bottom:1px solid rgba(214,175,55,.2); padding-bottom:12px; margin-bottom:16px; }
        #registry-title{ font-family:'Viaoda Libre',serif; color:#E5C158; margin:0; font-size:1.6rem;
          letter-spacing:2px; text-align:center; flex:1; text-shadow:0 3px 6px rgba(0,0,0,.8),0 0 10px rgba(229,193,88,.2); }
        .vtc-back-btn{ flex:0 0 auto; display:inline-flex; align-items:center; gap:6px; cursor:pointer;
          background:rgba(0,0,0,.4); border:1px solid rgba(212,175,55,.35); color:#E5C158;
          padding:6px 12px; border-radius:6px; font-size:.78rem; letter-spacing:1px; transition:all .2s; }
        .vtc-back-btn:hover{ background:rgba(212,175,55,.12); border-color:#E5C158; }
        .vtc-header-spacer{ flex:0 0 auto; width:64px; } /* balances the back button so title stays centered */

        #registry-panel-body{ z-index:3; position:relative; flex:1; display:flex; flex-direction:column; overflow:hidden; }
        .vtc-search-row{ display:flex; gap:10px; margin-bottom:18px; flex:0 0 auto; }
        .vtc-input-wrap{ position:relative; flex:1; }
        #vtc-input{ width:100%; padding:12px 38px 12px 16px; background:rgba(0,0,0,.6);
          border:1px solid rgba(212,175,55,.3); border-radius:6px; color:#fff; font-size:.95rem; outline:none; transition:all .3s; }
        #vtc-input::placeholder{ color:rgba(247,250,252,.4); }
        #vtc-input:disabled{ opacity:.5; cursor:not-allowed; }
        .vtc-clear{ position:absolute; right:8px; top:50%; transform:translateY(-50%); width:22px; height:22px;
          border:none; border-radius:50%; background:rgba(212,175,55,.15); color:#E5C158; cursor:pointer;
          font-size:.8rem; line-height:1; display:none; }
        .vtc-clear:hover{ background:rgba(212,175,55,.3); }
        #vtc-btn{ padding:12px 26px; background:linear-gradient(135deg,#D4AF37 0%,#AA7C11 100%); border:none;
          border-radius:6px; color:#050404; font-weight:700; font-size:.9rem; letter-spacing:1px; cursor:pointer;
          box-shadow:0 4px 15px rgba(170,124,17,.3); transition:transform .2s, opacity .2s, filter .2s; }
        #vtc-btn:hover:not(:disabled){ transform:scale(1.03); filter:brightness(1.08); }
        #vtc-btn:active:not(:disabled){ transform:scale(.97); }
        #vtc-btn:disabled{ opacity:.6; cursor:not-allowed; }

        #registry-result{ flex:1; overflow-y:auto; padding-right:4px; }
        #registry-result::-webkit-scrollbar{ width:6px; }
        #registry-result::-webkit-scrollbar-thumb{ background:rgba(212,175,55,.4); border-radius:3px; }

        /* ---- idle ---- */
        .vtc-idle{ height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:14px; text-align:center; }
        .vtc-sigil{ font-family:'Viaoda Libre',serif; font-size:3rem; color:#D4AF37; line-height:1;
          text-shadow:0 0 18px rgba(212,175,55,.45); animation:vtcPulse 3s ease-in-out infinite; }
        .vtc-idle-title{ font-family:'Viaoda Libre',serif; color:#E5C158; letter-spacing:3px; font-size:1rem; }
        .vtc-idle-sub{ color:rgba(247,250,252,.5); font-size:.8rem; }
        .vtc-chips{ display:flex; flex-wrap:wrap; gap:8px; justify-content:center; max-width:420px; margin-top:6px; }
        .vtc-chip{ cursor:pointer; padding:6px 14px; border-radius:999px; font-size:.78rem; letter-spacing:.5px;
          background:rgba(0,0,0,.4); border:1px solid rgba(212,175,55,.3); color:rgba(247,250,252,.8); transition:all .2s; }
        .vtc-chip:hover{ border-color:#E5C158; color:#E5C158; background:rgba(212,175,55,.1); transform:translateY(-1px); }

        /* ---- loading ---- */
        .vtc-loading{ height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:18px; }
        .vtc-sk-thumb{ width:120px; height:120px; border-radius:10px; border:1px solid rgba(212,175,55,.2);
          background:linear-gradient(90deg, rgba(212,175,55,.04) 25%, rgba(212,175,55,.12) 50%, rgba(212,175,55,.04) 75%);
          background-size:200% 100%; animation:vtcShimmer 1.4s infinite; }
        .vtc-sk-line{ height:12px; border-radius:6px; background:linear-gradient(90deg, rgba(212,175,55,.05) 25%, rgba(212,175,55,.14) 50%, rgba(212,175,55,.05) 75%);
          background-size:200% 100%; animation:vtcShimmer 1.4s infinite; }

        /* ---- result card ---- */
        .vtc-card{ animation:vtcFadeUp .4s ease both; padding-bottom:8px; }
        .vtc-card-head{ display:flex; gap:18px; align-items:center; margin-bottom:18px; }
        .vtc-thumb{ position:relative; width:120px; height:120px; flex:0 0 auto; border-radius:10px; overflow:hidden;
          background:rgba(5,4,4,.7); border:1px solid rgba(212,175,55,.3);
          box-shadow:0 12px 28px rgba(0,0,0,.7), inset 0 0 14px rgba(212,175,55,.06);
          display:flex; align-items:center; justify-content:center; }
        .vtc-thumb-img{ width:100%; height:100%; object-fit:cover; opacity:0; transition:opacity .4s; }
        .vtc-thumb-loader{ position:absolute; width:28px; height:28px; border-radius:50%;
          border:3px solid rgba(212,175,55,.15); border-top-color:#D4AF37; animation:vtcSpin 1s linear infinite; }
        .vtc-thumb-fallback{ color:rgba(212,175,55,.4); font-size:.7rem; letter-spacing:1px; text-align:center; padding:8px; }
        .vtc-head-text{ min-width:0; }
        .vtc-kicker{ font-size:.7rem; letter-spacing:2px; color:rgba(229,193,88,.7); margin-bottom:4px; }
        .vtc-name{ font-family:'Viaoda Libre',serif; color:#E5C158; font-size:1.5rem; line-height:1.1;
          letter-spacing:1px; text-shadow:0 2px 6px rgba(0,0,0,.7); word-break:break-word; }
        .vtc-tags{ display:flex; flex-wrap:wrap; gap:8px; margin-top:10px; }
        .vtc-pill{ font-size:.7rem; letter-spacing:1px; padding:3px 10px; border-radius:999px;
          border:1px solid rgba(212,175,55,.4); color:#E5C158; background:rgba(212,175,55,.08); }
        .vtc-pill.muted{ border-color:rgba(247,250,252,.2); color:rgba(247,250,252,.6); background:rgba(255,255,255,.03); }

        .vtc-section{ margin-top:16px; border:1px solid rgba(212,175,55,.16); border-radius:10px;
          background:rgba(0,0,0,.35); overflow:hidden; }
        .vtc-section-title{ display:flex; align-items:center; gap:8px; padding:10px 14px; font-size:.82rem;
          letter-spacing:1.5px; color:#E5C158; border-left:3px solid #D4AF37;
          background:linear-gradient(90deg, rgba(212,175,55,.1), transparent); }
        .vtc-rows{ padding:6px 14px 10px; }
        .vtc-row{ display:flex; justify-content:space-between; align-items:center; gap:12px;
          padding:7px 0; border-bottom:1px dashed rgba(212,175,55,.12); }
        .vtc-row:last-child{ border-bottom:none; }
        .vtc-row-label{ display:flex; align-items:center; gap:8px; color:rgba(247,250,252,.65); font-size:.85rem; }
        .vtc-row-val{ font-variant-numeric:tabular-nums; color:#F7FAFC; font-size:.9rem; font-weight:600;
          background:rgba(0,0,0,.4); padding:3px 10px; border-radius:6px; border:1px solid rgba(212,175,55,.12); }
        .vtc-cur-icon{ width:18px; height:18px; object-fit:contain; flex:0 0 auto; filter:drop-shadow(0 1px 2px rgba(0,0,0,.6)); }
        .vtc-rate-rise{ color:#2ECC71; } .vtc-rate-drop{ color:#9AA5A6; } .vtc-rate-stable{ color:#FF7A33; }
        .vtc-footer{ margin-top:18px; text-align:center; font-style:italic; color:rgba(247,250,252,.4); font-size:.74rem; letter-spacing:.5px; }

        /* ---- states ---- */
        .vtc-state{ height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; text-align:center; padding:20px; }
        .vtc-state-icon{ font-size:2.4rem; opacity:.8; }
        .vtc-state-title{ font-family:'Viaoda Libre',serif; color:#E5C158; letter-spacing:2px; font-size:1.1rem; }
        .vtc-state-msg{ color:rgba(247,250,252,.6); font-size:.85rem; max-width:380px; line-height:1.5; }
        .vtc-state-msg code{ color:#E5C158; background:rgba(0,0,0,.4); padding:1px 6px; border-radius:4px; }
        .vtc-retry{ margin-top:4px; cursor:pointer; padding:8px 18px; border-radius:6px; font-size:.8rem; letter-spacing:1px;
          background:rgba(0,0,0,.4); border:1px solid rgba(212,175,55,.4); color:#E5C158; transition:all .2s; }
        .vtc-retry:hover{ background:rgba(212,175,55,.12); }
      </style>

      <div id="page-values" class="page-layer" style="opacity:0; transition:opacity .5s ease-in-out; width:100%; height:100vh; position:relative; background-color:#000; overflow:hidden; display:flex; justify-content:center; align-items:center;">
        <video autoplay loop muted playsinline style="position:absolute; top:0; left:0; width:100vw; height:100vh; object-fit:cover; filter:blur(12px); transform:scale(1.1); z-index:1;">
          <source src="./assets/vtc_bg.mp4" type="video/mp4" />
        </video>
        <div style="position:absolute; top:0; left:0; width:100%; height:100%; background:radial-gradient(circle at center, rgba(0,0,0,.45) 0%, rgba(0,0,0,.85) 100%); z-index:2; pointer-events:none;"></div>
        <div id="values-content-wrapper" style="position:relative; z-index:3; width:100%; height:100%; display:flex; flex-direction:column; justify-content:center; align-items:center; pointer-events:auto;">
          <div class="premium-designed-panel">
            <div style="position:absolute; top:0; left:0; right:0; bottom:0; border-radius:12px; border:2px solid transparent; background:linear-gradient(135deg,#FFF176 0%,#D4AF37 25%,#5D4037 50%,#AA7C11 75%,#FFFDE7 100%) border-box; -webkit-mask:linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0); -webkit-mask-composite:destination-out; mask-composite:exclude; pointer-events:none; z-index:1;"></div>
            <div style="position:absolute; top:8px; left:8px; right:8px; bottom:8px; border:1px dashed rgba(212,175,55,.25); border-radius:8px; pointer-events:none; z-index:1;"></div>
            <div style="position:absolute; top:4px; left:4px; width:16px; height:16px; border-top:3px solid #FFE082; border-left:3px solid #FFE082; border-top-left-radius:4px; z-index:2; pointer-events:none;"></div>
            <div style="position:absolute; top:4px; right:4px; width:16px; height:16px; border-top:3px solid #D4AF37; border-right:3px solid #D4AF37; border-top-right-radius:4px; z-index:2; pointer-events:none;"></div>
            <div style="position:absolute; bottom:4px; left:4px; width:16px; height:16px; border-bottom:3px solid #AA7C11; border-left:3px solid #AA7C11; border-bottom-left-radius:4px; z-index:2; pointer-events:none;"></div>
            <div style="position:absolute; bottom:4px; right:4px; width:16px; height:16px; border-bottom:3px solid #FFE082; border-right:3px solid #FFE082; border-bottom-right-radius:4px; z-index:2; pointer-events:none;"></div>

            <div id="registry-header-container">
              <button id="vtc-back" class="vtc-back-btn" type="button">‹ MENU</button>
              <h2 id="registry-title">ASSET VALUATION REGISTRY</h2>
              <div class="vtc-header-spacer"></div>
            </div>

            <div id="registry-panel-body">
              <div class="vtc-search-row">
                <div class="vtc-input-wrap">
                  <input type="text" id="vtc-input" placeholder="Search item name (e.g. Fritz)…" autocomplete="off" />
                  <button id="vtc-clear" class="vtc-clear" type="button" aria-label="Clear">✕</button>
                </div>
                <button id="vtc-btn" type="button">QUERY</button>
              </div>
              <div id="registry-result"></div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  init() {
    const layer = document.getElementById('page-values');
    setTimeout(() => { if (layer) layer.style.opacity = '1'; }, 50);

    const input = document.getElementById('vtc-input');
    const btn = document.getElementById('vtc-btn');
    const clearBtn = document.getElementById('vtc-clear');
    const result = document.getElementById('registry-result');

    const setHTML = (html) => { result.innerHTML = html; };

    const renderIdle = () => setHTML(`
      <div class="vtc-idle">
        <div class="vtc-sigil">◆</div>
        <div class="vtc-idle-title">AWAITING QUERY</div>
        <div class="vtc-idle-sub">Type an item name, or tap an example below</div>
        <div class="vtc-chips">${EXAMPLES.map(e => `<button class="vtc-chip" type="button" data-q="${esc(e)}">${esc(e)}</button>`).join('')}</div>
      </div>`);

    const renderLoading = () => setHTML(`
      <div class="vtc-loading">
        <div class="vtc-sk-thumb"></div>
        <div class="vtc-sk-line" style="width:60%;"></div>
        <div class="vtc-sk-line" style="width:80%;"></div>
        <div class="vtc-sk-line" style="width:45%;"></div>
      </div>`);

    const renderNotFound = (q) => setHTML(`
      <div class="vtc-state">
        <div class="vtc-state-icon">🔍</div>
        <div class="vtc-state-title">NO MATCH</div>
        <div class="vtc-state-msg">The active index couldn't resolve any asset matching <code>${esc(q)}</code>. Try a different spelling or a partial name.</div>
      </div>`);

    const renderError = (msg) => {
      setHTML(`
        <div class="vtc-state">
          <div class="vtc-state-icon">⚠️</div>
          <div class="vtc-state-title">REGISTRY OFFLINE</div>
          <div class="vtc-state-msg">${esc(msg || 'Could not reach the valuation backend. Check the server and try again.')}</div>
          <button class="vtc-retry" type="button" id="vtc-retry">RETRY</button>
        </div>`);
      const r = document.getElementById('vtc-retry');
      if (r) r.addEventListener('click', () => performSearch());
    };

    const row = (label, icon, value) => `
      <div class="vtc-row"><span class="vtc-row-label">${icon}${esc(label)}</span><span class="vtc-row-val">${esc(value)}</span></div>`;

    const section = (title, rowsHTML) => `
      <div class="vtc-section"><div class="vtc-section-title">${title}</div><div class="vtc-rows">${rowsHTML}</div></div>`;

    const glyph = { rise: '📈', drop: '📉', stable: '🤝' };

    const renderResult = (d) => {
      const thumb = d.image_link
        ? `<div class="vtc-thumb"><div class="vtc-thumb-loader"></div><img class="vtc-thumb-img" src="/api/image?url=${encodeURIComponent(d.image_link)}" alt="${esc(d.name)}"><div class="vtc-thumb-fallback" style="display:none;">NO IMAGE</div></div>`
        : `<div class="vtc-thumb"><div class="vtc-thumb-fallback">NO IMAGE</div></div>`;

      let pricing = '';
      if (d.isPerk) {
        const p = d.perk;
        const tier = (t) => row('Keys', ICON.key, `${t.keys} Keys`) + row('Scrolls', ICON.scroll, t.scrolls) + row('Masks', ICON.mask, t.masks) + row('Gold Tax', '🪙', `${t.gold} Gold`);
        pricing = section('🟢 LEVEL 0 VALUATION', tier(p.lvl0)) + section('🔥 LEVEL 10 (MAX) VALUATION', tier(p.lvl10));
      } else {
        const s = d.standard;
        const base = row('Emperor Keys', ICON.key, `${s.base.keys} Keys`) + row('Prestige Scrolls', ICON.scroll, s.base.scrolls) + row('Vizard Masks', ICON.mask, s.base.masks);
        const taxRows = s.tax.map(t => t.kind === 'gem' ? row('Gems Cost', '💎', `${t.value} Gems`) : t.kind === 'gold' ? row('Gold Cost', '🪙', `${t.value} Gold`) : row('Cost', '🆓', 'None / 0')).join('');
        pricing = section('💰 BASE MARKET VALUATION', base) + section('⚖️ REQUIRED TRANSACTION TAX', taxRows);
      }

      const m = d.market;
      const market = section('📈 MARKET PROFILE',
        row('Rarity Tier', '', m.rarity) +
        row('Public Demand', '', m.demandText) +
        `<div class="vtc-row"><span class="vtc-row-label">Market Rate</span><span class="vtc-row-val vtc-rate-${m.rateKind}">${esc(m.rate)} ${glyph[m.rateKind] || ''}</span></div>`);

      const tags = `<span class="vtc-pill">${esc(m.rarity)}</span>` + (d.category ? `<span class="vtc-pill muted">${esc(d.category)}</span>` : '');

      setHTML(`
        <div class="vtc-card">
          <div class="vtc-card-head">
            ${thumb}
            <div class="vtc-head-text">
              <div class="vtc-kicker">🔮 ASSET VALUATION PROFILE</div>
              <div class="vtc-name">${esc(d.name)}</div>
              <div class="vtc-tags">${tags}</div>
            </div>
          </div>
          ${market}
          ${pricing}
          <div class="vtc-footer">${esc(d.footer)}</div>
        </div>`);

      const img = result.querySelector('.vtc-thumb-img');
      if (img) {
        const loader = result.querySelector('.vtc-thumb-loader');
        const fallback = result.querySelector('.vtc-thumb-fallback');
        img.onload = () => { if (loader) loader.style.display = 'none'; img.style.opacity = '1'; };
        img.onerror = () => { if (loader) loader.style.display = 'none'; img.style.display = 'none'; if (fallback) fallback.style.display = 'block'; };
      }
    };

    const performSearch = async () => {
      if (_busy) return;
      const q = input.value.trim();
      if (!q) return;
      _busy = true; btn.disabled = true; input.disabled = true; btn.textContent = '…';
      renderLoading();
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 12000);
      try {
        const res = await fetch('/api/value', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: q }), signal: ctrl.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data && data.found) renderResult(data);
        else renderNotFound(q);
      } catch (e) {
        renderError(e.name === 'AbortError' ? 'The query timed out. The registry took too long to respond.' : null);
      } finally {
        clearTimeout(timer); _busy = false; btn.disabled = false; input.disabled = false; btn.textContent = 'QUERY';
      }
    };

    // wiring
    btn.addEventListener('click', performSearch);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') performSearch(); });
    input.addEventListener('input', () => { clearBtn.style.display = input.value ? 'block' : 'none'; });
    clearBtn.addEventListener('click', () => { input.value = ''; clearBtn.style.display = 'none'; input.focus(); renderIdle(); });
    result.addEventListener('click', (e) => { const chip = e.target.closest('.vtc-chip'); if (chip) { input.value = chip.dataset.q || ''; clearBtn.style.display = 'block'; performSearch(); } });

    document.getElementById('vtc-back').addEventListener('click', async () => {
      window.silkAudio.playClick();
      layer.style.opacity = '0'; layer.style.pointerEvents = 'none';
      setTimeout(async () => {
        layer.remove();
        const { MenuPage } = await import('./menu.js'); // dynamic import avoids the menu<->values cycle
        const viewport = document.getElementById('app-viewport');
        viewport.innerHTML = MenuPage.render();
        MenuPage.init();
      }, 500);
    });

    renderIdle();
  }
};

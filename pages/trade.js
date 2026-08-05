// pages/trade.js — S.I.L.K. Trade Bulletin Board. Identity via bot-issued password login.
let _busy = false;
let _user = null, _token = null;
let _tab = 'open';
let _ticker = null;
const PRESETS = [1, 3, 6, 12, 24, 48, 72];
const STORE_KEY = 'silk_trade_session';
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const KEY_ICON = `<img class="tb-cur-icon" src="./assets/Key.webp" alt="" onerror="this.style.display='none'">`;
const fmtInt = (n) => { const x = Number(n) || 0; return Number.isInteger(x) ? x.toLocaleString('en-US') : x.toLocaleString('en-US', { maximumFractionDigits: 2 }); };

function sessionLoad() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) { const p = JSON.parse(raw); _user = p.user || null; _token = p.token || null; }
  } catch { /* storage unavailable */ }
}
function sessionSave() {
  try {
    if (_user && _token) localStorage.setItem(STORE_KEY, JSON.stringify({ user: _user, token: _token }));
    else localStorage.removeItem(STORE_KEY);
  } catch { /* ignore */ }
}
function avatarUrl(u) {
  const direct = u.avatar || u.sellerAvatar;
  if (direct) return direct;
  const id = u.id || u.sellerId;
  try { const idx = (BigInt(id) >> 22n) % 6n; return `https://cdn.discordapp.com/embed/avatars/${idx}.png`; }
  catch { return null; }
}
async function copyText(t) {
  try { await navigator.clipboard.writeText(t); return true; }
  catch {
    try {
      const ta = document.createElement('textarea');
      ta.value = t; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); ta.remove(); return true;
    } catch { return false; }
  }
}
function timeAgo(ts) {
  const s = Math.max(1, Math.floor((Date.now() - ts) / 1000));
  if (s < 60) return 'just now';
  const m = Math.floor(s / 60); if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}
function cdInfo(ts) {
  const ms = ts - Date.now();
  if (ms <= 0) return { text: 'EXPIRED', cls: 'tb-cd-exp' };
  const m = Math.floor(ms / 60000);
  if (m < 60) return { text: `${m}m left`, cls: 'tb-cd-red' };
  const h = Math.floor(m / 60);
  if (h < 6) return { text: `${h}h ${m % 60}m left`, cls: 'tb-cd-orange' };
  const d = Math.floor(h / 24);
  return { text: d > 0 ? `${d}d ${h % 24}h left` : `${h}h left`, cls: 'tb-cd-green' };
}

export const TradePage = {
  render() {
    return `
      <style>
        @keyframes tbFadeUp { from{opacity:0; transform:translateY(10px);} to{opacity:1; transform:none;} }
        @keyframes tbShimmer { 0%{background-position:-200% 0;} 100%{background-position:200% 0;} }
        @keyframes tbSpin { to{transform:rotate(360deg);} }

        .premium-designed-panel {
          position:relative; width:60vw; max-width:820px; height:88vh; min-width:320px; padding:22px 26px;
          background:linear-gradient(135deg, rgba(5,4,4,.96) 0%, rgba(0,0,0,.99) 100%);
          box-shadow:0 24px 50px rgba(0,0,0,.95), inset 0 0 30px rgba(0,0,0,.9);
          display:flex; flex-direction:column; overflow:hidden; backdrop-filter:blur(4px);
        }
        @media (max-width:1024px){ .premium-designed-panel{ width:80vw; } }
        @media (max-width:768px){ .premium-designed-panel{ width:94vw; padding:16px; } }
        @media (max-height:580px){
          .premium-designed-panel{ height:93vh; padding:12px 14px; }
          #trade-header{ padding-bottom:8px !important; margin-bottom:8px !important; }
          #trade-title{ font-size:1.2rem !important; }
        }

        #trade-header{ z-index:3; position:relative; display:flex; align-items:center; gap:10px;
          border-bottom:1px solid rgba(214,175,55,.2); padding-bottom:10px; margin-bottom:10px; }
        #trade-title{ font-family:'Viaoda Libre',serif; color:#E5C158; margin:0; font-size:1.5rem; letter-spacing:2px;
          text-align:center; flex:1; text-shadow:0 3px 6px rgba(0,0,0,.8),0 0 10px rgba(229,193,88,.2); }
        .tb-back-btn{ flex:0 0 auto; cursor:pointer; background:rgba(0,0,0,.4); border:1px solid rgba(212,175,55,.35);
          color:#E5C158; padding:6px 12px; border-radius:6px; font-size:.76rem; letter-spacing:1px; transition:all .2s; }
        .tb-back-btn:hover{ background:rgba(212,175,55,.12); border-color:#E5C158; }
        .tb-idchip{ flex:0 0 auto; display:inline-flex; align-items:center; gap:7px; max-width:180px; cursor:pointer;
          background:rgba(0,0,0,.4); border:1px solid rgba(212,175,55,.3); border-radius:999px; padding:4px 10px 4px 4px; transition:all .2s; }
        .tb-idchip:hover{ border-color:#E5C158; }
        .tb-idchip img{ width:24px; height:24px; border-radius:50%; object-fit:cover; border:1px solid rgba(212,175,55,.4); }
        .tb-idchip span{ color:#F7FAFC; font-size:.74rem; letter-spacing:.4px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .tb-idchip.connect{ padding:6px 12px; color:#E5C158; font-size:.72rem; letter-spacing:1px; }
        .tb-idchip.connect:hover{ background:rgba(212,175,55,.12); }

        #trade-body{ z-index:3; position:relative; flex:1; display:flex; flex-direction:column; overflow:hidden; color:#F7FAFC; }

        .tb-toolbar{ display:flex; align-items:center; gap:8px; flex:0 0 auto; margin-bottom:10px; flex-wrap:wrap; }
        .tb-tab{ cursor:pointer; background:none; border:none; border-bottom:2px solid transparent; color:rgba(247,250,252,.55);
          font-size:.8rem; letter-spacing:1.2px; padding:6px 10px; transition:all .2s; }
        .tb-tab b{ color:rgba(229,193,88,.8); font-weight:600; }
        .tb-tab.active{ color:#E5C158; border-bottom-color:#D4AF37; }
        .tb-spacer{ flex:1; }
        .tb-icon-btn{ cursor:pointer; background:rgba(0,0,0,.4); border:1px solid rgba(212,175,55,.3); color:#E5C158;
          width:30px; height:30px; border-radius:6px; font-size:.9rem; transition:all .2s; }
        .tb-icon-btn:hover{ border-color:#E5C158; background:rgba(212,175,55,.12); }
        .tb-icon-btn.spin{ animation:tbSpin 1s linear infinite; }
        #tb-post-btn{ cursor:pointer; padding:8px 16px; background:linear-gradient(135deg,#D4AF37 0%,#AA7C11 100%); border:none;
          border-radius:6px; color:#050404; font-weight:700; font-size:.8rem; letter-spacing:1px;
          box-shadow:0 4px 15px rgba(170,124,17,.3); transition:transform .2s, filter .2s, opacity .2s; }
        #tb-post-btn:hover:not(:disabled){ transform:scale(1.03); filter:brightness(1.08); }
        #tb-post-btn:disabled{ opacity:.6; cursor:not-allowed; }

        .tb-filters{ display:flex; gap:8px; flex:0 0 auto; margin-bottom:10px; }
        #tb-q{ flex:1; padding:8px 12px; background:rgba(0,0,0,.6); border:1px solid rgba(212,175,55,.3); border-radius:6px;
          color:#fff; font-size:.82rem; outline:none; transition:all .3s; }
        #tb-q:focus{ border-color:#E5C158; box-shadow:0 0 10px rgba(229,193,88,.25); }
        #tb-sort{ background:rgba(0,0,0,.6); border:1px solid rgba(212,175,55,.3); color:#E5C158; border-radius:6px;
          font-size:.76rem; padding:0 8px; outline:none; }
        #tb-sort option{ background:#0a0805; }

        #tb-list{ flex:1; overflow-y:auto; padding-right:4px; display:flex; flex-direction:column; gap:10px; }
        #tb-list::-webkit-scrollbar{ width:6px; } #tb-list::-webkit-scrollbar-thumb{ background:rgba(212,175,55,.4); border-radius:3px; }

        .tb-card{ animation:tbFadeUp .35s ease both; border:1px solid rgba(212,175,55,.18); border-radius:10px;
          background:rgba(0,0,0,.4); padding:12px 14px; transition:border-color .2s, transform .2s; }
        .tb-card:hover{ border-color:rgba(212,175,55,.45); transform:translateY(-1px); }
        .tb-card-top{ display:flex; align-items:center; gap:8px; margin-bottom:8px; }
        .tb-card-top img{ width:26px; height:26px; border-radius:50%; object-fit:cover; border:1px solid rgba(212,175,55,.4); }
        .tb-seller{ font-size:.84rem; font-weight:600; color:#F7FAFC; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .tb-cd{ margin-left:auto; flex:0 0 auto; font-size:.66rem; letter-spacing:.8px; padding:3px 9px; border-radius:999px; border:1px solid; }
        .tb-cd-green{ color:#2ECC71; border-color:rgba(46,204,113,.4); background:rgba(46,204,113,.07); }
        .tb-cd-orange{ color:#E67E22; border-color:rgba(230,126,34,.4); background:rgba(230,126,34,.07); }
        .tb-cd-red{ color:#E74C3C; border-color:rgba(231,76,60,.45); background:rgba(231,76,60,.08); }
        .tb-cd-exp{ color:rgba(247,250,252,.4); border-color:rgba(247,250,252,.2); background:rgba(255,255,255,.03); }
        .tb-offer-row{ display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:6px; }
        .tb-chip{ font-size:.72rem; padding:3px 9px; border-radius:6px; background:rgba(212,175,55,.08);
          border:1px solid rgba(212,175,55,.25); color:rgba(247,250,252,.85); }
        .tb-chip.bad{ border-color:rgba(231,76,60,.4); color:rgba(231,76,60,.85); background:rgba(231,76,60,.06); }
        .tb-val-badge{ margin-left:auto; flex:0 0 auto; display:inline-flex; align-items:center; gap:5px; font-size:.72rem;
          font-weight:700; color:#E5C158; background:rgba(0,0,0,.5); border:1px solid rgba(212,175,55,.35);
          padding:3px 9px; border-radius:999px; }
        .tb-cur-icon{ width:14px; height:14px; object-fit:contain; }
        .tb-seek{ font-size:.78rem; color:rgba(247,250,252,.7); margin-bottom:6px; display:flex; align-items:center; gap:6px; flex-wrap:wrap; }
        .tb-seek .tb-lbl{ color:rgba(229,193,88,.7); font-size:.66rem; letter-spacing:1px; }
        .tb-note{ font-size:.74rem; font-style:italic; color:rgba(247,250,252,.5); margin-bottom:8px;
          display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
        .tb-foot{ display:flex; align-items:center; gap:8px; font-size:.68rem; color:rgba(247,250,252,.4); }
        .tb-mini-btn{ cursor:pointer; margin-left:auto; background:none; border:1px solid rgba(212,175,55,.3); color:#E5C158;
          font-size:.66rem; letter-spacing:.6px; padding:4px 10px; border-radius:999px; transition:all .2s; }
        .tb-mini-btn:hover{ border-color:#E5C158; background:rgba(212,175,55,.12); }
        .tb-mini-btn + .tb-mini-btn{ margin-left:0; }
        .tb-mini-btn.danger{ border-color:rgba(231,76,60,.4); color:#E74C3C; }
        .tb-mini-btn.danger:hover{ background:rgba(231,76,60,.1); }
        .tb-status{ font-size:.62rem; letter-spacing:1px; padding:2px 8px; border-radius:999px; border:1px solid; }
        .tb-status.open{ color:#2ECC71; border-color:rgba(46,204,113,.4); }
        .tb-status.closed{ color:rgba(247,250,252,.5); border-color:rgba(247,250,252,.25); }

        .tb-state{ height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; text-align:center; padding:16px; }
        .tb-state-icon{ font-size:2.4rem; opacity:.85; }
        .tb-state-title{ font-family:'Viaoda Libre',serif; color:#E5C158; letter-spacing:2px; font-size:1.05rem; }
        .tb-state-msg{ color:rgba(247,250,252,.55); font-size:.8rem; max-width:380px; line-height:1.5; }
        .tb-state-btn{ cursor:pointer; padding:8px 18px; border-radius:6px; font-size:.78rem; letter-spacing:1px;
          background:linear-gradient(135deg,#D4AF37,#AA7C11); border:none; color:#050404; font-weight:700; }
        .tb-sk{ height:86px; border-radius:10px; border:1px solid rgba(212,175,55,.15);
          background:linear-gradient(90deg, rgba(212,175,55,.04) 25%, rgba(212,175,55,.1) 50%, rgba(212,175,55,.04) 75%);
          background-size:200% 100%; animation:tbShimmer 1.4s infinite; }

        /* ---- modals ---- */
        .tb-modal{ position:absolute; inset:0; z-index:40; background:rgba(0,0,0,.78); backdrop-filter:blur(5px);
          display:flex; align-items:center; justify-content:center; }
        .tb-modal-card{ width:min(92%, 560px); max-height:92%; overflow-y:auto; border-radius:12px;
          border:1px solid rgba(212,175,55,.4); background:linear-gradient(160deg, rgba(10,8,5,.98), rgba(0,0,0,.99));
          box-shadow:0 30px 60px rgba(0,0,0,.9); padding:18px 20px; }
        .tb-modal-card::-webkit-scrollbar{ width:6px; } .tb-modal-card::-webkit-scrollbar-thumb{ background:rgba(212,175,55,.4); border-radius:3px; }
        .tb-modal-title{ font-family:'Viaoda Libre',serif; color:#E5C158; letter-spacing:2px; font-size:1.1rem; margin-bottom:14px; text-align:center; }
        .tb-field label{ display:block; font-size:.66rem; letter-spacing:1.4px; color:rgba(229,193,88,.75); margin:10px 0 5px; }
        .tb-field input, .tb-field textarea{ width:100%; padding:9px 12px; background:rgba(0,0,0,.6);
          border:1px solid rgba(212,175,55,.3); border-radius:6px; color:#fff; font-size:.84rem; outline:none;
          font-family:inherit; resize:vertical; transition:all .3s; }
        .tb-field input:focus, .tb-field textarea:focus{ border-color:#E5C158; box-shadow:0 0 10px rgba(229,193,88,.2); }
        .tb-login-note{ margin-top:12px; padding:9px 12px; border:1px dashed rgba(212,175,55,.3); border-radius:8px;
          color:rgba(247,250,252,.55); font-size:.7rem; line-height:1.5; }
        .tb-login-note code{ color:#E5C158; background:rgba(0,0,0,.4); padding:1px 5px; border-radius:4px; }
        .tb-preview{ min-height:26px; margin-top:6px; display:flex; align-items:center; gap:6px; flex-wrap:wrap; }
        .tb-presets{ display:flex; gap:8px; overflow-x:auto; padding:2px 2px 6px; }
        .tb-presets::-webkit-scrollbar{ height:4px; } .tb-presets::-webkit-scrollbar-thumb{ background:rgba(212,175,55,.4); border-radius:2px; }
        .tb-preset{ flex:0 0 auto; cursor:pointer; font-size:.72rem; letter-spacing:.6px; padding:6px 14px; border-radius:999px;
          border:1px solid rgba(212,175,55,.3); background:rgba(0,0,0,.4); color:rgba(247,250,252,.7); transition:all .2s; }
        .tb-preset.sel{ border-color:#E5C158; color:#050404; background:linear-gradient(135deg,#D4AF37,#AA7C11); font-weight:700; }
        .tb-counter{ font-size:.64rem; color:rgba(247,250,252,.4); text-align:right; margin-top:3px; }
        .tb-modal-err{ min-height:16px; color:#E74C3C; font-size:.72rem; margin-top:8px; }
        .tb-modal-actions{ display:flex; gap:10px; margin-top:12px; }
        .tb-modal-actions .tb-primary{ flex:1; cursor:pointer; padding:10px; border:none; border-radius:6px; font-weight:700;
          letter-spacing:1px; font-size:.84rem; color:#050404; background:linear-gradient(135deg,#D4AF37,#AA7C11); transition:filter .2s, opacity .2s; }
        .tb-modal-actions .tb-primary:disabled{ opacity:.6; cursor:not-allowed; }
        .tb-modal-actions .tb-ghost{ cursor:pointer; padding:10px 16px; border-radius:6px; background:none;
          border:1px solid rgba(212,175,55,.3); color:rgba(247,250,252,.6); font-size:.8rem; letter-spacing:1px; }
        .tb-modal-actions .tb-ghost:hover{ border-color:#E5C158; color:#E5C158; }
      </style>

      <div id="page-trade" class="page-layer" style="opacity:0; transition:opacity .5s ease-in-out; width:100%; height:100vh; position:relative; background-color:#000; overflow:hidden; display:flex; justify-content:center; align-items:center;">
        <video autoplay loop muted playsinline style="position:absolute; top:0; left:0; width:100vw; height:100vh; object-fit:cover; filter:blur(12px); transform:scale(1.1); z-index:1;">
          <source src="./assets/vtc_bg.mp4" type="video/mp4" />
        </video>
        <div style="position:absolute; top:0; left:0; width:100%; height:100%; background:radial-gradient(circle at center, rgba(0,0,0,.45) 0%, rgba(0,0,0,.85) 100%); z-index:2; pointer-events:none;"></div>
        <div style="position:relative; z-index:3; width:100%; height:100%; display:flex; flex-direction:column; justify-content:center; align-items:center; pointer-events:auto;">
          <div class="premium-designed-panel" id="tb-panel">
            <div style="position:absolute; top:0; left:0; right:0; bottom:0; border-radius:12px; border:2px solid transparent; background:linear-gradient(135deg,#FFF176 0%,#D4AF37 25%,#5D4037 50%,#AA7C11 75%,#FFFDE7 100%) border-box; -webkit-mask:linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0); -webkit-mask-composite:destination-out; mask-composite:exclude; pointer-events:none; z-index:1;"></div>
            <div style="position:absolute; top:8px; left:8px; right:8px; bottom:8px; border:1px dashed rgba(212,175,55,.25); border-radius:8px; pointer-events:none; z-index:1;"></div>
            <div style="position:absolute; top:4px; left:4px; width:16px; height:16px; border-top:3px solid #FFE082; border-left:3px solid #FFE082; border-top-left-radius:4px; z-index:2; pointer-events:none;"></div>
            <div style="position:absolute; top:4px; right:4px; width:16px; height:16px; border-top:3px solid #D4AF37; border-right:3px solid #D4AF37; border-top-right-radius:4px; z-index:2; pointer-events:none;"></div>
            <div style="position:absolute; bottom:4px; left:4px; width:16px; height:16px; border-bottom:3px solid #AA7C11; border-left:3px solid #AA7C11; border-bottom-left-radius:4px; z-index:2; pointer-events:none;"></div>
            <div style="position:absolute; bottom:4px; right:4px; width:16px; height:16px; border-bottom:3px solid #FFE082; border-right:3px solid #FFE082; border-bottom-right-radius:4px; z-index:2; pointer-events:none;"></div>

            <div id="trade-header">
              <button id="tb-back" class="tb-back-btn" type="button">‹ MENU</button>
              <h2 id="trade-title">TRADE BULLETIN BOARD</h2>
              <div id="tb-idslot"></div>
            </div>

            <div id="trade-body">
              <div class="tb-toolbar">
                <button class="tb-tab active" id="tb-tab-open" type="button">OPEN ADS <b id="tb-open-count"></b></button>
                <button class="tb-tab" id="tb-tab-mine" type="button">MY ADS <b id="tb-my-count"></b></button>
                <div class="tb-spacer"></div>
                <button class="tb-icon-btn" id="tb-refresh" type="button" title="Refresh">⟳</button>
                <button id="tb-post-btn" type="button">＋ POST AD</button>
              </div>
              <div class="tb-filters" id="tb-filters">
                <input id="tb-q" type="text" autocomplete="off" placeholder="Filter by item name…" />
                <select id="tb-sort">
                  <option value="new">Newest</option>
                  <option value="soon">Ending soon</option>
                </select>
              </div>
              <div id="tb-list"></div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  init() {
    sessionLoad();
    const layer = document.getElementById('page-trade');
    setTimeout(() => { if (layer) layer.style.opacity = '1'; }, 50);

    const list = document.getElementById('tb-list');
    const idslot = document.getElementById('tb-idslot');
    const postBtn = document.getElementById('tb-post-btn');
    const refreshBtn = document.getElementById('tb-refresh');
    const qInput = document.getElementById('tb-q');
    const sortSel = document.getElementById('tb-sort');
    const filtersRow = document.getElementById('tb-filters');
    const panel = document.getElementById('tb-panel');

    const renderIdChip = () => {
      if (_user) {
        const url = avatarUrl(_user);
        idslot.innerHTML = `<div class="tb-idchip" id="tb-chip" title="Click to log out">
          <img src="/api/image?url=${encodeURIComponent(url)}" alt="" onerror="this.style.visibility='hidden'">
          <span>${esc(_user.globalName || _user.username)}</span></div>`;
        const chip = document.getElementById('tb-chip');
        chip.addEventListener('click', () => {
          if (chip.dataset.armed !== '1') {
            chip.dataset.armed = '1';
            chip.querySelector('span').textContent = 'LOG OUT?';
            setTimeout(() => { if (chip.dataset.armed === '1') { chip.dataset.armed = '0'; chip.querySelector('span').textContent = _user.globalName || _user.username; } }, 2500);
            return;
          }
          _user = null; _token = null; sessionSave(); renderIdChip();
          if (_tab === 'mine') load();
        });
      } else {
        idslot.innerHTML = `<button class="tb-idchip connect" id="tb-login-btn" type="button">🔑 LOGIN</button>`;
        document.getElementById('tb-login-btn').addEventListener('click', () => openLoginModal());
      }
    };

    const openLoginModal = (onSuccess) => {
      const modal = document.createElement('div');
      modal.className = 'tb-modal';
      modal.innerHTML = `
        <div class="tb-modal-card">
          <div class="tb-modal-title">🔑 TRADER LOGIN</div>
          <div class="tb-field">
            <label>DISCORD USERNAME</label>
            <input id="tb-l-user" type="text" autocomplete="off" placeholder="your_username" />
          </div>
          <div class="tb-field">
            <label>PASSWORD</label>
            <input id="tb-l-pass" type="password" placeholder="••••••••" />
          </div>
          <div class="tb-login-note">New here? Create your account first — run <code>/activity set-password</code> on the S.I.L.K. bot in the server, then come back and log in.</div>
          <div class="tb-modal-err" id="tb-l-err"></div>
          <div class="tb-modal-actions">
            <button class="tb-ghost" id="tb-l-cancel" type="button">CANCEL</button>
            <button class="tb-primary" id="tb-l-submit" type="button">LOGIN</button>
          </div>
        </div>`;
      panel.appendChild(modal);
      const err = modal.querySelector('#tb-l-err');
      const uIn = modal.querySelector('#tb-l-user');
      const pIn = modal.querySelector('#tb-l-pass');
      modal.querySelector('#tb-l-cancel').addEventListener('click', () => modal.remove());
      const submit = async () => {
        err.textContent = '';
        const username = uIn.value.trim(), password = pIn.value;
        if (!username || !password) { err.textContent = 'Enter your username and password.'; return; }
        const btn = modal.querySelector('#tb-l-submit');
        btn.disabled = true; btn.textContent = '…';
        try {
          const res = await fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) });
          const d = await res.json();
          if (!res.ok) {
            if (d.error === 'no_account') throw new Error('No account found. Set one up with /activity set-password on the bot.');
            if (d.error === 'bad_password') throw new Error('Wrong password. Try again.');
            throw new Error(d.error || 'Login failed.');
          }
          _user = d.user; _token = d.token; sessionSave();
          modal.remove();
          renderIdChip();
          if (_tab === 'mine') load();
          if (onSuccess) onSuccess();
        } catch (e) {
          err.textContent = String(e.message);
          btn.disabled = false; btn.textContent = 'LOGIN';
        }
      };
      modal.querySelector('#tb-l-submit').addEventListener('click', submit);
      pIn.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });
      uIn.focus();
    };

    const load = async () => {
      refreshBtn.classList.add('spin');
      list.innerHTML = `<div class="tb-sk"></div><div class="tb-sk"></div><div class="tb-sk"></div>`;
      try {
        const params = new URLSearchParams();
        if (_tab === 'open') {
          const q = qInput.value.trim(); if (q) params.set('q', q);
          params.set('sort', sortSel.value);
        } else {
          if (!_user) {
            list.innerHTML = `<div class="tb-state"><div class="tb-state-icon">🔑</div><div class="tb-state-title">LOGIN TO MANAGE ADS</div><div class="tb-state-msg">Your posted ads and their controls appear here once you log in. No account yet? Use /activity set-password on the bot.</div><button class="tb-state-btn" id="tb-state-login" type="button">🔑 LOGIN</button></div>`;
            document.getElementById('tb-state-login').addEventListener('click', () => openLoginModal(() => load()));
            return;
          }
          params.set('seller', _user.id);
        }
        const res = await fetch(`/api/trade?${params.toString()}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        document.getElementById('tb-open-count').textContent = data.openCount != null ? `(${data.openCount})` : '';
        if (_tab === 'mine') document.getElementById('tb-my-count').textContent = `(${data.ads.filter(a => a.status === 'open' && !a.expired).length})`;
        if (!data.ads.length) {
          list.innerHTML = _tab === 'open'
            ? `<div class="tb-state"><div class="tb-state-icon">📜</div><div class="tb-state-title">BOARD IS EMPTY</div><div class="tb-state-msg">No open ads match. Be the first — hit ＋ POST AD and set your offer live.</div></div>`
            : `<div class="tb-state"><div class="tb-state-icon">📜</div><div class="tb-state-title">NO ADS YET</div><div class="tb-state-msg">You haven't posted anything. Your live and past ads will appear here.</div></div>`;
          return;
        }
        list.innerHTML = data.ads.map(a => cardHTML(a)).join('');
        wireCards();
        updateCountdowns();
      } catch (e) {
        list.innerHTML = `<div class="tb-state"><div class="tb-state-icon">⚠️</div><div class="tb-state-title">BOARD OFFLINE</div><div class="tb-state-msg">Could not reach the bulletin backend. Refresh to retry.</div></div>`;
      } finally {
        refreshBtn.classList.remove('spin');
      }
    };

    const cardHTML = (a) => {
      const cd = cdInfo(a.deadlineTs);
      const av = avatarUrl(a);
      const offerChips = a.offeringChips.map(c => `<span class="tb-chip">${esc(c)}</span>`).join('');
      const badge = a.offeringKeys != null ? `<span class="tb-val-badge">${KEY_ICON}≈ ${fmtInt(a.offeringKeys)} Keys</span>` : '';
      const seekBadge = a.seekingKeys != null ? `<span class="tb-val-badge" style="margin-left:0;">${KEY_ICON}≈ ${fmtInt(a.seekingKeys)} Keys</span>` : '';
      const seek = `<div class="tb-seek"><span class="tb-lbl">SEEKING</span> ${esc(a.seekingRaw)} ${seekBadge}</div>`;
      const note = a.note ? `<div class="tb-note">“${esc(a.note)}”</div>` : '';
      let foot = `<span>${timeAgo(a.createdAt)}</span>
        <button class="tb-mini-btn" data-act="copy" data-name="${esc(a.sellerUsername)}" type="button">⧉ COPY USERNAME</button>`;
      if (_tab === 'mine' && _user) {
        const st = a.expired ? 'EXPIRED' : (a.status === 'open' ? 'OPEN' : 'CLOSED');
        const stCls = a.expired ? 'closed' : a.status;
        foot = `<span class="tb-status ${stCls}">${st}</span><span>${timeAgo(a.createdAt)}</span>
          ${(!a.expired && a.status === 'open') ? `<button class="tb-mini-btn" data-act="close" data-id="${a.id}" type="button">CLOSE</button>` : ''}
          ${(!a.expired && a.status === 'closed') ? `<button class="tb-mini-btn" data-act="reopen" data-id="${a.id}" type="button">REOPEN</button>` : ''}
          <button class="tb-mini-btn danger" data-act="del" data-id="${a.id}" type="button">DELETE</button>`;
      }
      return `<div class="tb-card" data-cd="${a.deadlineTs}">
        <div class="tb-card-top">
          <img src="/api/image?url=${encodeURIComponent(av)}" alt="" onerror="this.style.visibility='hidden'">
          <span class="tb-seller">${esc(a.sellerName)}</span>
          <span class="tb-cd ${cd.cls}" data-cdchip>${cd.text}</span>
        </div>
        <div class="tb-offer-row">${offerChips}${badge}</div>
        ${seek}
        ${note}
        <div class="tb-foot">${foot}</div>
      </div>`;
    };

    const updateCountdowns = () => {
      list.querySelectorAll('.tb-card[data-cd]').forEach(card => {
        const chip = card.querySelector('[data-cdchip]');
        if (!chip) return;
        const info = cdInfo(Number(card.dataset.cd));
        chip.textContent = info.text;
        chip.className = `tb-cd ${info.cls}`;
      });
    };
    if (_ticker) clearInterval(_ticker);
    _ticker = setInterval(updateCountdowns, 30000);

    const authedFetch = async (url, opts) => {
      const res = await fetch(url, { ...opts, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${_token}` } });
      if (res.status === 401) { _user = null; _token = null; sessionSave(); renderIdChip(); throw new Error('Session expired — log in again.'); }
      return res;
    };

    const wireCards = () => {
      list.querySelectorAll('.tb-mini-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const act = btn.dataset.act;
          if (act === 'copy') {
            const ok = await copyText(btn.dataset.name);
            btn.textContent = ok ? '✓ COPIED' : 'COPY FAILED';
            setTimeout(() => { btn.textContent = '⧉ COPY USERNAME'; }, 1500);
            return;
          }
          if (act === 'del' && btn.dataset.armed !== '1') {
            btn.dataset.armed = '1'; btn.textContent = 'SURE?';
            setTimeout(() => { btn.dataset.armed = '0'; btn.textContent = 'DELETE'; }, 2500);
            return;
          }
          btn.disabled = true;
          try {
            if (act === 'close' || act === 'reopen') {
              const res = await authedFetch('/api/trade', { method: 'PATCH', body: JSON.stringify({ id: btn.dataset.id, action: act }) });
              const d = await res.json(); if (!res.ok) throw new Error(d.error);
            }
            if (act === 'del') {
              const res = await authedFetch(`/api/trade?id=${btn.dataset.id}`, { method: 'DELETE' });
              const d = await res.json(); if (!res.ok) throw new Error(d.error);
            }
            load();
          } catch (e) {
            list.insertAdjacentHTML('afterbegin', `<div class="tb-state-msg" style="color:#E74C3C; text-align:center;">${esc(String(e.message))}</div>`);
          } finally { btn.disabled = false; }
        });
      });
    };

    // ---- composer ----
    const openComposer = () => {
      const modal = document.createElement('div');
      modal.className = 'tb-modal';
      modal.innerHTML = `
        <div class="tb-modal-card">
          <div class="tb-modal-title">📜 POST A TRADE AD</div>
          <div class="tb-field">
            <label>📤 WHAT YOU ARE OFFERING (item syntax)</label>
            <input id="tb-c-offer" type="text" autocomplete="off" placeholder="Fritz + 2x Emperor Key" maxlength="300" />
            <div class="tb-preview" id="tb-c-offer-prev"></div>
          </div>
          <div class="tb-field">
            <label>📥 WHAT YOU WANT (items or plain text)</label>
            <input id="tb-c-seek" type="text" autocomplete="off" placeholder="Vizard Mask + 500 keys — or “any offers”" maxlength="300" />
            <div class="tb-preview" id="tb-c-seek-prev"></div>
          </div>
          <div class="tb-field">
            <label>⏳ OFFER DEADLINE</label>
            <div class="tb-presets" id="tb-c-presets">${PRESETS.map(h => `<button class="tb-preset${h === 24 ? ' sel' : ''}" data-h="${h}" type="button">${h}h</button>`).join('')}</div>
          </div>
          <div class="tb-field">
            <label>✉️ PS NOTE (optional)</label>
            <textarea id="tb-c-note" rows="2" maxlength="140" placeholder="e.g. DM me, or ping me in #trades. WTS only, no splits."></textarea>
            <div class="tb-counter"><span id="tb-c-note-n">0</span>/140</div>
          </div>
          <div class="tb-modal-err" id="tb-c-err"></div>
          <div class="tb-modal-actions">
            <button class="tb-ghost" id="tb-cancel" type="button">CANCEL</button>
            <button class="tb-primary" id="tb-publish" type="button">PUBLISH AD</button>
          </div>
        </div>`;
      panel.appendChild(modal);

      let hours = 24;
      const offerIn = modal.querySelector('#tb-c-offer');
      const seekIn = modal.querySelector('#tb-c-seek');
      const noteIn = modal.querySelector('#tb-c-note');
      const err = modal.querySelector('#tb-c-err');

      const parsePreview = async (input, target) => {
        const t = input.value.trim();
        const box = modal.querySelector(target);
        if (!t) { box.innerHTML = ''; return; }
        try {
          const res = await fetch('/api/parse', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: t }) });
          const d = await res.json();
          if (!d.items || !d.items.length) { box.innerHTML = ''; return; }
          box.innerHTML = d.items.map(i => `<span class="tb-chip${i.ok ? '' : ' bad'}">${esc(i.name)}</span>`).join('')
            + (d.anyOk ? `<span class="tb-val-badge" style="margin-left:0;">${KEY_ICON}≈ ${fmtInt(d.totalKeys)} Keys</span>` : '');
        } catch { /* preview is best-effort */ }
      };
      let t1, t2;
      offerIn.addEventListener('input', () => { clearTimeout(t1); t1 = setTimeout(() => parsePreview(offerIn, '#tb-c-offer-prev'), 400); });
      seekIn.addEventListener('input', () => { clearTimeout(t2); t2 = setTimeout(() => parsePreview(seekIn, '#tb-c-seek-prev'), 400); });
      noteIn.addEventListener('input', () => { modal.querySelector('#tb-c-note-n').textContent = String(noteIn.value.length); });

      modal.querySelectorAll('.tb-preset').forEach(p => p.addEventListener('click', () => {
        modal.querySelectorAll('.tb-preset').forEach(x => x.classList.remove('sel'));
        p.classList.add('sel'); hours = Number(p.dataset.h);
      }));

      modal.querySelector('#tb-cancel').addEventListener('click', () => modal.remove());
      modal.querySelector('#tb-publish').addEventListener('click', async () => {
        err.textContent = '';
        const offering = offerIn.value.trim(), seeking = seekIn.value.trim();
        if (!offering || !seeking) { err.textContent = 'Offering and seeking are both required.'; return; }
        const pub = modal.querySelector('#tb-publish');
        pub.disabled = true; pub.textContent = '…';
        try {
          const res = await authedFetch('/api/trade', {
            method: 'POST',
            body: JSON.stringify({ offering, seeking, note: noteIn.value.trim(), hours })
          });
          const d = await res.json();
          if (!res.ok) throw new Error(d.error || 'publish_failed');
          modal.remove();
          _tab = 'open'; syncTabs();
          load();
        } catch (e) {
          err.textContent = String(e.message);
          pub.disabled = false; pub.textContent = 'PUBLISH AD';
        }
      });
    };

    postBtn.addEventListener('click', () => {
      if (!_user) openLoginModal(() => openComposer());
      else openComposer();
    });

    const syncTabs = () => {
      document.getElementById('tb-tab-open').classList.toggle('active', _tab === 'open');
      document.getElementById('tb-tab-mine').classList.toggle('active', _tab === 'mine');
      filtersRow.style.display = _tab === 'open' ? 'flex' : 'none';
    };
    document.getElementById('tb-tab-open').addEventListener('click', () => { _tab = 'open'; syncTabs(); load(); });
    document.getElementById('tb-tab-mine').addEventListener('click', () => { _tab = 'mine'; syncTabs(); load(); });
    refreshBtn.addEventListener('click', () => load());
    let qT; qInput.addEventListener('input', () => { clearTimeout(qT); qT = setTimeout(() => load(), 350); });
    sortSel.addEventListener('change', () => load());

    document.getElementById('tb-back').addEventListener('click', async () => {
      window.silkAudio.playClick();
      if (_ticker) clearInterval(_ticker);
      layer.style.opacity = '0'; layer.style.pointerEvents = 'none';
      setTimeout(async () => {
        layer.remove();
        const { MenuPage } = await import('./menu.js');
        const viewport = document.getElementById('app-viewport');
        viewport.innerHTML = MenuPage.render();
        MenuPage.init();
      }, 500);
    });

    renderIdChip();
    syncTabs();
    load();
  }
};

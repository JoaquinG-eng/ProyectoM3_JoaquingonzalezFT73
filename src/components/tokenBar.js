import {
  getMsUntilReset,
  formatTimeRemaining,
  getUsedTokens,
  MAX_TOKENS,
} from "../utils/tokenLimit.js";

export function renderTokenBar() {
  return `
    <div class="token-bar" id="token-bar">
      <div class="token-bar-inner">
        <div class="token-bar-info">
          <span class="token-bar-label">Tokens usados hoy</span>
          <span class="token-bar-numbers">
            <span id="token-used">0</span>
            <span class="token-bar-sep">/</span>
            <span>${MAX_TOKENS.toLocaleString()}</span>
          </span>
        </div>
        <div class="token-bar-track">
          <div class="token-bar-fill" id="token-bar-fill"></div>
        </div>
        <div class="token-bar-footer">
          <span class="token-bar-remaining" id="token-remaining"></span>
          <span class="token-bar-reset" id="token-bar-reset"></span>
        </div>
      </div>
    </div>
  `;
}

let _barInterval = null;

function update() {
  const used      = getUsedTokens();
  const remaining = Math.max(0, MAX_TOKENS - used);
  const pct       = Math.min(100, (used / MAX_TOKENS) * 100);
  const ms        = getMsUntilReset();

  const usedEl      = document.getElementById("token-used");
  const fillEl      = document.getElementById("token-bar-fill");
  const remainingEl = document.getElementById("token-remaining");
  const resetEl     = document.getElementById("token-bar-reset");

  if (!usedEl) { clearInterval(_barInterval); return; }

  usedEl.textContent      = used.toLocaleString();
  remainingEl.textContent = `${remaining.toLocaleString()} restantes`;
  fillEl.style.width      = `${pct}%`;

  fillEl.className = "token-bar-fill";
  if (pct >= 90)      fillEl.classList.add("danger");
  else if (pct >= 60) fillEl.classList.add("warning");

  resetEl.textContent = ms > 0
    ? `Reset en ${formatTimeRemaining(ms)}`
    : "¡Podés chatear!";
}

export function initTokenBar() {
  const bar = document.getElementById("token-bar");
  if (!bar) return;

  if (_barInterval) {
    clearInterval(_barInterval);
    _barInterval = null;
  }

  update();
  _barInterval = setInterval(update, 1000);
}

export function refreshTokenBar() {
  update();
}
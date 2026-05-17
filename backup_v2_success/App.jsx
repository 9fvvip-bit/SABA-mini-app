import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";
import {
  Trophy,
  Wallet,
  Ticket,
  Gift,
  Users,
  Search,
  Bitcoin,
  Zap,
  History,
  Send,
  Copy,
  UploadCloud,
  CheckCircle2,
  Clock3,
  ShieldCheck,
  Download,
  ArrowRight,
  Medal,
  Coins,
  Flame,
  X,
} from "lucide-react";
import "./index.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const DEPOSIT_ADDRESS = "TVk3UDQnBrT8vgUbR3dy9Eb1ogBwvNx4G";

function formatCompactUSDT(value) {
  const n = Number(value || 0);
  if (n >= 1000000) return `${(n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K`;
  return n.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

function fmt(value, digits = 2) {
  const n = Number(value || 0);
  return n.toLocaleString(undefined, { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

const teamMeta = {
  France: { code: "FR", flag: "https://flagcdn.com/w80/fr.png", rate: "1.50", hotRank: 1 },
  Spain: { code: "ES", flag: "https://flagcdn.com/w80/es.png", rate: "1.60", hotRank: 2 },
  England: { code: "EN", flag: "https://flagcdn.com/w80/gb-eng.png", rate: "1.70", hotRank: 3 },
  Brazil: { code: "BR", flag: "https://flagcdn.com/w80/br.png", rate: "1.80", hotRank: 4 },
  Argentina: { code: "AR", flag: "https://flagcdn.com/w80/ar.png", rate: "1.90", hotRank: 5 },
  Portugal: { code: "PT", flag: "https://flagcdn.com/w80/pt.png", rate: "2.10", hotRank: 6 },
  Germany: { code: "DE", flag: "https://flagcdn.com/w80/de.png", rate: "2.30", hotRank: 7 },
  Netherlands: { code: "NL", flag: "https://flagcdn.com/w80/nl.png", rate: "2.50", hotRank: 8 },
  Japan: { code: "JP", flag: "https://flagcdn.com/w80/jp.png", rate: "2.80", hotRank: 9 },
  Belgium: { code: "BE", flag: "https://flagcdn.com/w80/be.png", rate: "3.00", hotRank: 10 },

  Norway: { code: "NO", flag: "https://flagcdn.com/w80/no.png", rate: "3.20" },
  Colombia: { code: "CO", flag: "https://flagcdn.com/w80/co.png", rate: "3.40" },
  USA: { code: "US", flag: "https://flagcdn.com/w80/us.png", rate: "3.60" },
  Morocco: { code: "MA", flag: "https://flagcdn.com/w80/ma.png", rate: "3.80" },
  Switzerland: { code: "CH", flag: "https://flagcdn.com/w80/ch.png", rate: "4.00" },
  Uruguay: { code: "UY", flag: "https://flagcdn.com/w80/uy.png", rate: "4.20" },
  Mexico: { code: "MX", flag: "https://flagcdn.com/w80/mx.png", rate: "4.40" },
  Croatia: { code: "HR", flag: "https://flagcdn.com/w80/hr.png", rate: "4.60" },
  Ecuador: { code: "EC", flag: "https://flagcdn.com/w80/ec.png", rate: "4.80" },
  Senegal: { code: "SN", flag: "https://flagcdn.com/w80/sn.png", rate: "5.00" },
  Turkiye: { code: "TR", flag: "https://flagcdn.com/w80/tr.png", rate: "5.20" },
  Canada: { code: "CA", flag: "https://flagcdn.com/w80/ca.png", rate: "5.40" },
  Austria: { code: "AT", flag: "https://flagcdn.com/w80/at.png", rate: "5.60" },
  Sweden: { code: "SE", flag: "https://flagcdn.com/w80/se.png", rate: "5.80" },
  "South Korea": { code: "KR", flag: "https://flagcdn.com/w80/kr.png", rate: "6.00" },
  Algeria: { code: "DZ", flag: "https://flagcdn.com/w80/dz.png", rate: "6.10" },
  Paraguay: { code: "PY", flag: "https://flagcdn.com/w80/py.png", rate: "6.20" },
  Scotland: { code: "SC", flag: "https://flagcdn.com/w80/gb-sct.png", rate: "6.30" },
  "Ivory Coast": { code: "CI", flag: "https://flagcdn.com/w80/ci.png", rate: "6.40" },
  Czechia: { code: "CZ", flag: "https://flagcdn.com/w80/cz.png", rate: "6.50" },
  Egypt: { code: "EG", flag: "https://flagcdn.com/w80/eg.png", rate: "6.60" },
  Ghana: { code: "GH", flag: "https://flagcdn.com/w80/gh.png", rate: "6.70" },
  "Bosnia-Herzegovina": { code: "BA", flag: "https://flagcdn.com/w80/ba.png", rate: "6.80" },
  Tunisia: { code: "TN", flag: "https://flagcdn.com/w80/tn.png", rate: "6.90" },
  Australia: { code: "AU", flag: "https://flagcdn.com/w80/au.png", rate: "7.00" },
  "New Zealand": { code: "NZ", flag: "https://flagcdn.com/w80/nz.png", rate: "7.00" },
  Haiti: { code: "HT", flag: "https://flagcdn.com/w80/ht.png", rate: "7.00" },
  Jordan: { code: "JO", flag: "https://flagcdn.com/w80/jo.png", rate: "7.00" },
  Curaçao: { code: "CW", flag: "https://flagcdn.com/w80/cw.png", rate: "7.00" },
  Iran: { code: "IR", flag: "https://flagcdn.com/w80/ir.png", rate: "7.00" },
  Uzbekistan: { code: "UZ", flag: "https://flagcdn.com/w80/uz.png", rate: "7.00" },
  Panama: { code: "PA", flag: "https://flagcdn.com/w80/pa.png", rate: "7.00" },
  Iraq: { code: "IQ", flag: "https://flagcdn.com/w80/iq.png", rate: "7.00" },
  "South Africa": { code: "ZA", flag: "https://flagcdn.com/w80/za.png", rate: "7.00" },
  "Congo DR": { code: "CD", flag: "https://flagcdn.com/w80/cd.png", rate: "7.00" },
  "Cape Verde": { code: "CV", flag: "https://flagcdn.com/w80/cv.png", rate: "7.00" },
  Qatar: { code: "QA", flag: "https://flagcdn.com/w80/qa.png", rate: "7.00" },
  "Saudi Arabia": { code: "SA", flag: "https://flagcdn.com/w80/sa.png", rate: "7.00" },
};

const HOT_TEAM_ORDER = [
  "France",
  "Spain",
  "England",
  "Brazil",
  "Argentina",
  "Portugal",
  "Germany",
  "Netherlands",
  "Japan",
  "Belgium",
];

const allTeamNames = [
  ...HOT_TEAM_ORDER,
  "Norway",
  "Colombia",
  "USA",
  "Morocco",
  "Switzerland",
  "Uruguay",
  "Mexico",
  "Croatia",
  "Ecuador",
  "Senegal",
  "Turkiye",
  "Canada",
  "Austria",
  "Sweden",
  "South Korea",
  "Algeria",
  "Paraguay",
  "Scotland",
  "Ivory Coast",
  "Czechia",
  "Egypt",
  "Ghana",
  "Bosnia-Herzegovina",
  "Tunisia",
  "Australia",
  "New Zealand",
  "Haiti",
  "Jordan",
  "Curaçao",
  "Iran",
  "Uzbekistan",
  "Panama",
  "Iraq",
  "South Africa",
  "Congo DR",
  "Cape Verde",
  "Qatar",
  "Saudi Arabia",
];

const fallbackTeams = allTeamNames.map((name) => ({
  name,
  total_ticket: 0,
  total_share: "0.00",
  share_rate: teamMeta[name]?.rate || "7.00",
  is_open: true,
}));

const hotRankMap = Object.fromEntries(HOT_TEAM_ORDER.map((name, index) => [name, index + 1]));


function useTelegramUser() {
  const [tgUser, setTgUser] = useState({ id: 7336278327, username: "aceXXX", first_name: "Demo User" });
  const [initData, setInitData] = useState("");

  useEffect(() => {
    const load = () => {
      const tg = window.Telegram?.WebApp;
      if (!tg) return false;
      tg.ready();
      tg.expand();
      setInitData(tg.initData || "");
      const user = tg.initDataUnsafe?.user;
      if (user) {
        setTgUser(user);
        return true;
      }
      return false;
    };
    if (load()) return;
    const timer = setInterval(() => {
      if (load()) clearInterval(timer);
    }, 300);
    return () => clearInterval(timer);
  }, []);

  return { tgUser, initData };
}

function authUrl(path, tgUser, initData) {
  const url = new URL(`${API_BASE}${path}`);
  if (!initData && tgUser?.id) url.searchParams.set("telegram_id", tgUser.id);
  return url.toString();
}

async function api(path, { method = "GET", body, tgUser, initData } = {}) {
  const headers = { "ngrok-skip-browser-warning": "true" };
  if (initData) headers["X-Telegram-Init-Data"] = initData;
  if (body) headers["Content-Type"] = "application/json";

  const res = await fetch(authUrl(path, tgUser, initData), {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { detail: text };
  }
  if (!res.ok) throw new Error(typeof data.detail === "string" ? data.detail : JSON.stringify(data.detail));
  return data;
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function AppHeader({ user }) {
  return (
    <div className="brand-hero">
      <div className="brand-bg-ball" />
      <img src="/saba-sports-logo.png" className="brand-logo" alt="SABA SPORTS" />
      <div className="brand-user-pill">{user?.username ? `@${user.username}` : user?.first_name || "Player"}</div>
      <div className="brand-subtitle">World Cup Pool · Be Part of the Game</div>
    </div>
  );
}

function UserInfoCard({ user }) {
  return (
    <div className="user-info-card dark-user-card">
      <div>
        <span>Telegram User</span>
        <b>{user?.first_name || "Demo User"}</b>
      </div>
      <div>
        <span>Username</span>
        <b>{user?.username ? `@${user.username}` : "-"}</b>
      </div>
      <div>
        <span>Telegram ID</span>
        <b>{user?.id || "Demo"}</b>
      </div>
    </div>
  );
}

function HeroCard({ prizePool, festival, onDeposit }) {
  const basePool = formatCompactUSDT(prizePool?.champion_base_pool || 500000);
  const liveBet = formatCompactUSDT(prizePool?.live_team_bet || 0);
  const drawShare = festival?.btc_draw_share ?? 0;
  const extraShare = festival?.extra_share_boost || "0%";

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="hero-card premium-hero-card">
      <div className="hero-kicker">
        <Trophy size={18} /> Saba World Cup Pool Prize
      </div>

      <div className="pool-combo">
        <div className="pool-base">
          <span>Base Pool</span>
          <b>{basePool}</b>
        </div>
        <div className="pool-plus">+</div>
        <div className="pool-live">
          <span>Live Team Bet Pool</span>
          <b>{liveBet}</b>
        </div>
      </div>

      <div className="hero-sub">
        <Bitcoin size={26} /> + 3 BTC Lucky Draw
      </div>

      <div className="total-prize-panel">
        <div className="total-prize-title">Total Prize Formula</div>
        <div className="formula-line">
          <span>Base Pool 500K × Share</span>
          <b>+</b>
          <span>Live Team Bet Pool × Share</span>
          <b>+</b>
          <span>BTC Draw</span>
        </div>
      </div>

      <div className="hero-stats total-prize-stats">
        <div className="hero-stat">
          <span>Your Pool Share</span>
          <b>{meSafePercent(drawShare)}%</b>
        </div>
        <div className="hero-stat">
          <span>Draw Share</span>
          <b>{drawShare}</b>
        </div>
        <div className="hero-stat">
          <span>Extra Share</span>
          <b>{extraShare}</b>
        </div>
      </div>

      <button className="red-button hero-cta" onClick={onDeposit}>
        Deposit Now
      </button>
    </motion.div>
  );
}

function meSafePercent(drawShare) {
  const n = Number(drawShare || 0);
  if (!n) return "0";
  return Math.min(100, Math.max(0, n)).toFixed(0);
}

function BalanceCard({ me }) {
  return (
    <div className="balance-grid">
      <div className="info-card premium-info-card">
        <div className="info-label">
          <Wallet size={16} /> Balance
        </div>
        <div className="info-value">{me?.balance || "0.00"}</div>
        <div className="info-small">USDT Available</div>
      </div>
      <div className="info-card premium-info-card">
        <div className="info-label">
          <Ticket size={16} /> My Share
        </div>
        <div className="info-value">{me?.total_share || "0.00"}</div>
        <div className="info-small">{me?.total_ticket || 0} Tickets</div>
      </div>
    </div>
  );
}

function TeamRow({ team, onBet, rank }) {
  const meta = teamMeta[team.name] || {};
  const isHot = Boolean(meta.hotRank);
  const code = meta.code || countryCodeMap?.[team.name] || team.name.slice(0, 2).toUpperCase();
  const flagSrc = meta.flag;
  const shareRate = meta.rate || team.share_rate || "7.00";

  return (
    <div className={`team-row premium-team-card ${isHot ? "hot-team-card" : ""}`}>
      <div className="team-rank">{rank}</div>

      <div className="team-left premium-team-left">
        <div className="flag-box">
          {flagSrc ? (
            <img src={flagSrc} className="flag-img" alt={`${team.name} flag`} />
          ) : (
            <span className="flag-emoji">🏳️</span>
          )}
        </div>

        <div className="team-code-box">
          <span className="team-code">{code}</span>
        </div>

        <div className="team-info">
          <div className="team-name-line">
            <span className="team-name">{team.name}</span>
            {isHot && <span className="hot-badge" aria-label="Hot team">🔥</span>}
          </div>

          <div className="team-odds">
            Ticket {team.total_ticket || 0} / Share {team.total_share || "0.00"}
          </div>
        </div>
      </div>

      <div className="team-right premium-team-right">
        <div className="share-box premium-share-box">
          <b>Share {Number(shareRate).toFixed(2)}x</b>
        </div>

        <button
          onClick={() => onBet({ ...team, share_rate: shareRate })}
          disabled={!team.is_open}
          className="blue-button premium-bet-button"
        >
          {team.is_open ? "Bet" : "Closed"}
        </button>
      </div>
    </div>
  );
}

function PoolPage({ onBet, setTab, me, teams, prizePool, festival, loading, error }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const apiMap = new Map((teams || []).map((t) => [t.name, t]));
    const merged = allTeamNames.map((name) => ({
      ...(apiMap.get(name) || {}),
      name,
      is_open: apiMap.get(name)?.is_open ?? true,
      share_rate: teamMeta[name]?.rate || apiMap.get(name)?.share_rate || "7.00",
      total_ticket: apiMap.get(name)?.total_ticket || 0,
      total_share: apiMap.get(name)?.total_share || "0.00",
    }));

    return merged
      .sort((a, b) => {
        const aRank = hotRankMap[a.name] || 999;
        const bRank = hotRankMap[b.name] || 999;
        if (aRank !== bRank) return aRank - bRank;
        return allTeamNames.indexOf(a.name) - allTeamNames.indexOf(b.name);
      })
      .filter((t) => t.name.toLowerCase().includes(query.toLowerCase()));
  }, [query, teams]);
  return (
    <div className="page">
      <HeroCard prizePool={prizePool} festival={festival} onDeposit={() => setTab("deposit")} />
      <BalanceCard me={me} />
      {loading && <div className="notice-card">Loading real data...</div>}
      {error && <div className="error-card">API Error: {error}</div>}
      <div className="search-box premium-search">
        <Search size={18} />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search team" />
      </div>
      <div className="section-title">
        <b>Champion Market</b>
        <span>Early Bet = More Share</span>
      </div>
      <div className="team-list">{filtered.map((team, index) => <TeamRow key={team.name} team={team} rank={index + 1} onBet={onBet} />)}</div>
    </div>
  );
}

function DepositPage({ festival, deposits, withdraws, myBets, walletHistory, createDeposit, submitReceipt, btcDraw }) {
  const [amount, setAmount] = useState("50");
  const [currentOrder, setCurrentOrder] = useState(null);
  const [receiptFile, setReceiptFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [historyTab, setHistoryTab] = useState("deposit");

  const selectedAddress = currentOrder?.address || DEPOSIT_ADDRESS;
  const bonusTarget = 100;
  const confirmed = Number(festival?.total_deposit || 0);
  const cycleProgress = Math.min(bonusTarget, confirmed % bonusTarget || (confirmed >= bonusTarget ? bonusTarget : confirmed));
  const progressPercent = Math.min(100, Math.round((cycleProgress / bonusTarget) * 100));
  const needMore = Math.max(0, bonusTarget - cycleProgress);

  async function handleCreateDeposit() {
    const res = await createDeposit(amount);
    if (res) {
      setCurrentOrder(res);
      setReceiptFile(null);
    }
  }

  async function handleReceiptUpload() {
    if (!currentOrder?.order_no) {
      alert("Please create a deposit order first.");
      return;
    }
    if (!receiptFile) {
      alert("Please choose a payment screenshot first.");
      return;
    }
    setUploading(true);
    try {
      await submitReceipt(currentOrder.order_no, receiptFile);
      alert("Screenshot uploaded. Please wait for admin confirmation.");
      setReceiptFile(null);
    } finally {
      setUploading(false);
    }
  }

  function historyItems() {
    if (historyTab === "deposit") {
      return (deposits || []).map((d) => ({
        key: d.order_no,
        title: `Deposit · ${d.network || "USDT-TRC20"}`,
        date: d.created_at,
        amount: `${d.amount_usdt} USDT`,
        status: d.status,
        remark: d.txid || "Receipt pending",
        icon: Download,
      }));
    }
    if (historyTab === "withdraw") {
      return (withdraws || []).map((w) => ({
        key: w.order_no,
        title: `Withdraw · ${w.network || "USDT-TRC20"}`,
        date: w.created_at,
        amount: `${w.amount_usdt} USDT`,
        status: w.status,
        remark: w.address || "",
        icon: Wallet,
      }));
    }
    if (historyTab === "bet") {
      return (myBets || []).map((b) => ({
        key: b.id,
        title: `Bet · ${b.team}`,
        date: b.created_at,
        amount: `${b.amount} USDT`,
        status: b.status,
        remark: `${b.tickets} tickets / ${b.shares} shares`,
        icon: Ticket,
      }));
    }
    return (walletHistory || [])
      .filter((x) => String(x.tx_type || "").includes("win") || String(x.tx_type || "").includes("settle"))
      .map((x, i) => ({
        key: i,
        title: x.tx_type || "Win",
        date: x.created_at,
        amount: `${x.amount_usdt} USDT`,
        status: "completed",
        remark: x.remark || "",
        icon: Medal,
      }));
  }

  const rows = historyItems();

  return (
    <div className="page premium-deposit-page">
      <div className="premium-panel deposit-main-panel">
        <div className="panel-title premium-title">
          <span className="token-icon">₮</span> Deposit USDT
        </div>

        <div className="field-label">Select amount</div>
        <div className="amount-grid premium-amount-grid">
          {[20, 50, 100, 300, 500, 1000].map((v) => (
            <button key={v} onClick={() => setAmount(String(v))} className={String(v) === String(amount) ? "selected" : ""}>
              {v}
              {String(v) === String(amount) && <CheckCircle2 size={16} />}
            </button>
          ))}
        </div>

        <label className="field-label">Custom amount (USDT)</label>
        <div className="amount-input-shell">
          <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount USDT" />
          <span>USDT</span>
        </div>

        <button className="red-button wide-red-button" onClick={handleCreateDeposit}>Create Deposit Order</button>
      </div>

      <div className="premium-panel pay-panel">
        <div className="pay-left">
          <div className="pay-label">
            Send USDT (TRC20) to this address <span className="network-pill">TRC20</span>
          </div>

          {currentOrder?.order_no && (
            <div className="order-mini-card">
              <span>Order</span>
              <b>{currentOrder.order_no}</b>
              <em>{currentOrder.amount} USDT · Pending</em>
            </div>
          )}

          <div className="address-line">
            <b>{selectedAddress}</b>
            <button onClick={() => navigator.clipboard?.writeText(selectedAddress)}>
              <Copy size={16} />
            </button>
          </div>

          <div className="pay-chips">
            <div><span className="token-icon small">₮</span><small>Network</small><b>TRC20</b></div>
            <div><Clock3 size={18} /><small>Min. Deposit</small><b>20 USDT</b></div>
            <div><ShieldCheck size={18} /><small>Confirmations</small><b>1–2 min</b></div>
          </div>

          <p className="help-line">Send the exact amount, then upload payment screenshot for admin review.</p>
        </div>

        <div className="qr-card">
          <QRCodeCanvas value={selectedAddress} size={150} includeMargin />
        </div>
      </div>

      <div className="premium-panel upload-panel">
        <div className="upload-info">
          <div className="upload-icon"><UploadCloud size={24} /></div>
          <div>
            <h3>Upload Payment Screenshot</h3>
            <p>After sending, upload your payment screenshot for admin verification.</p>
            <span className="pending-pill">Pending Admin Confirmation</span>
          </div>
        </div>

        <label className="upload-drop">
          <UploadCloud size={34} />
          <b>{receiptFile ? receiptFile.name : "Upload Screenshot"}</b>
          <span>JPG, PNG up to 5MB</span>
          <input type="file" accept="image/png,image/jpeg,image/jpg" onChange={(e) => setReceiptFile(e.target.files?.[0] || null)} />
        </label>

        <button className="red-button upload-submit" onClick={handleReceiptUpload} disabled={uploading}>
          {uploading ? "Uploading..." : "Submit Screenshot"}
        </button>
      </div>

      <div className="premium-panel history-panel">
        <div className="history-head">
          <div className="panel-title premium-title"><History size={20} /> Wallet History</div>
          <button className="link-button">View All <ArrowRight size={16} /></button>
        </div>

        <div className="history-tabs">
          {[
            ["deposit", "Deposit History"],
            ["withdraw", "Withdraw History"],
            ["bet", "Bet History"],
            ["win", "Win History"],
          ].map(([key, label]) => (
            <button key={key} className={historyTab === key ? "active" : ""} onClick={() => setHistoryTab(key)}>
              {label}
            </button>
          ))}
        </div>

        <div className="history-list">
          {rows.length === 0 && <div className="notice-card dark-notice">No records yet.</div>}
          {rows.slice(0, 6).map((r) => {
            const Icon = r.icon;
            const okStatus = ["confirmed", "completed", "active"].includes(String(r.status).toLowerCase());
            return (
              <div className="history-row" key={r.key}>
                <div className="history-icon"><Icon size={18} /></div>
                <div className="history-info">
                  <b>{r.title}</b>
                  <span>{r.date || "—"}</span>
                  <small>{r.remark}</small>
                </div>
                <div className="history-amount">
                  <b>{r.amount}</b>
                  <span className={okStatus ? "status-ok" : "status-pending"}>{r.status}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="promo-panel">
        <div className="promo-left">
          <div className="gift-orb"><Gift size={28} /></div>
          <div>
            <span className="promo-kicker">Rewards / Promotion</span>
            <h3>Deposit 100 USDT, Get <strong>20 USDT</strong> Bonus</h3>
          </div>
        </div>

        <div className="promo-progress-row">
          <span>{Math.round(cycleProgress)}/100 Progress</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="promo-progress">
          <div style={{ width: `${progressPercent}%` }} />
        </div>
        <p>Deposit <strong>{fmt(needMore, 0)} USDT</strong> more to unlock <strong>20 USDT</strong> reward.</p>
      </div>
    </div>
  );
}

function MyBetsPage({ bets }) {
  return (
    <div className="page">
      <div className="premium-panel">
        <div className="panel-title premium-title"><Ticket size={20} /> My Tickets</div>
        {(bets || []).length === 0 && <div className="notice-card dark-notice">No bets yet.</div>}
        {(bets || []).map((b) => (
          <div key={b.id} className="bet-card premium-bet-card">
            <div className="bet-head">
              <b>{b.flag} {b.team}</b>
              <span>{b.status}</span>
            </div>
            <div className="bet-grid">
              <div><small>Ticket</small><b>{b.tickets}</b></div>
              <div><small>Share</small><b>{b.shares}</b></div>
              <div><small>Bet</small><b>{b.amount}</b></div>
              <div><small>Est.</small><b>{b.estimated_win}</b></div>
            </div>
            <small>{b.created_at}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

function RewardsPage({ festival, referral, walletHistory, withdraws, missions, claimDepositMission, claimBetMission, claimDailyLogin, createWithdraw }) {
  const [amount, setAmount] = useState("20");
  const [address, setAddress] = useState("");
  const copy = (text) => navigator.clipboard?.writeText(text);
  const confirmed = Number(festival?.total_deposit || 0);
  const progress = Math.min(100, Math.round(((confirmed % 100) / 100) * 100 || (confirmed >= 100 ? 100 : 0)));

  return (
    <div className="page">
      <div className="promo-panel rewards-promo">
        <div className="promo-left">
          <div className="gift-orb"><Coins size={28} /></div>
          <div>
            <span className="promo-kicker">Platform Promotion</span>
            <h3>Deposit 100 USDT, Get <strong>20 USDT</strong> Bonus</h3>
          </div>
        </div>
        <div className="promo-progress-row">
          <span>{confirmed % 100 || (confirmed >= 100 ? 100 : confirmed)}/100 Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="promo-progress"><div style={{ width: `${progress}%` }} /></div>
      </div>


      <div className="premium-panel">
        <div className="panel-title premium-title"><Gift size={20} /> Mission Center</div>

        <div className="mission-lock">Locked turnover before withdraw: <b>{missions?.locked_turnover_remaining || "0.00"} USDT</b></div>

        <h3 className="mission-heading">Deposit Mission</h3>
        {(missions?.deposit_missions || []).map((m) => {
          const pct = Math.min(100, Math.round(Number(m.progress) / Number(m.target) * 100));
          return (
            <div className="mission-card" key={`dep-${m.milestone}`}>
              <div className="mission-top"><b>Deposit {Number(m.target).toFixed(0)} USDT</b><span>+{m.reward_usdt} USDT</span></div>
              <div className="mission-progress"><div style={{width: `${pct}%`}} /></div>
              <p>{m.progress}/{m.target} · Need {m.remaining} USDT more · 1x turnover required</p>
              <button disabled={!m.claimable} onClick={() => claimDepositMission(m.milestone)} className="red-button mission-btn">{m.claimed ? "Claimed" : m.claimable ? "Claim Bonus" : "Not Ready"}</button>
            </div>
          );
        })}

        <h3 className="mission-heading">Bet Mission</h3>
        {(missions?.bet_missions || []).map((m) => {
          const pct = Math.min(100, Math.round(Number(m.progress) / Number(m.target) * 100));
          return (
            <div className="mission-card" key={`bet-${m.milestone}`}>
              <div className="mission-top"><b>Bet {Number(m.target).toFixed(0)} USDT</b><span>+{m.reward_btc_share} BTC Share</span></div>
              <div className="mission-progress"><div style={{width: `${pct}%`}} /></div>
              <p>{m.progress}/{m.target} · Need {m.remaining} USDT more</p>
              <button disabled={!m.claimable} onClick={() => claimBetMission(m.milestone)} className="blue-button mission-btn">{m.claimed ? "Claimed" : m.claimable ? "Claim BTC Share" : "Not Ready"}</button>
            </div>
          );
        })}

        <h3 className="mission-heading">Invite Mission</h3>
        <div className="mission-card">
          <div className="mission-top"><b>Invite player deposit 100 USDT</b><span>+10 USDT + 5%</span></div>
          <p>Valid invites: {missions?.invite_mission?.valid_invites || 0}. Reward includes 10 USDT and 5% player winner pool share reward.</p>
        </div>

        <h3 className="mission-heading">Daily Login Mission</h3>
        <div className="mission-card">
          <div className="mission-top"><b>7-Day Login</b><span>Total 5 USDT</span></div>
          <p>Next Day {missions?.daily_login?.next_day || 1}: +{missions?.daily_login?.next_reward_usdt || "0.30"} USDT {Number(missions?.daily_login?.next_reward_btc_share || 0) > 0 ? `+ ${missions.daily_login.next_reward_btc_share} BTC Share` : ""}</p>
          <button disabled={missions?.daily_login?.claimed_today} onClick={claimDailyLogin} className="red-button mission-btn">{missions?.daily_login?.claimed_today ? "Claimed Today" : "Claim Daily Login"}</button>
        </div>
      </div>


      <div className="premium-panel">
        <div className="panel-title premium-title"><Gift size={20} /> Rewards Center</div>
        <div className="reward-card amber"><b><Zap size={18} /> First Deposit Pack</b><p>{festival?.first_deposit_pack || "Not claimed"}</p></div>
        <div className="reward-card blue"><b><Users size={18} /> Referral Partner</b><p>Invited: {referral?.invited_count || 0} / Rewards: {referral?.total_rewards || "0.00"} USDT</p></div>
        <button className="red-button wide-red-button" onClick={() => copy(referral?.invite_link || "")}><Copy size={16} /> Copy Invite Link</button>
        <div className="gray-box dark-gray"><span>Invite Link</span><b className="tiny">{referral?.invite_link || "-"}</b></div>
      </div>

      <div className="premium-panel">
        <div className="panel-title premium-title"><Wallet size={20} /> Withdraw</div>
        <input className="dark-input" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount USDT" />
        <input className="dark-input" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="USDT-TRC20 address" />
        <button className="red-button wide-red-button" onClick={() => createWithdraw(amount, address)}>Create Withdraw</button>
        {(withdraws || []).map((w) => <div className="record-card dark-record" key={w.order_no}><b>{w.order_no}</b><span>{w.amount_usdt} USDT</span><small>{w.status}</small></div>)}
      </div>

      <div className="premium-panel">
        <div className="panel-title premium-title"><History size={20} /> Wallet History</div>
        {(walletHistory || []).length === 0 && <div className="notice-card dark-notice">No wallet records.</div>}
        {(walletHistory || []).map((x, i) => <div className="record-card dark-record" key={i}><b>{x.tx_type}</b><span>{x.amount_usdt} USDT</span><small>{x.balance_before} → {x.balance_after}</small><small>{x.remark}</small></div>)}
      </div>
    </div>
  );
}

function BetModal({ team, prizePool, onClose, placeBet }) {
  const [amount, setAmount] = useState("50");
  if (!team) return null;

  const ticket = Math.floor(Number(amount || 0) / 10);
  const rate = Number(team.share_rate || 2);
  const newShare = ticket * rate;
  const currentTeamShare = Number(team.total_share || 0);
  const teamShareAfter = currentTeamShare + newShare;
  const percent = teamShareAfter > 0 ? newShare / teamShareAfter : 0;
  const basePool = Number(prizePool?.champion_base_pool || 500000);
  const livePool = Number(prizePool?.live_team_bet || 0);
  const estBase = basePool * percent;
  const estLive = livePool * percent;
  const estTotal = estBase + estLive;

  return (
    <div className="modal-bg">
      <motion.div initial={{ y: 300 }} animate={{ y: 0 }} className="modal premium-modal">
        <div className="modal-head">
          <div>
            <small>Champion Bet</small>
            <h2>{team.name}</h2>
          </div>
          <button onClick={onClose}><X size={18} /></button>
        </div>
        <div className="amount-grid premium-amount-grid">{[50, 100, 300, 500].map((v) => <button key={v} onClick={() => setAmount(String(v))}>{v} USDT</button>)}</div>
        <input className="dark-input" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount, multiple of 10" />

        <div className="estimate-card">
          <b>Estimated Win</b>
          <div className="estimate-big">{estTotal.toLocaleString(undefined, {maximumFractionDigits: 2})} USDT</div>
          <p>Share: {newShare.toFixed(2)} · Team Share %: {(percent * 100).toFixed(2)}%</p>
          <small>Formula: Base Pool 500K × your team share % + Live Team Bet Pool × your team share % + BTC Draw</small>
        </div>

        <div className="gray-box dark-gray">1 Ticket = 10 USDT. Team Share Rate: {Number(team.share_rate || 2).toFixed(2)}x</div>
        <button className="red-button wide-red-button" onClick={() => placeBet(team, amount)}>Confirm Bet</button>
      </motion.div>
    </div>
  );
}
function BottomNav({ tab, setTab }) {
  const items = [["pool", Trophy, "Pool"], ["deposit", Wallet, "Deposit"], ["bets", Ticket, "My Bets"], ["rewards", Gift, "Rewards"]];
  return (
    <div className="bottom-nav premium-bottom-nav">
      {items.map(([key, Icon, label]) => (
        <button key={key} onClick={() => setTab(key)} className={tab === key ? "active" : ""}>
          <Icon size={22} />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("pool");
  const [betTeam, setBetTeam] = useState(null);
  const { tgUser, initData } = useTelegramUser();
  const [me, setMe] = useState(null);
  const [teams, setTeams] = useState(fallbackTeams);
  const [prizePool, setPrizePool] = useState(null);
  const [myBets, setMyBets] = useState([]);
  const [festival, setFestival] = useState(null);
  const [deposits, setDeposits] = useState([]);
  const [withdraws, setWithdraws] = useState([]);
  const [referral, setReferral] = useState(null);
  const [walletHistory, setWalletHistory] = useState([]);
  const [btcDraw, setBtcDraw] = useState(null);
  const [missions, setMissions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  async function loadData() {
    setLoading(true);
    setApiError("");

    const tasks = [
      ["me", api("/api/me", { tgUser, initData })],
      ["teams", api("/api/teams", { tgUser, initData })],
      ["pool", api("/api/prize_pool", { tgUser, initData })],
      ["bets", api("/api/my_bets", { tgUser, initData })],
      ["festival", api("/api/deposit_festival", { tgUser, initData })],
      ["deposits", api("/api/deposits", { tgUser, initData })],
      ["withdraws", api("/api/withdraws", { tgUser, initData })],
      ["referral", api("/api/referral", { tgUser, initData })],
      ["ledger", api("/api/wallet_history", { tgUser, initData })],
      ["draw", api("/api/btc_draw", { tgUser, initData })],
      ["missions", api("/api/missions", { tgUser, initData })],
    ];

    const results = await Promise.allSettled(tasks.map(([, promise]) => promise));
    const failed = [];

    results.forEach((result, index) => {
      const name = tasks[index][0];

      if (result.status !== "fulfilled") {
        failed.push(`${name}: ${result.reason?.message || "failed"}`);
        return;
      }

      const data = result.value;

      if (name === "me") setMe(data);
      if (name === "teams") setTeams(data.teams || fallbackTeams);
      if (name === "pool") setPrizePool(data);
      if (name === "bets") setMyBets(data.bets || []);
      if (name === "festival") setFestival(data);
      if (name === "deposits") setDeposits(data.items || []);
      if (name === "withdraws") setWithdraws(data.items || []);
      if (name === "referral") setReferral(data);
      if (name === "ledger") setWalletHistory(data.items || []);
      if (name === "draw") setBtcDraw(data);
      if (name === "missions") setMissions(data);
    });

    if (failed.length > 0) {
      setApiError(`Some data failed: ${failed.join(" | ")}`);
      console.warn("SABA API partial load errors:", failed);
    }

    setLoading(false);
  }

  useEffect(() => {
    if (tgUser?.id) loadData();
  }, [tgUser?.id, initData]);

  async function placeBet(team, amount) {
    try {
      const res = await api("/api/place_bet", { method: "POST", body: { team: team.name, amount }, tgUser, initData });
      alert(`Bet success: ${res.tickets} tickets / ${res.shares} shares`);
      setBetTeam(null);
      await loadData();
    } catch (err) {
      alert(err.message);
    }
  }

  async function createDeposit(amount) {
    try {
      const res = await api("/api/deposit/create", { method: "POST", body: { amount }, tgUser, initData });
      await loadData();
      return res;
    } catch (err) {
      alert(err.message);
      return null;
    }
  }

  async function submitReceipt(order_no, file) {
    const image_base64 = await fileToBase64(file);
    await api("/api/deposit/receipt", {
      method: "POST",
      body: {
        order_no,
        filename: file.name,
        image_base64,
      },
      tgUser,
      initData,
    });
    await loadData();
  }

  async function claimDepositMission(milestone) {
    try {
      const res = await api("/api/mission/deposit/claim", { method: "POST", body: { milestone }, tgUser, initData });
      alert(`Deposit mission claimed: ${res.reward_usdt} USDT\nTurnover required: ${res.turnover_required} USDT`);
      await loadData();
    } catch (err) {
      alert(err.message);
    }
  }

  async function claimBetMission(milestone) {
    try {
      const res = await api("/api/mission/bet/claim", { method: "POST", body: { milestone }, tgUser, initData });
      alert(`Bet mission claimed: +${res.reward_btc_share} BTC Draw Share`);
      await loadData();
    } catch (err) {
      alert(err.message);
    }
  }

  async function claimDailyLogin() {
    try {
      const res = await api("/api/daily_login/claim", { method: "POST", tgUser, initData });
      alert(`Daily login day ${res.day}: +${res.reward_usdt} USDT, +${res.reward_btc_share} BTC Share`);
      await loadData();
    } catch (err) {
      alert(err.message);
    }
  }

  async function createWithdraw(amount, address) {
    try {
      const res = await api("/api/withdraw/create", { method: "POST", body: { amount, address }, tgUser, initData });
      alert(`Withdraw created: ${res.order_no}\nReceive: ${res.receive} USDT`);
      await loadData();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="screen-bg premium-screen-bg">
      <div className="phone-shell premium-phone-shell">
        <AppHeader user={tgUser} />
        <UserInfoCard user={tgUser} />
        {tab === "pool" && <PoolPage onBet={setBetTeam} setTab={setTab} me={me} teams={teams} prizePool={prizePool} festival={festival} loading={loading} error={apiError} />}
        {tab === "deposit" && <DepositPage festival={festival} deposits={deposits} withdraws={withdraws} myBets={myBets} walletHistory={walletHistory} createDeposit={createDeposit} submitReceipt={submitReceipt} btcDraw={btcDraw} />}
        {tab === "bets" && <MyBetsPage bets={myBets} />}
        {tab === "rewards" && <RewardsPage festival={festival} referral={referral} walletHistory={walletHistory} withdraws={withdraws} missions={missions} claimDepositMission={claimDepositMission} claimBetMission={claimBetMission} claimDailyLogin={claimDailyLogin} createWithdraw={createWithdraw} />}
        <BottomNav tab={tab} setTab={setTab} />
        <BetModal team={betTeam} prizePool={prizePool} onClose={() => setBetTeam(null)} placeBet={placeBet} />
      </div>
    </div>
  );
}

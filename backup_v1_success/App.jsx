import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Wallet, Ticket, Gift, Users, Search, Bitcoin, Zap, ShieldCheck, History, Send, Copy } from "lucide-react";
import "./index.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

function formatCompactUSDT(value) {
  const n = Number(value || 0);
  if (n >= 1000000) return `${(n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K`;
  return n.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

const fallbackTeams = [
  { name: "France", flag: "🇫🇷", total_ticket: 0, share_rate: "2.00", is_open: true },
  { name: "Spain", flag: "🇪🇸", total_ticket: 0, share_rate: "2.00", is_open: true },
  { name: "England", flag: "🏴", total_ticket: 0, share_rate: "2.00", is_open: true },
  { name: "Argentina", flag: "🇦🇷", total_ticket: 0, share_rate: "2.00", is_open: true },
  { name: "Brazil", flag: "🇧🇷", total_ticket: 0, share_rate: "2.00", is_open: true },
];

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
  const res = await fetch(authUrl(path, tgUser, initData), { method, headers, body: body ? JSON.stringify(body) : undefined });
  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : {}; } catch { data = { detail: text }; }
  if (!res.ok) throw new Error(data.detail || "API error");
  return data;
}

function AppHeader({ user }) {
  return <div className="app-header">
    <div><div className="mini-label">Telegram Mini App</div><div className="app-title">SABA WORLD CUP POOL</div></div>
    <div className="user-pill">{user?.username ? `@${user.username}` : user?.first_name || "Player"}</div>
  </div>;
}

function UserInfoCard({ user }) {
  return <div className="user-info-card">
    <div><span>Telegram User</span><b>{user?.first_name || "Demo User"}</b></div>
    <div><span>Username</span><b>{user?.username ? `@${user.username}` : "-"}</b></div>
    <div><span>Telegram ID</span><b>{user?.id || "Demo"}</b></div>
  </div>;
}

function HeroCard({ prizePool, festival, onDeposit }) {
  const basePool = formatCompactUSDT(prizePool?.champion_base_pool || 500000);
  const liveBet = formatCompactUSDT(prizePool?.live_team_bet || 0);
  return <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="hero-card">
    <div className="hero-kicker"><Trophy size={18} /> World Cup Deposit Festival</div>
    <div className="pool-combo">
      <div className="pool-base"><span>Base Pool</span><b>{basePool}</b></div>
      <div className="pool-plus">+</div>
      <div className="pool-live"><span>Live Team Bets</span><b>{liveBet}</b></div>
    </div>
    <div className="hero-sub">+ {prizePool?.btc_draw_total || "3 BTC"} Lucky Draw</div>
    <div className="hero-stats">
      <div className="hero-stat"><span>1st Prize</span><b>{prizePool?.btc_first_prize || "1 BTC"}</b></div>
      <div className="hero-stat"><span>Draw Share</span><b>{festival?.btc_draw_share ?? 0}</b></div>
      <div className="hero-stat"><span>Extra Share</span><b>{festival?.extra_share_boost || "0%"}</b></div>
    </div>
    <button className="gold-button" onClick={onDeposit}>Deposit Now</button>
  </motion.div>;
}

function BalanceCard({ me }) {
  return <div className="balance-grid">
    <div className="info-card"><div className="info-label"><Wallet size={16} /> Balance</div><div className="info-value">{me?.balance || "0.00"}</div><div className="info-small">USDT Available</div></div>
    <div className="info-card"><div className="info-label"><Ticket size={16} /> My Share</div><div className="info-value">{me?.total_share || "0.00"}</div><div className="info-small">{me?.total_ticket || 0} Tickets</div></div>
  </div>;
}

function TeamRow({ team, onBet }) {
  return <div className="team-row">
    <div className="team-left"><div className="team-flag">{team.flag}</div><div><div className="team-name">{team.name}</div><div className="team-odds">Ticket {team.total_ticket || 0} / Share {team.total_share || "0.00"}</div></div></div>
    <div className="team-right"><div className="share-box"><span>Share</span><b>{team.share_rate || "2.00"}x</b></div><button onClick={() => onBet(team)} disabled={!team.is_open} className="blue-button">{team.is_open ? "Bet" : "Closed"}</button></div>
  </div>;
}

function PoolPage({ onBet, setTab, me, teams, prizePool, festival, loading, error }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => teams.filter((t) => t.name.toLowerCase().includes(query.toLowerCase())), [query, teams]);
  return <div className="page">
    <HeroCard prizePool={prizePool} festival={festival} onDeposit={() => setTab("deposit")} />
    <BalanceCard me={me} />
    {loading && <div className="notice-card">Loading real data...</div>}
    {error && <div className="error-card">API Error: {error}</div>}
    <div className="search-box"><Search size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search team" /></div>
    <div className="section-title"><b>Champion Market</b><span>Early Bet = More Share</span></div>
    <div className="team-list">{filtered.map((team) => <TeamRow key={team.name} team={team} onBet={onBet} />)}</div>
  </div>;
}

function DepositPage({ festival, deposits, createDeposit, submitTxid, btcDraw }) {
  const [amount, setAmount] = useState("50");
  const [txidOrder, setTxidOrder] = useState("");
  const [txid, setTxid] = useState("");
  return <div className="page">
    <div className="white-panel">
      <div className="panel-title"><Wallet size={20} /> Deposit USDT</div>
      <div className="amount-grid">{[20, 50, 100, 300, 500, 1000].map((v) => <button key={v} onClick={() => setAmount(String(v))}>{v}</button>)}</div>
      <input className="input" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount USDT" />
      <button className="wide-blue-button" onClick={() => createDeposit(amount)}>Create Deposit Order</button>
      <div className="gray-box"><span>Total Confirmed</span><b>{festival?.total_deposit || "0.00"} USDT</b></div>
      <div className="gray-box"><span>BTC Draw Share</span><b>{festival?.btc_draw_share ?? 0}</b></div>
      <div className="gray-box"><span>Need For Next Share</span><b>{festival?.next_btc_draw_need || "0.00"} USDT</b></div>
    </div>

    <div className="white-panel">
      <div className="panel-title"><Send size={20} /> Submit TXID</div>
      <input className="input" value={txidOrder} onChange={(e) => setTxidOrder(e.target.value)} placeholder="Order No: DEP000001" />
      <input className="input" value={txid} onChange={(e) => setTxid(e.target.value)} placeholder="TXID" />
      <button className="wide-blue-button" onClick={() => submitTxid(txidOrder, txid)}>Submit TXID</button>
    </div>

    <div className="white-panel">
      <div className="panel-title"><Bitcoin size={20} /> BTC Lucky Draw</div>
      <p className="rule-text">{btcDraw?.total_prize || "3 BTC"} total prize. Every 50 USDT deposit = 1 Draw Share.</p>
      {(btcDraw?.prizes || []).map((p) => <div className="list-row" key={p}>{p}</div>)}
    </div>

    <div className="white-panel">
      <div className="panel-title"><History size={20} /> Deposit Records</div>
      {(deposits || []).length === 0 && <div className="notice-card">No deposits yet.</div>}
      {(deposits || []).map((d) => <div className="record-card" key={d.order_no}>
        <b>{d.order_no}</b><span>{d.amount_usdt} USDT</span><small>{d.status}</small><small>{d.txid || "No TXID"}</small>
      </div>)}
    </div>
  </div>;
}

function MyBetsPage({ bets }) {
  return <div className="page"><div className="white-panel">
    <div className="panel-title"><Ticket size={20} /> My Tickets</div>
    {(bets || []).length === 0 && <div className="notice-card">No bets yet.</div>}
    {(bets || []).map((b) => <div key={b.id} className="bet-card">
      <div className="bet-head"><b>{b.flag} {b.team}</b><span>{b.status}</span></div>
      <div className="bet-grid"><div><small>Ticket</small><b>{b.tickets}</b></div><div><small>Share</small><b>{b.shares}</b></div><div><small>Bet</small><b>{b.amount}</b></div><div><small>Est.</small><b>{b.estimated_win}</b></div></div>
      <small>{b.created_at}</small>
    </div>)}
  </div></div>;
}

function RewardsPage({ festival, referral, walletHistory, withdraws, createWithdraw }) {
  const [amount, setAmount] = useState("20");
  const [address, setAddress] = useState("");
  const copy = (text) => navigator.clipboard?.writeText(text);
  return <div className="page">
    <div className="white-panel">
      <div className="panel-title"><Gift size={20} /> Rewards Center</div>
      <div className="reward-card amber"><b><Zap size={18} /> First Deposit Pack</b><p>{festival?.first_deposit_pack || "Not claimed"}</p></div>
      <div className="reward-card blue"><b><Users size={18} /> Referral Partner</b><p>Invited: {referral?.invited_count || 0} / Rewards: {referral?.total_rewards || "0.00"} USDT</p></div>
      <button className="wide-blue-button" onClick={() => copy(referral?.invite_link || "")}><Copy size={16} /> Copy Invite Link</button>
      <div className="gray-box"><span>Invite Link</span><b className="tiny">{referral?.invite_link || "-"}</b></div>
    </div>

    <div className="white-panel">
      <div className="panel-title"><Wallet size={20} /> Withdraw</div>
      <input className="input" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount USDT" />
      <input className="input" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="USDT-TRC20 address" />
      <button className="wide-blue-button" onClick={() => createWithdraw(amount, address)}>Create Withdraw</button>
      {(withdraws || []).map((w) => <div className="record-card" key={w.order_no}><b>{w.order_no}</b><span>{w.amount_usdt} USDT</span><small>{w.status}</small></div>)}
    </div>

    <div className="white-panel">
      <div className="panel-title"><History size={20} /> Wallet History</div>
      {(walletHistory || []).length === 0 && <div className="notice-card">No wallet records.</div>}
      {(walletHistory || []).map((x, i) => <div className="record-card" key={i}><b>{x.tx_type}</b><span>{x.amount_usdt} USDT</span><small>{x.balance_before} → {x.balance_after}</small><small>{x.remark}</small></div>)}
    </div>
  </div>;
}

function BetModal({ team, onClose, placeBet }) {
  const [amount, setAmount] = useState("50");
  if (!team) return null;
  return <div className="modal-bg">
    <motion.div initial={{ y: 300 }} animate={{ y: 0 }} className="modal">
      <div className="modal-head"><div><small>Champion Bet</small><h2>{team.flag} {team.name}</h2></div><button onClick={onClose}>Close</button></div>
      <div className="amount-grid">{[50, 100, 300, 500].map((v) => <button key={v} onClick={() => setAmount(String(v))}>{v} USDT</button>)}</div>
      <input className="input" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount, multiple of 10" />
      <div className="gray-box">1 Ticket = 10 USDT. Current Share Rate: {team.share_rate}x</div>
      <button className="wide-blue-button" onClick={() => placeBet(team, amount)}>Confirm Bet</button>
    </motion.div>
  </div>;
}

function BottomNav({ tab, setTab }) {
  const items = [["pool", Trophy, "Pool"], ["deposit", Wallet, "Deposit"], ["bets", Ticket, "My Bets"], ["rewards", Gift, "Rewards"]];
  return <div className="bottom-nav">{items.map(([key, Icon, label]) => <button key={key} onClick={() => setTab(key)} className={tab === key ? "active" : ""}><Icon size={22} /><span>{label}</span></button>)}</div>;
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
    });

    if (failed.length > 0) {
      setApiError(`Some data failed: ${failed.join(" | ")}`);
      console.warn("SABA API partial load errors:", failed);
    }

    setLoading(false);
  }

  useEffect(() => { if (tgUser?.id) loadData(); }, [tgUser?.id, initData]);

  async function placeBet(team, amount) {
    try {
      const res = await api("/api/place_bet", { method: "POST", body: { team: team.name, amount }, tgUser, initData });
      alert(`Bet success: ${res.tickets} tickets / ${res.shares} shares`);
      setBetTeam(null); await loadData();
    } catch (err) { alert(err.message); }
  }

  async function createDeposit(amount) {
    try {
      const res = await api("/api/deposit/create", { method: "POST", body: { amount }, tgUser, initData });
      alert(`Deposit order created:\n${res.order_no}\n${res.network}\n${res.address}`);
      await loadData();
    } catch (err) { alert(err.message); }
  }

  async function submitTxid(order_no, txid) {
    try {
      await api("/api/deposit/txid", { method: "POST", body: { order_no, txid }, tgUser, initData });
      alert("TXID submitted. Please wait for admin confirmation.");
      await loadData();
    } catch (err) { alert(err.message); }
  }

  async function createWithdraw(amount, address) {
    try {
      const res = await api("/api/withdraw/create", { method: "POST", body: { amount, address }, tgUser, initData });
      alert(`Withdraw created: ${res.order_no}\nReceive: ${res.receive} USDT`);
      await loadData();
    } catch (err) { alert(err.message); }
  }

  return <div className="screen-bg"><div className="phone-shell">
    <AppHeader user={tgUser} />
    <UserInfoCard user={tgUser} />
    {tab === "pool" && <PoolPage onBet={setBetTeam} setTab={setTab} me={me} teams={teams} prizePool={prizePool} festival={festival} loading={loading} error={apiError} />}
    {tab === "deposit" && <DepositPage festival={festival} deposits={deposits} createDeposit={createDeposit} submitTxid={submitTxid} btcDraw={btcDraw} />}
    {tab === "bets" && <MyBetsPage bets={myBets} />}
    {tab === "rewards" && <RewardsPage festival={festival} referral={referral} walletHistory={walletHistory} withdraws={withdraws} createWithdraw={createWithdraw} />}
    <BottomNav tab={tab} setTab={setTab} />
    <BetModal team={betTeam} onClose={() => setBetTeam(null)} placeBet={placeBet} />
  </div></div>;
}

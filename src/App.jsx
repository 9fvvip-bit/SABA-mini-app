import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Wallet,
  Ticket,
  Gift,
  Users,
  Search,
  Bitcoin,
  Zap,
  ShieldCheck,
} from "lucide-react";
import "./index.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

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
  const [tgUser, setTgUser] = useState({
    id: 7336278327,
    username: "aceXXX",
    first_name: "Demo User",
  });
  const [initData, setInitData] = useState("");

  useEffect(() => {
    const loadTelegramUser = () => {
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

    if (loadTelegramUser()) return;

    const timer = setInterval(() => {
      if (loadTelegramUser()) clearInterval(timer);
    }, 300);

    return () => clearInterval(timer);
  }, []);

  return { tgUser, initData };
}

async function apiGet(path, initData, tgUser) {
  const headers = { "ngrok-skip-browser-warning": "true" };
  if (initData) headers["X-Telegram-Init-Data"] = initData;

  const url = new URL(`${API_BASE}${path}`);
  if (!initData && tgUser?.id && tgUser.id !== "Demo") {
    url.searchParams.set("telegram_id", tgUser.id);
  }

  const res = await fetch(url.toString(), { headers });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

function AppHeader({ user }) {
  return (
    <div className="app-header">
      <div>
        <div className="mini-label">Telegram Mini App</div>
        <div className="app-title">SABA WORLD CUP POOL</div>
      </div>
      <div className="user-pill">{user?.username ? `@${user.username}` : user?.first_name || "Player"}</div>
    </div>
  );
}

function UserInfoCard({ user }) {
  return (
    <div className="user-info-card">
      <div><span>Telegram User</span><b>{user?.first_name || "Demo User"}</b></div>
      <div><span>Username</span><b>{user?.username ? `@${user.username}` : "-"}</b></div>
      <div><span>Telegram ID</span><b>{user?.id || "Demo"}</b></div>
    </div>
  );
}

function HeroCard({ prizePool, festival }) {
  const basePool = formatCompactUSDT(prizePool?.champion_base_pool || prizePool?.champion_pool || 500000);
  const liveBet = formatCompactUSDT(prizePool?.live_team_bet || 0);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="hero-card">
      <div className="hero-kicker"><Trophy size={18} /> World Cup Deposit Festival</div>

      <div className="pool-combo">
        <div className="pool-base">
          <span>Base Pool</span>
          <b>{basePool}</b>
        </div>
        <div className="pool-plus">+</div>
        <div className="pool-live">
          <span>Live Team Bets</span>
          <b>{liveBet}</b>
        </div>
      </div>

      <div className="hero-sub">+ {prizePool?.btc_draw_total || "3 BTC"} Lucky Draw</div>

      <div className="hero-stats">
        <div className="hero-stat"><span>1st Prize</span><b>{prizePool?.btc_first_prize || "1 BTC"}</b></div>
        <div className="hero-stat"><span>Draw Share</span><b>{festival?.btc_draw_share ?? 0}</b></div>
        <div className="hero-stat"><span>Extra Share</span><b>{festival?.extra_share_boost || "0%"}</b></div>
      </div>

      <button className="gold-button">Deposit Now</button>
    </motion.div>
  );
}

function BalanceCard({ me }) {
  return (
    <div className="balance-grid">
      <div className="info-card">
        <div className="info-label"><Wallet size={16} /> Balance</div>
        <div className="info-value">{me?.balance || "0.00"}</div>
        <div className="info-small">USDT Available</div>
      </div>
      <div className="info-card">
        <div className="info-label"><Ticket size={16} /> My Share</div>
        <div className="info-value">{me?.total_share || "0.00"}</div>
        <div className="info-small">{me?.total_ticket || 0} Tickets</div>
      </div>
    </div>
  );
}

function TeamRow({ team, onBet }) {
  return (
    <div className="team-row">
      <div className="team-left">
        <div className="team-flag">{team.flag}</div>
        <div>
          <div className="team-name">{team.name}</div>
          <div className="team-odds">Ticket {team.total_ticket || 0} / Share {team.total_share || "0.00"}</div>
        </div>
      </div>
      <div className="team-right">
        <div className="share-box"><span>Share</span><b>{team.share_rate || "2.00"}x</b></div>
        <button onClick={() => onBet(team)} className="blue-button">{team.is_open ? "Bet" : "Closed"}</button>
      </div>
    </div>
  );
}

function TeamsPage({ onBet, me, teams, prizePool, festival, loading, error }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () => teams.filter((t) => t.name.toLowerCase().includes(query.toLowerCase())),
    [query, teams]
  );

  return (
    <div className="page">
      <HeroCard prizePool={prizePool} festival={festival} />
      <BalanceCard me={me} />

      {loading && <div className="notice-card">Loading real data...</div>}
      {error && <div className="error-card">API Error: {error}</div>}

      <div className="search-box">
        <Search size={18} />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search team" />
      </div>

      <div className="section-title">
        <b>Champion Market</b>
        <span>Early Bet = More Share</span>
      </div>

      <div className="team-list">
        {filtered.map((team) => <TeamRow key={team.name} team={team} onBet={onBet} />)}
      </div>
    </div>
  );
}

function DepositPage({ festival }) {
  return (
    <div className="page">
      <div className="white-panel">
        <div className="panel-title"><Wallet size={20} /> Deposit USDT</div>
        <div className="gray-box"><span>Network</span><b>USDT-TRC20</b></div>
        <div className="gray-box"><span>Total Confirmed Deposit</span><b>{festival?.total_deposit || "0.00"} USDT</b></div>
        <div className="gray-box"><span>BTC Draw Share</span><b>{festival?.btc_draw_share ?? 0}</b></div>
        <div className="amount-grid">
          {[50, 100, 300, 500, 1000, 3000].map((v) => <button key={v}>{v}</button>)}
        </div>
        <button className="wide-blue-button">Create Deposit Order</button>
      </div>

      <div className="white-panel">
        <div className="panel-title"><Bitcoin size={20} /> BTC Draw Rules</div>
        <p className="rule-text">
          Every 50 USDT deposit = 1 BTC Draw Share.<br />
          More Deposit = More Draw Share.<br />
          1st Prize: 1 BTC. Total Prize: 3 BTC.
        </p>
      </div>
    </div>
  );
}

function MyBetsPage({ bets }) {
  return (
    <div className="page">
      <div className="white-panel">
        <div className="panel-title"><Ticket size={20} /> My Tickets</div>
        <div className="bet-list">
          {bets.length === 0 && <div className="notice-card">No bets yet.</div>}
          {bets.map((b) => (
            <div key={b.id} className="bet-card">
              <div className="bet-head"><b>{b.flag} {b.team}</b><span>LIVE</span></div>
              <div className="bet-grid">
                <div><small>Ticket</small><b>{b.tickets}</b></div>
                <div><small>Share</small><b>{b.shares}</b></div>
                <div><small>Bet</small><b>{b.amount}</b></div>
                <div><small>Est.</small><b>{b.estimated_win}</b></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RewardsPage({ festival }) {
  return (
    <div className="page">
      <div className="white-panel">
        <div className="panel-title"><Gift size={20} /> Rewards Center</div>
        <div className="reward-card amber">
          <b><Zap size={18} /> First Deposit Pack</b>
          <p>{festival?.first_deposit_pack || "Not claimed"}</p>
        </div>
        <div className="reward-card blue">
          <b><Users size={18} /> Referral Partner</b>
          <p>Invite valid players and earn 0.5% bet commission + win profit bonus.</p>
        </div>
        <div className="reward-card green">
          <b><ShieldCheck size={18} /> Security PIN</b>
          <p>Set withdrawal PIN to protect your balance.</p>
        </div>
      </div>
    </div>
  );
}

function BetModal({ team, onClose }) {
  if (!team) return null;
  return (
    <div className="modal-bg">
      <motion.div initial={{ y: 300 }} animate={{ y: 0 }} className="modal">
        <div className="modal-head">
          <div><small>Champion Bet</small><h2>{team.flag} {team.name}</h2></div>
          <button onClick={onClose}>Close</button>
        </div>
        <div className="amount-grid">{[50, 100, 300].map((v) => <button key={v}>{v} USDT</button>)}</div>
        <div className="gray-box">Mini App betting API will be added in Development Package 2.</div>
        <button className="wide-blue-button">Confirm Bet</button>
      </motion.div>
    </div>
  );
}

function BottomNav({ tab, setTab }) {
  const items = [["teams", Trophy, "Pool"], ["deposit", Wallet, "Deposit"], ["bets", Ticket, "My Bets"], ["rewards", Gift, "Rewards"]];
  return (
    <div className="bottom-nav">
      {items.map(([key, Icon, label]) => (
        <button key={key} onClick={() => setTab(key)} className={tab === key ? "active" : ""}>
          <Icon size={22} /><span>{label}</span>
        </button>
      ))}
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("teams");
  const [betTeam, setBetTeam] = useState(null);
  const { tgUser, initData } = useTelegramUser();

  const [me, setMe] = useState(null);
  const [teams, setTeams] = useState(fallbackTeams);
  const [prizePool, setPrizePool] = useState(null);
  const [myBets, setMyBets] = useState([]);
  const [festival, setFestival] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setLoading(true);
      setApiError("");

      try {
        const [meData, teamsData, poolData, betsData, festivalData] = await Promise.all([
          apiGet("/api/me", initData, tgUser),
          apiGet("/api/teams", initData, tgUser),
          apiGet("/api/prize_pool", initData, tgUser),
          apiGet("/api/my_bets", initData, tgUser),
          apiGet("/api/deposit_festival", initData, tgUser),
        ]);

        if (cancelled) return;

        setMe(meData);
        setTeams(teamsData.teams || fallbackTeams);
        setPrizePool(poolData);
        setMyBets(betsData.bets || []);
        setFestival(festivalData);
      } catch (err) {
        if (!cancelled) setApiError(err.message || "Cannot connect to API");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (tgUser?.id) loadData();

    return () => {
      cancelled = true;
    };
  }, [tgUser?.id, initData]);

  return (
    <div className="screen-bg">
      <div className="phone-shell">
        <AppHeader user={tgUser} />
        <UserInfoCard user={tgUser} />
        {tab === "teams" && <TeamsPage onBet={setBetTeam} me={me} teams={teams} prizePool={prizePool} festival={festival} loading={loading} error={apiError} />}
        {tab === "deposit" && <DepositPage festival={festival} />}
        {tab === "bets" && <MyBetsPage bets={myBets} />}
        {tab === "rewards" && <RewardsPage festival={festival} />}
        <BottomNav tab={tab} setTab={setTab} />
        <BetModal team={betTeam} onClose={() => setBetTeam(null)} />
      </div>
    </div>
  );
}

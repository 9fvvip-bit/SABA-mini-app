import React, { useMemo, useState } from "react";
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

const teams = [
  { name: "France", flag: "🇫🇷", odds: "17.8%", rate: "2.00x" },
  { name: "Spain", flag: "🇪🇸", odds: "16.4%", rate: "2.00x" },
  { name: "England", flag: "🏴", odds: "11.5%", rate: "2.00x" },
  { name: "Argentina", flag: "🇦🇷", odds: "9.0%", rate: "2.00x" },
  { name: "Brazil", flag: "🇧🇷", odds: "8.8%", rate: "2.00x" },
  { name: "Portugal", flag: "🇵🇹", odds: "8.0%", rate: "2.00x" },
  { name: "Germany", flag: "🇩🇪", odds: "5.0%", rate: "2.00x" },
  { name: "Netherlands", flag: "🇳🇱", odds: "3.0%", rate: "2.00x" },
  { name: "Norway", flag: "🇳🇴", odds: "2.0%", rate: "2.00x" },
  { name: "Japan", flag: "🇯🇵", odds: "2.0%", rate: "2.00x" },
];

const myBets = [
  { team: "Argentina", flag: "🇦🇷", ticket: 10, share: 20, amount: 100, est: 4280 },
  { team: "France", flag: "🇫🇷", ticket: 5, share: 10, amount: 50, est: 2140 },
];

function AppHeader() {
  return (
    <div className="app-header">
      <div>
        <div className="mini-label">Telegram Mini App Demo</div>
        <div className="app-title">SABA WORLD CUP POOL</div>
      </div>
      <div className="user-pill">aceXXX</div>
    </div>
  );
}

function HeroCard() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="hero-card">
      <div className="hero-kicker"><Trophy size={18} /> World Cup Deposit Festival</div>
      <div className="hero-main">500K USDT</div>
      <div className="hero-sub">+ 3 BTC Lucky Draw</div>

      <div className="hero-stats">
        <div className="hero-stat"><span>1st Prize</span><b>1 BTC</b></div>
        <div className="hero-stat"><span>Draw Share</span><b>8</b></div>
        <div className="hero-stat"><span>Extra Share</span><b>+20%</b></div>
      </div>

      <button className="gold-button">Deposit Now</button>
    </motion.div>
  );
}

function BalanceCard() {
  return (
    <div className="balance-grid">
      <div className="info-card">
        <div className="info-label"><Wallet size={16} /> Balance</div>
        <div className="info-value">268.30</div>
        <div className="info-small">USDT Available</div>
      </div>
      <div className="info-card">
        <div className="info-label"><Ticket size={16} /> My Share</div>
        <div className="info-value">30.00</div>
        <div className="info-small">Champion Pool</div>
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
          <div className="team-odds">Market odds {team.odds}</div>
        </div>
      </div>
      <div className="team-right">
        <div className="share-box"><span>Share</span><b>{team.rate}</b></div>
        <button onClick={() => onBet(team)} className="blue-button">Bet</button>
      </div>
    </div>
  );
}

function TeamsPage({ onBet }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () => teams.filter((t) => t.name.toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  return (
    <div className="page">
      <HeroCard />
      <BalanceCard />

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

function DepositPage() {
  return (
    <div className="page">
      <div className="white-panel">
        <div className="panel-title"><Wallet size={20} /> Deposit USDT</div>
        <div className="gray-box"><span>Network</span><b>USDT-TRC20</b></div>
        <div className="gray-box"><span>Deposit Address</span><code>Txxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</code></div>

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

function MyBetsPage() {
  return (
    <div className="page">
      <div className="white-panel">
        <div className="panel-title"><Ticket size={20} /> My Tickets</div>
        <div className="bet-list">
          {myBets.map((b) => (
            <div key={b.team} className="bet-card">
              <div className="bet-head">
                <b>{b.flag} {b.team}</b>
                <span>LIVE</span>
              </div>
              <div className="bet-grid">
                <div><small>Ticket</small><b>{b.ticket}</b></div>
                <div><small>Share</small><b>{b.share}</b></div>
                <div><small>Bet</small><b>{b.amount}</b></div>
                <div><small>Est.</small><b>{b.est}</b></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RewardsPage() {
  return (
    <div className="page">
      <div className="white-panel">
        <div className="panel-title"><Gift size={20} /> Rewards Center</div>

        <div className="reward-card amber">
          <b><Zap size={18} /> First Deposit Pack</b>
          <p>First Deposit ≥ 100 USDT: 3 Free Tickets</p>
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
          <div>
            <small>Champion Bet</small>
            <h2>{team.flag} {team.name}</h2>
          </div>
          <button onClick={onClose}>Close</button>
        </div>

        <div className="amount-grid">
          {[50, 100, 300].map((v) => <button key={v}>{v} USDT</button>)}
        </div>

        <div className="gray-box">
          100 USDT = 10 Tickets. Current rate: 1 Ticket = {team.rate} Share.
        </div>

        <button className="wide-blue-button">Confirm Bet</button>
      </motion.div>
    </div>
  );
}

function BottomNav({ tab, setTab }) {
  const items = [
    ["teams", Trophy, "Pool"],
    ["deposit", Wallet, "Deposit"],
    ["bets", Ticket, "My Bets"],
    ["rewards", Gift, "Rewards"],
  ];

  return (
    <div className="bottom-nav">
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
  const [tab, setTab] = useState("teams");
  const [betTeam, setBetTeam] = useState(null);

  return (
    <div className="screen-bg">
      <div className="phone-shell">
        <AppHeader />
        {tab === "teams" && <TeamsPage onBet={setBetTeam} />}
        {tab === "deposit" && <DepositPage />}
        {tab === "bets" && <MyBetsPage />}
        {tab === "rewards" && <RewardsPage />}
        <BottomNav tab={tab} setTab={setTab} />
        <BetModal team={betTeam} onClose={() => setBetTeam(null)} />
      </div>
    </div>
  );
}

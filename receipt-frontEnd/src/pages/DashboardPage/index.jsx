import React from "react";
import "./style.css";

function Header() {
  return (
    <div className="header">
      <h2>안녕하세요! 오늘도 지출 관리 화이팅 💪</h2>
      <div className="date">2026.04.01 - 2026.04.18</div>
    </div>
  );
}

/* =========================
   STAT CARD
========================= */
function StatCard({ title, amount, rate }) {
  return (
    <div className="card">
      <div className="title">{title}</div>
      <div className="amount">{amount}</div>
      <div className="rate">지난 달 대비 {rate}</div>
    </div>
  );
}

/* =========================
   CATEGORY CHART
========================= */
function CategoryDonut() {
  return (
    <div className="panel">
      <h3>카테고리별 지출 비율</h3>

      <div className="donut-placeholder">
        {/* 추후 Recharts or SVG 적용 */}
        <div>DONUT CHART</div>
      </div>

      <div className="legend">
        <span>🟢 56.3%</span>
        <span>🔵 21.9%</span>
        <span>🟣 21.9%</span>
      </div>
    </div>
  );
}

/* =========================
   RECENT RECEIPTS
========================= */
function RecentReceipts() {
  const data = [
    { name: "떡볶이 김밥집", date: "2026-04-18", price: "₩12,800" },
    { name: "스타벅스", date: "2026-04-17", price: "₩6,500" },
    { name: "서울교통공사", date: "2026-04-16", price: "₩1,400" },
    { name: "이마트24", date: "2026-04-15", price: "₩4,200" },
  ];

  return (
    <div className="panel">
      <div className="panel-header">
        <h3>최근 지출</h3>
        <button>더보기</button>
      </div>

      <ul className="list">
        {data.map((item, i) => (
          <li key={i}>
            <div>
              <div className="name">{item.name}</div>
              <div className="date">{item.date}</div>
            </div>
            <div className="price">{item.price}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div>
      <Header />
      <StatCard title="이번 달 지출" amount="₩1,200,000" rate="+12%" />
      <CategoryDonut />
      <RecentReceipts />
    </div>
  );
}
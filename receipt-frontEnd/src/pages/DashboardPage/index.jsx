import React from "react";
import "./style.css";

function DashboardPage() {
  return (
    <div className="dashboard">

      {/* 메인 */}
      <div className="main">

        {/* 상단 */}
        <div className="top">
          <h2>안녕하세요! 오늘도 지출 관리 화이팅 💪</h2>
          <div className="date">2026.04.01 - 2026.04.18</div>
        </div>

        {/* 카드 */}
        <div className="cards">
          <div className="card">
            <p>이번 달 지출</p>
            <h3>₩320,000</h3>
            <span className="up">▲ 12.5%</span>
          </div>

          <div className="card">
            <p>식비</p>
            <h3>₩180,000</h3>
            <span className="up">▲ 8.5%</span>
          </div>

          <div className="card">
            <p>교통비</p>
            <h3>₩70,000</h3>
            <span className="down">▼ 3.2%</span>
          </div>

          <div className="card">
            <p>기타</p>
            <h3>₩70,000</h3>
            <span className="up">▲ 25.1%</span>
          </div>
        </div>

        {/* 하단 */}
        <div className="bottom">

          {/* 도넛 */}
          <div className="box">
            <h4>카테고리별 지출 비율</h4>

            <div className="chart-wrap">
              <div className="donut"></div>

              <div className="legend">
                <div><span className="green"></span> 56.3%</div>
                <div><span className="blue"></span> 21.9%</div>
                <div><span className="yellow"></span> 21.9%</div>
              </div>
            </div>
          </div>

          {/* 리스트 */}
          <div className="box">
            <div className="box-header">
              <h4>최근 영수증</h4>
              <span className="more">더보기 ›</span>
            </div>

            <div className="receipt">
              <span>🍴 맥도날드 강남점</span>
              <span>2026-04-18</span>
              <strong>₩12,800</strong>
            </div>

            <div className="receipt">
              <span>🍴 스타벅스 역삼점</span>
              <span>2026-04-17</span>
              <strong>₩6,500</strong>
            </div>

            <div className="receipt">
              <span>🚇 서울교통공사</span>
              <span>2026-04-16</span>
              <strong>₩1,400</strong>
            </div>

            <div className="receipt">
              <span>🛒 이마트24 강남점</span>
              <span>2026-04-15</span>
              <strong>₩4,200</strong>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default DashboardPage;
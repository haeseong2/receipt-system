import React, { useEffect, useState } from "react";
import "./style.css";
import { getDashboard } from "../../api/dashboardApi";
import { useNavigate } from "react-router-dom";
import { downloadYearExcel } from "../../api/excelApi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid
} from "recharts";

function DashboardPage() {
  const navigate = useNavigate();
  const [animatedSummary, setAnimatedSummary] = useState({thisMonth: 0,lastMonth: 0});
  const [animatedCategories, setAnimatedCategories] = useState([]);
  const animateCount = (start, end, duration, key) => {
  const startTime = performance.now();
  const step = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    const value = Math.floor(start + (end - start) * progress);

    setAnimatedSummary((prev) => ({
      ...prev,
      [key]: value
    }));

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };
  requestAnimationFrame(step);
  };
  const animateCategory = (data, duration = 800) => {
  const startTime = performance.now();

  const start = data.map(() => 0);

  const step = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);

    const updated = data.map((item, i) => ({
      ...item,
      current: Math.floor(item.amount * progress)
    }));

    setAnimatedCategories(updated);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
};

  const [summary, setSummary] = useState({
    thisMonth: 0,
    lastMonth: 0
  });

  const [categories, setCategories] = useState([]);
  const [recent, setRecent] = useState([]);

  // 기본 카테고리 UI
  const baseCategories = [
    { name: "食費", icon: "🍚", color: "#22c55e" },
    { name: "交通費", icon: "🚆", color: "#3b82f6" },
    { name: "光熱費", icon: "💡", color: "#a855f7" },
    { name: "ショッピング", icon: "🛍", color: "#f43f5e" },
    { name: "その他", icon: "📦", color: "#facc15" }
  ];

  useEffect(() => {
    const fetchData = async () => {
      const data = await getDashboard();

      setSummary({
        thisMonth: data.thisMonth || 0,
        lastMonth: data.lastMonth || 0
      });

      setCategories(data.categories || []);
      setRecent(data.recent || []);
      
      animateCount(0, data.thisMonth || 0, 800, "thisMonth");
      animateCount(0, data.lastMonth || 0, 800, "lastMonth");
      animateCategory(data.categories || []);
    };

    fetchData();
  }, []);

  // 🔥 카테고리 매핑 (단일 기준 데이터)
  const categoryMap = baseCategories.map(base => {
    const found = animatedCategories.find(
      c =>
        c.category === base.name ||
        c.category === base.name.toUpperCase()
    );

  return {
    ...base,
    current: found ? Number(found.current) : 0,
    last: found ? Number(found.lastAmount || 0) : 0
    };
  });

  const diff = summary.thisMonth - summary.lastMonth;
  const isUp = diff > 0;

  const format = (v) => `₩${Number(v).toLocaleString()}`;

  // X축 커스텀
  const renderCustomXAxis = (props) => {
    const { x, y, payload } = props;

    const item = categoryMap.find(c => c.name === payload.value);

    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="middle" fontSize={13}>
          {item?.icon} {payload.value}
        </text>
      </g>
    );
  };

  const total = summary.thisMonth || 1;

  const topCategory = categoryMap.reduce((max, cur) => {
    return cur.current > (max?.current || 0) ? cur : max;
  }, null);

  const topRatio = (topCategory?.current / total) * 100;

  let insightText = "";

  if (topRatio > 70) {
    insightText = `今月の支出は ${topCategory?.name}に大きく偏っています。`;
  } else if (topRatio > 50) {
    insightText = `${topCategory?.name}の支出割合が高めです。`;
  } else {
    insightText = `支出は複数のカテゴリにバランスよく分散されています。`;
  }

  const downloadExcel = async () => {
  try {
    const year = new Date().getFullYear();
    const res = await downloadYearExcel(year);
    
    const blob = new Blob([res.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${year}_支出レポート.xlsx`;
    a.click();

    window.URL.revokeObjectURL(url);

  } catch (e) {
    console.error("Excelダウンロード失敗", e);
  }
};

  return (
    <div className="dashboard">
      <div className="main">

        {/* HEADER */}
        <div className="header">
          <h2>こんにちは！今日も支出管理 💪</h2>

          <div className="header-row">
            <div className="ai-insight-box">
              <div className="ai-title">AI支出分析</div>
              <div className="ai-text">※ {insightText}</div>
            </div>

            <div className="download-area">
              <div className="btns">
                <button className="btn excel" onClick={downloadExcel}>📊 Excelダウンロード</button>
              </div>

              <div className="download-notice">
                ※ Excelは基本的に1年単位で提供されます。
              </div>
            </div>
          </div>
        </div>

        {/* CARDS */}
        <div className="cards">
          <div className="card main-card">
            <div className="card-top">
              <span className="emoji-box">🔥</span>
              <span className="card-title">今月の支出</span>
            </div>

            <h3 className="money">{format(animatedSummary.thisMonth)}</h3>

            <p className={`diff ${isUp ? "up" : "down"}`}>
              {isUp
                ? `▲ ${format(diff)} 先月より多く使用`
                : `▼ ${format(Math.abs(diff))} 先月より少なく使用`}
            </p>

            {topCategory && (
              <div className="main-highlight">
                🔥 今月の増加1位 : {topCategory.name}
              </div>
            )}
          </div>

          {categoryMap.map((c, i) => (
            <div key={i} className="card">
              <div className="card-top">
                <span className="emoji-box">{c.icon}</span>
                <span className="card-title">{c.name}</span>
              </div>

              <h3 className="money">{format(c.current)}</h3>

              <p className="percent">
                全体 {(c.current / total * 100).toFixed(1)}%
              </p>

              {c.name === topCategory?.name && (
                <div className="top-badge">🔥 増加1位</div>
              )}
            </div>
          ))}
        </div>

        {/* BOTTOM */}
        <div className="bottom">

          {/* CHART */}
          <div className="box chart-box">
            <div className="box-header">
              <h4>カテゴリ別支出</h4>
            </div>

            <div className="rechart-wrapper">
              <ResponsiveContainer width="100%" height={340}>
                <BarChart data={categoryMap} barGap={6}>

                  <CartesianGrid stroke="#f1f5f9" />

                  <XAxis
                    dataKey="name"
                    tick={renderCustomXAxis}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    tickFormatter={(v) => `₩${v.toLocaleString()}`}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip
                    formatter={(value) =>
                      `₩${Number(value).toLocaleString()}`
                    }
                    contentStyle={{
                      borderRadius: 12,
                      border: "none",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
                    }}
                  />

                  <Bar
                    dataKey="last"
                    name="先月"
                    radius={[6, 6, 0, 0]}
                    fill="#bbd4f0"
                  />

                  <Bar
                    dataKey="current"
                    name="今月"
                    radius={[6, 6, 0, 0]}
                  >
                    {categoryMap.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Bar>

                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* RECENT */}
          <div className="box">
            <div className="box-header">
              <h4>最近の領収書</h4>
              <span
                className="more"
                onClick={() => navigate("/receiptList")}
              >
                もっと見る →
              </span>
            </div>

            <div className="recent">
              {recent.slice(0, 5).map((item, i) => (
                <div key={i} className="recent-row">

                  <div className="col left">
                    <span className="emoji-box">
                      {
                        baseCategories.find(
                          c =>
                            c.name === item.category ||
                            c.name.toUpperCase() === item.category
                        )?.icon || "📦"
                      }
                    </span>
                    <span>{item.storeName}</span>
                  </div>

                  <div className="col center">
                    {item.transactionDate}
                  </div>

                  <div className="col right">
                    ₩{Number(item.amount).toLocaleString()}
                  </div>

                </div>
              ))}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
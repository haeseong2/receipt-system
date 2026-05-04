import React, { useState, useEffect } from "react";
import "./style.css";
import { useNavigate, useLocation } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [userName, setUserName] = useState("");
  useEffect(() => {
    setUserName(sessionStorage.getItem("LOGIN_USER"));
  }, []);

  const go = (path) => {
    navigate(path);
  };
  
  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <div className="sidebar">

      {/* 로고 */}
      <div className="logo">
        <div className="logo-icon">
          <svg viewBox="0 0 24 24">
            <path d="M6 2h12v20l-2-1-2 1-2-1-2 1-2-1-2 1z" fill="#3b82f6"/>
            <rect x="8" y="7" width="8" height="1.5" fill="white"/>
            <rect x="8" y="10" width="6" height="1.5" fill="white"/>
            <rect x="8" y="13" width="7" height="1.5" fill="white"/>
            <rect x="9" y="16" width="1.5" height="3" fill="white"/>
            <rect x="12" y="15" width="1.5" height="4" fill="white"/>
            <rect x="15" y="14" width="1.5" height="5" fill="white"/>
          </svg>
        </div>

        <div className="logo-text">
          <p>SHOW ME</p>
          <strong>THE MONEY</strong>
        </div>
      </div>

      {/* 메뉴 */}
      <ul className="menu">
        <li className={location.pathname === "/dashboard" ? "active" : ""} onClick={() => go("/dashboard")}>
          🏠 ダッシュボード
        </li>

        <li className={location.pathname === "/receiptUpload" ? "active" : ""} onClick={() => go("/receiptUpload")}>
          🧾 アップロード
        </li>

        <li className={location.pathname === "/receiptList" ? "active" : ""} onClick={() => go("/receiptList")}>
          📋 領収書管理
        </li>
      </ul>

      {/* 유저 */}
      <div className="user-chip">
        👤{userName ? userName : "Guest"}さん
      </div>

      {/* 로그아웃 */}
      <div className="logout" onClick={handleLogout}>
        ↩ ログアウト
      </div>
    </div>
  );
}

export default Sidebar;
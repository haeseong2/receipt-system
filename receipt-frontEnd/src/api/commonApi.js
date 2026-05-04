import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response && err.response.status === 401) {
      if (document.getElementById("session-overlay")) {
        return Promise.reject(err);
      }

      const overlay = document.createElement("div");
      overlay.id = "session-overlay";
      overlay.innerHTML = `
        <div class="session-box">
          <div class="session-icon">⚠️</div>
          <div class="session-text">
            セッションが終了しました。<br/>
            再度ログインしてください。
          </div>
          <button class="session-btn">確認</button>
        </div>
      `;

      document.body.appendChild(overlay);

      // 버튼 클릭
      overlay.querySelector(".session-btn").onclick = () => {
        sessionStorage.clear();
        window.location = "/";
      };

      // ===== CSS 주입 =====
      const style = document.createElement("style");
      style.innerHTML = `
        #session-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;

          background: rgba(0,0,0,0.45);
          backdrop-filter: blur(5px);

          display: flex;
          justify-content: center;
          align-items: center;

          z-index: 9999;

          animation: fadeIn 0.2s ease;
        }

        .session-box {
          background: #fff;
          padding: 30px 36px;
          border-radius: 16px;

          text-align: center;
          min-width: 260px;

          box-shadow: 0 20px 60px rgba(0,0,0,0.25);

          animation: popUp 0.25s ease;
        }

        .session-icon {
          font-size: 36px;
          margin-bottom: 12px;
        }

        .session-text {
          font-size: 15px;
          font-weight: 600;
          margin-bottom: 18px;
          line-height: 1.5;
        }

        .session-btn {
          background: #2563eb;
          color: #fff;

          border: none;
          padding: 8px 20px;
          border-radius: 8px;

          font-weight: 600;
          cursor: pointer;
        }

        .session-btn:hover {
          background: #1e40af;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes popUp {
          from { transform: scale(0.85); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `;

      document.head.appendChild(style);
    }

    return Promise.reject(err);
  }
);

export default api;
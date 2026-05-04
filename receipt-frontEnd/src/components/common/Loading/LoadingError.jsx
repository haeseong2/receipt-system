import "./common.css";

export default function Error({message = "「 OCRへの接続に失敗しました。管理者にお問い合わせください。」", onClose}) {
  return (
    <div className="error-overlay">
      <div className="error-box">
        <div className="error-icon">❌</div>
        <p className="error-text">{message}</p>
        <button className="error-btn" onClick={onClose}>確認</button>
      </div>
    </div>
  );
}
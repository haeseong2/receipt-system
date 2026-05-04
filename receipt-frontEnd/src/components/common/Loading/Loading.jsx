import "./common.css";

export default function Loading() {
  return (
    <div className="loading-overlay">
      <div className="spinner"></div>
      <p className="loading-text">AI 分析中...</p>
    </div>
  );
}
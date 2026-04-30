import "./common.css";

export default function Loading() {
  return (
    <div className="loading-overlay">
      <div className="spinner"></div>
      <p className="loading-text">AI 분석중...</p>
    </div>
  );
}
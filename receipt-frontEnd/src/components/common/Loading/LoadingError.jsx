import "./common.css";

export default function Error({message = "OCR접속 실패 관리자에게 문의하세요", onClose}) {
  return (
    <div className="error-overlay">
      <div className="error-box">
        <div className="error-icon">❌</div>
        <p className="error-text">{message}</p>
        <button className="error-btn" onClick={onClose}>확인</button>
      </div>
    </div>
  );
}
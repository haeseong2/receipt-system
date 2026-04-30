export default function ResultModal({ type, message, onClose }) {
  return (
    <div className="overlay">
      <div className="modal-box">

        <div className="modal-icon">
          {type === "success" ? "✅" : "❌"}
        </div>

        <p className="modal-text">
          {message}
        </p>

        <button className="btn-ok" onClick={onClose}>확인</button>
        
      </div>

    </div>
  );
}
import "./common.css";

export default function ConfirmModal({
  message = "저장하시겠습니까?",
  onYes,
  onNo
}) {
  return (
    <div className="overlay">
      <div className="modal-box">
        <div className="modal-icon">⚠️</div>
        <p className="modal-text">{message}</p>
        <div className="modal-btns">
          <button className="btn-yes" onClick={onYes}>
            예
          </button>
          <button className="btn-no" onClick={onNo}>
            아니오
          </button>
        </div>
      </div>
    </div>
  );
}
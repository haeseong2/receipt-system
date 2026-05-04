import "./common.css";
export default function ConfirmModal({ message, onYes, onNo }) {
  return (
    <div className="overlay">
      <div className="modal-box">

        <p className="modal-text">
          {message}
        </p>

        <div className="modal-btns">
          <button className="btn-yes" onClick={onYes}>
            はい
          </button>
          <button className="btn-no" onClick={onNo}>
            いいえ
          </button>
        </div>

      </div>
    </div>
  );
}
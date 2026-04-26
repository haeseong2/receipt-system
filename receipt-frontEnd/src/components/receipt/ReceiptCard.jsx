import ReceiptImagePreview from "./ReceiptImagePreview";
import ReceiptForm from "./ReceiptForm";
import ItemTable from "./ItemTable";

export default function ReceiptCard({ receipt, index, setReceipts }) {
  const toggleOpen = () => {
    setReceipts((prev) =>
      prev.map((r) =>
        r.id === receipt.id ? { ...r, open: !r.open } : r
      )
    );
  };

  return (
    <div className="card">
      <div className="card-header" onClick={toggleOpen}>
        영수증 {index + 1} {receipt.open ? "▲" : "▼"}
      </div>

      {receipt.open && (
        <div className="card-body">
          <ReceiptImagePreview imageUrl={receipt.imageUrl} />

          <div className="card-right">
            <ReceiptForm receipt={receipt} />
            <ItemTable receipt={receipt} setReceipts={setReceipts} />

            <button className="save-btn">등록</button>
          </div>
        </div>
      )}
    </div>
  );
}
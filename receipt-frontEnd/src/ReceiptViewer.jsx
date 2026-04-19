import "./styles/ReceiptViewer.css";

function ReceiptViewer({ receipts, setReceipts }) {

  const toggleOpen = (id) => {
    setReceipts((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, open: !r.open } : r
      )
    );
  };

  const handleEditItem = (receiptId, index) => {
    const name = prompt("상품명");
    const price = prompt("가격");

    if (!name || !price) return;

    setReceipts((prev) =>
      prev.map((r) => {
        if (r.id === receiptId) {
          const items = [...r.data.items];
          items[index] = { name, price: Number(price) };
          return { ...r, data: { ...r.data, items } };
        }
        return r;
      })
    );
  };

  return (
    <div className="receipt-list">
      {receipts.map((r, idx) => (
        <div key={r.id} className="receipt-card">

          <div className="receipt-header" onClick={() => toggleOpen(r.id)}>
            영수증 {idx + 1} {r.open ? "▲" : "▼"}
          </div>

          {r.open && (
            <div className="receipt-body">

              <div className="receipt-image">
                <img src={r.imageUrl} alt="receipt" />
              </div>

              <div className="receipt-data">
                <p>날짜: {r.data.date}</p>
                <p>총 금액: {r.data.total}円</p>

                {r.data.items?.map((item, i) => (
                  <div key={i} className="item-row">
                    <span>{item.name} - {item.price}円</span>
                    <button onClick={() => handleEditItem(r.id, i)}>수정</button>
                  </div>
                ))}

                <button className="save-btn">등록</button>
              </div>

            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ReceiptViewer;
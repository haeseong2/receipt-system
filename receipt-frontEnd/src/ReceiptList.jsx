import React, { useState } from "react";

const ReceiptList = ({ receipts }) => {
  const [openId, setOpenId] = useState(null);

  return (
    <div>
      {receipts.map((r, i) => {
        const open = openId === r.id;

        return (
          <div key={r.id} style={styles.card}>
            <div
              style={styles.header}
              onClick={() => setOpenId(open ? null : r.id)}
            >
              영수증 {i + 1} {open ? "▼" : "▶"}
            </div>

            {open && (
              <div style={styles.content}>
                <img src={r.image} style={styles.img} />

                <div>
                  <p>카테고리: {r.category}</p>
                  <p>날짜: {r.date}</p>
                  <p>금액: {r.total}</p>

                  <ul>
                    {r.items.map((item, idx) => (
                      <li key={idx}>
                        {item.name} - {item.price}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const styles = {
  card: {
    border: "1px solid #ddd",
    marginBottom: "10px",
    padding: "10px",
  },
  header: {
    cursor: "pointer",
    fontWeight: "bold",
  },
  content: {
    display: "flex",
    gap: "20px",
    marginTop: "10px",
  },
  img: {
    width: "200px",
  },
};

export default ReceiptList;
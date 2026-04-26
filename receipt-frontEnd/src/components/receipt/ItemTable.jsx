export default function ItemTable({ receipt, setReceipts }) {
  const handleEdit = (index) => {
    const name = prompt("상품명");
    const price = prompt("가격");

    if (!name || !price) return;

    setReceipts((prev) =>
      prev.map((r) => {
        if (r.id === receipt.id) {
          const items = [...r.data.items];
          items[index] = { name, price: Number(price) };
          return { ...r, data: { ...r.data, items } };
        }
        return r;
      })
    );
  };

  return (
    <div>
      {receipt.data.items?.map((item, i) => (
        <div key={i} className="item-row">
          <span>{item.name} - {item.price}円</span>
          <button onClick={() => handleEdit(i)}>수정</button>
        </div>
      ))}
    </div>
  );
}
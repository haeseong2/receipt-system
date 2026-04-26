import { useState } from "react";
import ImageUploader from "../../components/upload/ImageUploader";
import Loading from "../../components/common/Loading";
import { uploadReceipt } from "../../api/ocrApi";
import ReceiptCard from "../../components/receipt/ReceiptCard";

export default function ReceiptUploadPage() {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (file) => {
    setLoading(true);

    try {
      const res = await uploadReceipt(file);

      const newReceipt = {
        id: Date.now(),
        imageUrl: URL.createObjectURL(file),
        data: res,
        open: true,
      };

      setReceipts((prev) => [newReceipt, ...prev]);
    } catch (e) {
      console.error(e);
    }

    setLoading(false);
  };

  return (
    <div className="page">
      <h1>영수증 등록</h1>

      <ImageUploader onUpload={handleUpload} />

      {loading && <Loading />}

      {receipts.map((r, idx) => (
        <ReceiptCard
          key={r.id}
          receipt={r}
          index={idx}
          setReceipts={setReceipts}
        />
      ))}
    </div>
  );
}
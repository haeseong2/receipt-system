import { useState } from "react";
import "./styles/App.css";
import ReceiptViewer from "./ReceiptViewer";

function App() {
  const [receipts, setReceipts] = useState([]);

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:8080/api/upload", {
      method: "POST",
      body: formData,
    });

    const text = await res.text();
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}") + 1;
    const data = JSON.parse(text.substring(jsonStart, jsonEnd));

    const newReceipt = {
      id: Date.now(),
      imageUrl: URL.createObjectURL(file),
      data,
      open: true,
    };

    setReceipts((prev) => [newReceipt, ...prev]);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) handleUpload(file);
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>Receipt AI</h1>
        <p>영수증 자동 정리 시스템</p>
      </div>

      <div className="upload-card">
        <label className="upload-box">
          <input type="file" onChange={handleFileChange} hidden />
          <div className="upload-text">
            📸 이미지 업로드
            <span>클릭해서 영수증 추가</span>
          </div>
        </label>
      </div>

      <ReceiptViewer receipts={receipts} setReceipts={setReceipts} />
    </div>
  );
}

export default App;
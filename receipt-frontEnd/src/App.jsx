import React, { useState } from "react";

function App() {
  const [preview, setPreview] = useState(null);

  // 🔥 파일 선택 시 바로 Spring으로 전송
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 미리보기
    setPreview(URL.createObjectURL(file));

    // 서버 전송
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:8080/api/upload", {
        method: "POST",
        body: formData,
      });

      const text = await res.text();
      console.log("서버 응답:", text);

    } catch (err) {
      console.error("전송 실패:", err);
      alert("서버 연결 실패");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5",
      }}
    >
      <div
        style={{
          width: "500px",
          padding: "30px",
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}
      >
        <h2>영수증 파일 업로드</h2>

        <input type="file" onChange={handleFileChange} />

        {preview && (
          <div style={{ marginTop: "20px" }}>
            <img
              src={preview}
              alt="preview"
              style={{
                width: "100%",
                borderRadius: "10px",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
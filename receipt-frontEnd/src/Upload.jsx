import React, { useState } from "react";

const Upload = ({ onUpload }) => {
  const [drag, setDrag] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDrag(false);

    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const processFile = (file) => {
    const reader = new FileReader();

    reader.onload = () => {
      onUpload(file, reader.result); // 🔥 file + image 둘 다 전달
    };

    reader.readAsDataURL(file);
  };

  return (
    <div
      style={{
        ...styles.box,
        borderColor: drag ? "#4f46e5" : "#ccc",
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={handleDrop}
    >
      <h2>파일을 넣어주세요</h2>

      <input
        type="file"
        onChange={(e) => processFile(e.target.files[0])}
      />
    </div>
  );
};

const styles = {
  box: {
    width: "300px",
    height: "300px",
    border: "2px dashed #ccc",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
};

export default Upload;
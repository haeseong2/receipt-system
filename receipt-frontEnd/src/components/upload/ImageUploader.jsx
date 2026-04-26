export default function ImageUploader({ onUpload }) {
  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) onUpload(file);
  };

  return (
    <label className="upload-box">
      <input type="file" onChange={handleChange} hidden />
      <div>📸 이미지 업로드</div>
    </label>
  );
}
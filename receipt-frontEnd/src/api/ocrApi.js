export const uploadReceipt = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("http://localhost:8080/api/upload", {
    method: "POST",
    body: formData,
  });

  const text = await res.text();

  const jsonStart = text.indexOf("{");
  const jsonEnd = text.lastIndexOf("}") + 1;

  return JSON.parse(text.substring(jsonStart, jsonEnd));
};
import api from "./commonApi";

export const saveReceipt = async(receiptForm)=>{
  const formData = new FormData();
  
  formData.append("storeName", receiptForm.storeName);
  formData.append("transactionDate", receiptForm.transactionDate);
  formData.append("totalAmount", receiptForm.totalAmount);
  formData.append("itemCount", receiptForm.itemCount);
  formData.append("category", receiptForm.category);
  formData.append("currency", receiptForm.currency);
  formData.append("ocrConfidence", receiptForm.ocrConfidence);
  formData.append("file", receiptForm.file);

  const res = await api.post("/receipts",formData);
  return res.data;
};
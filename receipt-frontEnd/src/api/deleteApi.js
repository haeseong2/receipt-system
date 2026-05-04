import api from "./commonApi";

export const deleteReceipt = async (receipt_Id) => {
  const res = await api.delete(`/receipts/${receipt_Id}`);
  return res.data;
};
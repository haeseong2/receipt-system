import api from "./commonApi";

export const getReceiptList = async(searchCondition) => {
  const res =
    await api.get(
      "/receiptList",
      {
        params:{
          page: searchCondition.page,
          size: searchCondition.size,
          year: searchCondition.year,
          month: searchCondition.month,
          category: searchCondition.category,
          storeName: searchCondition.storeName
        }
      }
    );

  return res.data;

};
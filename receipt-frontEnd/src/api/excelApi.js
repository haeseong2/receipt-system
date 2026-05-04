import api from "./commonApi";

// 연도 기준 엑셀 다운로드
export const downloadYearExcel = async (year) => {
  const res = await api.get(`/excel`, {
    params: { year },
    responseType: "blob" 
  });

  return res;
};
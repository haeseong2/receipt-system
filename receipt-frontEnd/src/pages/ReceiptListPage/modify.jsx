import React, { useEffect, useState } from "react";
import { updateReceipt } from "../../api/updateReceiptApi";

export default function Modify({
  open,
  selected,
  setSelected,
  onClose,
  onSave
}) {
  const [form, setForm] = useState(null);

  // selected 들어오면 form 초기화
  useEffect(() => {
    if (selected) {
      setForm({ ...selected });
    }
  }, [selected]);

  // 닫힘 처리
  if (!open || !form) return null;

  // 값 변경
  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  // 숫자만 허용
  const onlyNumber = (value) => value.replace(/[^0-9]/g, "");

  // 콤마 표시
  const formatNumber = (value) => {
    if (!value) return "";
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // 저장
  const handleSaveClick = async () => {
    try {
      await updateReceipt({
        ...form,
        totalAmount: Number(String(form.totalAmount).replace(/,/g, "")),
        itemCount: Number(form.itemCount)
      });

      onSave(); 
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="overlay">
      <div className="edit-modal">

        {/* LEFT - 이미지 */}
        <div className="edit-left">
          <img src={form.imageUrl} />
        </div>

        {/* RIGHT - FORM */}
        <div className="edit-right">

          {/* 날짜 */}
          <div className="field">
            <label>日付</label>
            <input type="date" value={form.transactionDate || ""} onChange={
              (e) => handleChange("transactionDate", e.target.value)}/>
          </div>

          {/* 가맹점 */}
          <div className="field">
            <label>店舗名</label>
            <input value={form.storeName || ""} onChange={
              (e) => handleChange("storeName", e.target.value)}/>
          </div>

          {/* 수량 */}
          <div className="field">
            <label>数量</label>
            <input value={formatNumber(form.itemCount)} onChange={
              (e) => handleChange("itemCount", onlyNumber(e.target.value))}inputMode="numeric"/>
          </div>

          {/* 총금액 */}
          <div className="field">
            <label>合計金額</label>
            <input value={formatNumber(form.totalAmount)} onChange={
              (e) => handleChange("totalAmount", onlyNumber(e.target.value))} inputMode="numeric"/>
          </div>

          {/* currency */}
          <div className="field">
            <label>通貨</label>
            <select value={form.currency || "KRW"} onChange={
              (e) =>handleChange("currency", e.target.value)}>
              <option value="KRW">韓国 (KRW)</option>
              <option value="JPY">日本 (JPY)</option>
              <option value="USD">アメリカ (USD)</option>
            </select>
          </div>

          {/* 카테고리 */}
          <div className="field">
            <label>カテゴリ</label>
            <select value={form.category || "食費"} onChange={
              (e) =>handleChange("category", e.target.value)}>
              <option value="食費">食費</option>
              <option value="交通費">交通費</option>
              <option value="光熱費">光熱費</option>
              <option value="ショッピング">ショッピング</option>
              <option value="その他">その他</option>
            </select>
          </div>

          {/* 버튼 */}
          <div className="btn-row">
            <button onClick={onClose}>キャンセル</button>
            <button onClick={handleSaveClick}>保存</button>
          </div>

        </div>
      </div>
    </div>
  );
}
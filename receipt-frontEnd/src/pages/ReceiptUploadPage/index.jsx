import React, { useState, useRef } from "react";
import "./style.css";
import { uploadReceipt } from "../../api/ocrApi";
import { saveReceipt } from "../../api/receiptApi";
import Loading from "../../components/common/Loading/Loading";
import LoadingError from "../../components/common/Loading/LoadingError";
import ConfirmModal from "../../components/common/ReceiptSave/ConfirmModal";
import ResultModal from "../../components/common/ReceiptSave/ResultModal";

function ReceiptUploadPage(){
  const [image, setImage] = useState(null);
  const [showItems, setShowItems] = useState(false);
  const [savedList, setSavedList] = useState([]);
  const fileRef = useRef(null);
  
  // OCR UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // DB UI
  const [confirm, setConfirm] = useState(false);
  const [result, setResult] = useState(null);  
  
  const [form,setForm] = useState({
    storeName:"",
    transactionDate:"",
    totalAmount:0,
    itemCount:0,
    currency:"JPY",
    category:"",
    ocrConfidence:0,
    file:null
  });

  const storeRef = useRef(null);
  const dateRef = useRef(null);
  const amountRef = useRef(null);
  const categoryRef = useRef(null);
  const formatNumber = (num)=>{
    if(
      num===null ||
      num===undefined ||
      num===""
    ) return "";

    return Number(num)
      .toLocaleString();
  };

  const unFormat = (value)=>{
    return value.replace(
      /,/g,
      ""
    );
  };

  const handleChange = (e)=>{
    const {name,value} = e.target;
    setForm(prev=>({
      ...prev,
      [name]:value
    }));
  };

  const handleImage = async(e)=>{
    const file = e.target.files[0];
    if(!file) return;
    setImage(
      URL.createObjectURL(file)
    );
    setLoading(true);
    try{
      const result = await uploadReceipt(file);
      setForm({
        storeName:
          result.storeName || "",
        transactionDate:
          result.transactionDate || "",
        totalAmount:
          Number(
            result.totalAmount || 0
          ),
        itemCount:
          Number(
            result.itemCount || 0
          ),
        currency:
          result.currency || "JPY",
        category:"",
        ocrConfidence:
          Number(
            result.ocrConfidence || 0
          ),
        file:file
      });
    }catch(error){
      setError("OCRへの接続に失敗しました。管理者にお問い合わせください。");
    }finally{
      setLoading(false);
    }
  };

  const validateForm = ()=>{
    if(!form.storeName.trim()){
      alert("店舗名を入力してください");
      storeRef.current.focus();
      return false;
    }

    if(!form.transactionDate){
      alert("取引日を入力してください");
      dateRef.current.focus();
      return false;
    }

    if(!form.totalAmount || Number(form.totalAmount)<=0){
      alert("合計金額を確認してください");
      amountRef.current.focus();
      return false;
    }

    if(!form.itemCount || Number(form.itemCount)<=0){
      alert("数量を確認してください");
      return false;
    }

    if(!form.category){
      alert("カテゴリを選択してください");
      categoryRef.current.focus();
      return false;
    }

    if(!form.file){
      alert("領収書ファイルをアップロードしてください");
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    setConfirm(true);
  };

  const handleReset = ()=>{
    setImage(null);
    setForm({
      storeName:"",
      transactionDate:"",
      totalAmount:0,
      itemCount:0,
      currency:"JPY",
      category:"",
      ocrConfidence:0,
      file:null
    });
  if(fileRef.current){
    fileRef.current.value = "";
  }
  };

  return(
    <div className="upload-page">
      {loading && <Loading/>}
      {error && (<LoadingError message={error} onClose={() => setError(null)}/>)}
      {confirm && (<ConfirmModal message="保存しますか？" 
      onYes={async () => {
        setConfirm(false);
          try {
                setLoading(true);
                const result = await saveReceipt(form); // ✔ DB 저장
                const newData = {
                  id: result,
                  storeName: form.storeName,
                  transactionDate: form.transactionDate,
                  totalAmount: form.totalAmount,
                  itemCount: form.itemCount,
                  currency: form.currency,
                  category: form.category
                };
                setSavedList(prev => [newData, ...prev]); 
                setShowItems(true);

                setImage(null);
                setForm({
                  storeName:"",
                  transactionDate:"",
                  totalAmount:0,
                  itemCount:0,
                  currency:"JPY",
                  category:"",
                  ocrConfidence:0,
                  file:null
                });
                if (fileRef.current) {
                  fileRef.current.value = "";
                }
                setResult({
                  type: "success",
                  message: "登録が完了しました。"
                });

              } catch (error) {
                setResult({
                  type: "error",
                  message: error.response?.data?.message || "保存に失敗しました。管理者にお問い合わせください。"
                });
              } finally {
                setLoading(false);
              }
      }}
      onNo={() => setConfirm(false)}/>
    )}
    {result && (<ResultModal type={result.type} message={result.message} onClose={() => setResult(null)}/>)}
      <div className="main">
        <h2 className="title">
          領収書登録
        </h2>

        <div className="content-wrap">
          <div className="card">
            <div className="inner">
              <div className="left-card">
                <p className="section-title">
                  領収書画像
                </p>

                <div className="img-row">
                  <label className="upload-box">
                    <div className="upload-inner">
                      <div className="image-icon">
                        <svg width="40" height="40" viewBox="0 0 24 24">
                          <path
                            fill="#3b82f6"
                            d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14
                               a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2zm-11-6
                               l2.5 3.01L16 12l5 7H5l5-6z"
                          />
                        </svg>
                      </div>
                      <p className="upload-title">
                        画像アップロード
                      </p>
                      <span className="upload-desc">
                        JPG, PNG (最大 10MB)
                      </span>
                    </div>
                    <input type="file" ref={fileRef} onChange={handleImage}/>
                  </label>

                  <div className="preview-box">
                    {
                      image
                      ? <img
                          src={image}
                          alt="preview"
                        />
                      : <p className="preview-text">
                          プレビュー
                        </p>
                    }
                  </div>
                </div>
              </div>

              <div className="right-card">
                <div className="form-group">
                  <label>店舗名</label>
                  <input ref={storeRef} name="storeName" value={form.storeName} onChange={handleChange}/>
                </div>

                <div className="form-group">
                  <label>取引日</label>
                  <input ref={dateRef} type="date" name="transactionDate" value={form.transactionDate} onChange={handleChange}/>
                </div>

                <div className="form-group">
                  <label>合計金額</label>
                  <div className="money-wrap">
                    <input ref={amountRef} name="totalAmount" value={formatNumber( form.totalAmount )}
                      onChange={(e)=>setForm(prev=>({...prev,
                          totalAmount:unFormat(e.target.value)}))}/>
                    <span className="currency">
                      {form.currency}
                    </span>
                  </div>
                </div>

                <div className="form-group">
                  <label>数量</label>
                  <input name="itemCount" value={form.itemCount} readOnly/>
                </div>

                <div className="form-group">
                  <label>カテゴリ</label>
                  <select ref={categoryRef} name="category" value={form.category} onChange={handleChange}>
                    <option value="">
                      選択してください
                    </option>
                    <option value="食費">
                      食費
                    </option>
                    <option value="交通費">
                      交通費
                    </option>
                    <option value="ショッピング">
                      ショッピング
                    </option>
                    <option value="光熱費">
                      光熱費
                    </option>
                    <option value="その他">
                      その他
                    </option>
                  </select>
                </div>

                <div className="ocr-badge">
                  精度{Math.round(form.ocrConfidence *100)}%
                  <span className="ocr-warning">
                    OCRの結果は正確でない場合があります。
                  </span>
                </div>

              </div>
            </div>
          </div>
        
        <div className="bottom-row">
          {/* 저장 항목 */}
          <div className={`detail-toggle ${showItems ? "active" : ""}`} onClick={() => setShowItems(!showItems)}>
            保存項目 {showItems ? "閉じる ▲" : "表示 ▼"}
          </div>

          {showItems && savedList.length > 0 && (
          <div className="item-box">

            {/* 헤더 */}
            <div className="item-header">
              <span>店舗名</span>
              <span>取引日</span>
              <span>合計金額</span>
              <span>数量</span>
              <span>カテゴリ</span>
            </div>

            {/* 데이터 */}
            {savedList.map((item, index) => (
              <div key={index} className="item-row">

                <input value={item.storeName} readOnly />
                <input value={item.transactionDate} readOnly />
                <input value={`${formatNumber(item.totalAmount)} ${item.currency}`} readOnly />
                <input value={item.itemCount} readOnly />
                <input value={item.category} readOnly />

              </div>
            ))}

          </div>
        )}
          
          <div className="bottom-btns">
            <button className="reset" onClick={handleReset}>
              リセット
            </button>

            <button className="save" onClick={handleSave}>
              保存
            </button>
          </div>
        </div>
        </div>

      </div>

    </div>
  );
}

export default ReceiptUploadPage;
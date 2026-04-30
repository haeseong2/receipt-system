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
      setError("OCR접속 실패 관리자에게 문의하세요");
    }finally{
      setLoading(false);
    }
  };

  const validateForm = ()=>{
    if(!form.storeName.trim()){
      alert("가맹점명을 입력하세요");
      storeRef.current.focus();
      return false;
    }

    if(!form.transactionDate){
      alert("거래일시 입력하세요");
      dateRef.current.focus();
      return false;
    }

    if(!form.totalAmount || Number(form.totalAmount)<=0){
      alert("총 금액 확인하세요");
      amountRef.current.focus();
      return false;
    }

    if(!form.itemCount || Number(form.itemCount)<=0){
      alert("총 수량 확인하세요");
      return false;
    }

    if(!form.category){
      alert("카테고리 선택하세요");
      categoryRef.current.focus();
      return false;
    }

    if(!form.file){
      alert("영수증 파일 업로드 필요");
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
      {confirm && (<ConfirmModal message="저장하시겠습니까?" 
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
                  message: "서버 등록 성공"
                });

              } catch (error) {
                setResult({
                  type: "error",
                  message: error.response?.data?.message || "서버 저장 실패 관리자에게 문의하세요"
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
          영수증 등록
        </h2>

        <div className="content-wrap">
          <div className="card">
            <div className="inner">
              <div className="left-card">
                <p className="section-title">
                  영수증 이미지
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
                        이미지 업로드
                      </p>
                      <span className="upload-desc">
                        JPG, PNG (최대 10MB)
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
                          미리보기
                        </p>
                    }
                  </div>
                </div>
              </div>

              <div className="right-card">
                <div className="form-group">
                  <label>가맹점명</label>
                  <input ref={storeRef} name="storeName" value={form.storeName} onChange={handleChange}/>
                </div>

                <div className="form-group">
                  <label>거래일시</label>
                  <input ref={dateRef} type="date" name="transactionDate" value={form.transactionDate} onChange={handleChange}/>
                </div>

                <div className="form-group">
                  <label>총 금액</label>
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
                  <label>총 수량</label>
                  <input name="itemCount" value={form.itemCount} readOnly/>
                </div>

                <div className="form-group">
                  <label>카테고리</label>
                  <select ref={categoryRef} name="category" value={form.category} onChange={handleChange}>
                    <option value="">
                      선택하세요
                    </option>
                    <option value="식비">
                      식비
                    </option>
                    <option value="교통비">
                      교통비
                    </option>
                    <option value="쇼핑">
                      쇼핑
                    </option>
                    <option value="공과금">
                      공과금
                    </option>
                    <option value="기타">
                      기타
                    </option>
                  </select>
                </div>

                <div className="ocr-badge">
                  정확도{Math.round(form.ocrConfidence *100)}%
                  <span className="ocr-warning">
                    ※ OCR 결과는
                    정확하지 않을 수 있습니다
                  </span>
                </div>

              </div>
            </div>
          </div>
        
        <div className="bottom-row">
          {/* 저장 항목 */}
          <div className={`detail-toggle ${showItems ? "active" : ""}`} onClick={() => setShowItems(!showItems)}>
            저장 항목 {showItems ? "접기 ▲" : "보기 ▼"}
          </div>

          {showItems && savedList.length > 0 && (
          <div className="item-box">

            {/* 헤더 */}
            <div className="item-header">
              <span>가맹점명</span>
              <span>거래일시</span>
              <span>총 금액</span>
              <span>총 수량</span>
              <span>카테고리</span>
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
              초기화
            </button>

            <button className="save" onClick={handleSave}>
              저장하기
            </button>
          </div>
        </div>
        </div>

      </div>

    </div>
  );
}

export default ReceiptUploadPage;
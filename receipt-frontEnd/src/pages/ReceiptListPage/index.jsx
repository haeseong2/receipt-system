import React, { useEffect, useState } from "react";
import "./style.css";
import { useNavigate } from "react-router-dom";
import { getReceiptList } from "../../api/receiptListApi";
import { deleteReceipt } from "../../api/deleteApi";
import ConfirmModal from "../../components/common/Delete/ConfirmModal";
import ResultModal from "../../components/common/Delete/ResultModal";
import Modify from "./modify";

function ReceiptListPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMap, setErrorMap] = useState({});
  
  // 삭제 
  const [confirm, setConfirm] = useState(false);
  const [result, setResult] = useState(null); 
  const [targetId, setTargetId] = useState(null);

  // 수정 
  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  // 데이터
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [category, setCategory] = useState("");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [data, setData] = useState([]);
  const years = Array.from({ length: 15 },(_, i) => 2026 + i);
  const months = Array.from({ length: 12 },(_, i) => i + 1);

  /* 목록 조회 */
  const fetchReceipts = async (pageNo = 0) => {setLoading(true);
    try {
      const res =
      await getReceiptList({
        page:pageNo,
        size:5,
        year:year,
        month:month,
        category:category,
        storeName:keyword
      });

      setData(res.content || []);
      setTotalPages(res.totalPages || 1);
      setPage(pageNo);
    } catch (e) {
      console.error(
        "一覧取得失敗",
        e
      );
    } finally {
    setLoading(false);
    }
  };

  /* 최초 진입 */
  useEffect(() => {fetchReceipts(0);}, []);

  /* 년월 카테고리 바뀌면 즉시 재조회 */
  useEffect(() => {fetchReceipts(0);}, 
  [
    year,
    month,
    category
  ]);

  /* 검색 */
  const handleSearch = () => {setPage(0);
    fetchReceipts(0);
  };

  /* 삭제 */
  const handleDeleteClick = (id) => {
    setTargetId(id);
    setConfirm(true);
  };

  return (
    <div className="page">
        {editOpen && (<Modify
            open={editOpen}
            selected={selected}
            setSelected={setSelected}
            onClose={() => setEditOpen(false)}
            onSave={() => {
              fetchReceipts(page);
              setEditOpen(false);
            }}
          />
        )}

      {confirm && (<ConfirmModal message="本当に削除しますか？"onYes={async () => {
        setConfirm(false);
        try {
          await deleteReceipt(targetId);
          fetchReceipts(page); 

          setResult({
            type: "success",
            message: "削除が完了しました。"
          });

        } catch (err) {
          setResult({
            type: "error",
            message: "削除に失敗しました。管理者にお問い合わせください。"
          });
        }
      }}
        onNo={() => setConfirm(false)}
      />
    )}
    {result && (<ResultModal type={result.type} message={result.message}onClose={() => setResult(null)}/>)} 
      <div className="main">
        <h2 className="title">
          領収書一覧
        </h2>

        <p className="sub">
          登録した領収書を確認・管理できます。
        </p>

        {/* 필터 */}
        <div className="filter-bar">
          <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
            {years.map(y => (<option key={y} value={y}>{y}年</option>))}
          </select>

          <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
            {months.map(m => (<option key={m} value={m}>{m}月</option>))}
          </select>

          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">
              カテゴリ
            </option>
            <option value="食費">
              食費
            </option>
            <option value="交通費">
              交通費
            </option>
            <option value="光熱費">
              光熱費
            </option>
            <option value="ショッピング">
              ショッピング
            </option>
            <option value="その他">
              その他
            </option>
          </select>

          <div className="search-box">
            <input className="search" value={keyword} onChange={(e)=>setKeyword(e.target.value)}
              onKeyDown={(e)=>{
                if(e.key==="Enter"){
                  handleSearch();
                }}}
                placeholder="店舗名で検索"/>
            <span className="search-icon" onClick={handleSearch}>
              🔍
            </span>
          </div>

          <button className="add-btn" onClick={()=>navigate("/receiptUpload")}>
            + 領収書登録
          </button>
        </div>

        {/* 테이블 */}
        <div className="table-box">
          <div className="table-header">
            <span>No</span>
            <span>領収書</span>
            <span>日付</span>
            <span>店舗名</span>
            <span>数量</span>
            <span>合計金額</span>
            <span>カテゴリ</span>
            <span>操作</span>
          </div>
          {
            loading ?
            (
              <div className="empty">
                読み込み中...
              </div>
            ):
            data.length === 0 ?
            (
              <div className="empty">
                領収書を登録してください。
              </div>
            ):

            data.map((item,index)=>(
            <div
                key={
                  item.receiptId
                }
                className="table-row">

                <span>{page * 5 + index + 1}</span>
                <span className="receipt-img">
                  <img src={item.imageUrl} className="receipt-thumb"onError={
                    (e) => {setErrorMap((prev) => ({ ...prev, [item.id]: true }));}}/>
                </span>
                <span>{item.transactionDate}</span>
                <span>{item.storeName}</span>
                <span>{item.itemCount}</span>
                <span className="amount">₩{item.totalAmount?.toLocaleString()} {item.currency}</span>
                <span>
                  <span className={`badge ${item.category}`}>{item.category}</span>
                </span>
                <span className="actions">
                  <span className="edit" onClick={() => {setSelected(item);setEditOpen(true);}}>✏️</span>
                  <span className="delete" onClick={() => handleDeleteClick(item.receiptId)}>🗑️</span>
                </span>
              </div>
            ))
          }
        </div>

        {/* 페이지네이션 */}
        <div className="pagination">
          <button disabled={page===0} onClick={()=>fetchReceipts(page-1)}>{"<"}</button>
          {
            [...Array(totalPages)].map((_,i)=>(
             <button key={i} onClick={()=> fetchReceipts(i)}
               className={ page===i ? "active" : ""}>{i+1}
             </button>
            ))
          }

          <button disabled={page === totalPages-1}
            onClick={()=>fetchReceipts(page+1)}>{">"}
          </button>
        </div>

      </div>
    </div>
  );
}



export default ReceiptListPage;

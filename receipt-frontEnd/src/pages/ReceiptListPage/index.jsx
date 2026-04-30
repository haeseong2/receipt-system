import React, { useEffect, useState } from "react";
import "./style.css";
import { useNavigate } from "react-router-dom";
import { getReceiptList } from "../../api/receiptListApi";
function ReceiptListPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMap, setErrorMap] = useState({});
  
  const today = new Date();

  const [year, setYear] = useState(
    today.getFullYear()
  );

  const [month, setMonth] = useState(
    today.getMonth() + 1
  );

  const [category, setCategory] =
    useState("");

  const [keyword, setKeyword] =
    useState("");

  const [page, setPage] =
    useState(0);

  const [totalPages, setTotalPages] =
    useState(1);

  const [data, setData] =
    useState([]);

  const years = Array.from(
    { length: 15 },
    (_, i) => 2026 + i
  );

  const months = Array.from(
    { length: 12 },
    (_, i) => i + 1
  );

  /* 목록 조회 */
  const fetchReceipts = async (pageNo = 0) => {
    setLoading(true);

    try {
      const res =
      await getReceiptList({
        page:pageNo,
        size:7,
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
        "목록 조회 실패",
        e
      );
    } finally {
    setLoading(false);
    }
  };

  /* 최초 진입 */
  useEffect(() => {
    fetchReceipts(0);
  }, []);

  /* 년월 카테고리 바뀌면 즉시 재조회 */
  useEffect(() => {
    fetchReceipts(0);
  }, [
    year,
    month,
    category
  ]);

  /* 검색 */
  const handleSearch = () => {
    setPage(0);
    fetchReceipts(0);
  };

  return (
    <div className="page">
      <div className="main">

        <h2 className="title">
          영수증 목록
        </h2>

        <p className="sub">
          등록한 영수증을 확인하고
          관리할 수 있습니다.
        </p>

        {/* 필터 */}
        <div className="filter-bar">
          <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
            {years.map(y => (<option key={y} value={y}>{y}년</option>))}
          </select>

          <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
            {months.map(m => (<option key={m} value={m}>{m}월</option>))}
          </select>

          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">
              카테고리
            </option>
            <option value="식비">
              식비
            </option>
            <option value="교통비">
              교통비
            </option>
            <option value="공과금">
              공과금
            </option>
            <option value="쇼핑">
              쇼핑
            </option>
            <option value="기타">
              기타
            </option>
          </select>

          <div className="search-box">
            <input className="search" value={keyword} onChange={(e)=>setKeyword(e.target.value)}
              onKeyDown={(e)=>{
                if(e.key==="Enter"){
                  handleSearch();
                }}}
                placeholder="가맹점명 검색"/>
            <span className="search-icon" onClick={handleSearch}>
              🔍
            </span>
          </div>

          <button className="add-btn" onClick={()=>navigate("/receiptUpload")}>
            + 영수증 등록
          </button>
        </div>

        {/* 테이블 */}
        <div className="table-box">
          <div className="table-header">
            <span>번호</span>
            <span>영수증</span>
            <span>날짜</span>
            <span>가맹점명</span>
            <span>총 금액</span>
            <span>카테고리</span>
            <span>작업</span>
          </div>
          {
            loading ?
            (
              <div className="empty">
                조회 중...
              </div>
            ):
            data.length === 0 ?
            (
              <div className="empty">
                영수증을 등록 해주세요.
              </div>
            ):

            data.map((item,index)=>(
            <div
                key={
                  item.receiptId
                }
                className="table-row">

                <span>{page * 7 + index + 1}</span>
                <span className="receipt-img">
                  <img src={item.imageUrl} className="receipt-thumb"onError={
                    (e) => {setErrorMap((prev) => ({ ...prev, [item.id]: true }));}}/>
                </span>
                <span>{item.transactionDate}</span>
                <span>{item.storeName}</span>
                <span className="amount">₩{item.totalAmount?.toLocaleString()}</span>
                <span>
                  <span className={`badge ${item.category}`}>{item.category}</span>
                </span>
                <span className="actions">✏️/🗑️</span>
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
export default function ReceiptForm({ receipt }) {
  return (
    <div>
      <h2>기본 정보</h2>
      <p>상호명: {receipt.storeName}</p>
      <p>날짜: {receipt.transactionDate}</p>
      <p>총액: {receipt.totalAmount}</p>
      <p>통화: {receipt.currency}</p>
      <p>결제수단: {receipt.paymentMethod}</p>
      <p>OCR 신뢰도: {receipt.ocrConfidence}</p>
    </div>
  );
}
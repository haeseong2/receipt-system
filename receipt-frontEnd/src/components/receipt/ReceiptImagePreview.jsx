export default function ReceiptImagePreview({ imageUrl }) {
  return (
    <div className="image-box">
      <img src={imageUrl} alt="receipt" />
    </div>
  );
}
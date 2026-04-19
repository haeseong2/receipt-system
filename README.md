# 🧾 レシートOCR & LLMデータ抽出システム
レシート画像をアップロードすると、OCRとLLMを組み合わせて  
構造化データ（JSON形式）へ自動変換するWebアプリケーションです。

---

## 🚀 プロジェクト概要
普段の生活でお金の管理がうまくできず、  
「どこにお金を使っているのか分からない」という課題がありました。
その問題を解決するために、  
レシートから自動で支出データを生成し、可視化するシステムを開発しました。
従来のOCRのみでは誤認識が多く、正確なデータ化が難しいため、  
本プロジェクトでは **OCR + LLM を組み合わせることで精度向上を実現**しています。

---

## 🧠 技術的なポイント
### 🔹 OCRの限界をLLMで補完
OCRの誤認識をLLMが文脈ベースで補正し、  
単なる文字認識から**意味理解ベースの解析**へ改善
### 🔹 非構造 → 構造データ変換
自由形式のテキストをLLMで解析し、JSON形式へ自動変換
### 🔹 ユーザー確認フロー
完全自動ではなく、ユーザーが修正できるUIを提供し  
実用性と精度のバランスを確保

---

## 🧩 システム構成
```
React (Frontend)
   ↓
Spring Boot (API Server)
   ↓
Python OCR (Tesseract / PaddleOCR)
   ↓
Spring Boot
   ↓
LLM (Ollama)
   ↓
Database (MySQL)
```

---

## 🔄 処理フロー
1. レシート画像アップロード  
2. OCRでテキスト抽出  
3. LLMでJSON構造へ変換  
4. フロントで確認・修正  
5. DBに保存  

---

## 🛠 使用技術
- Frontend: React  
- Backend: Spring Boot  
- OCR: Tesseract / PaddleOCR  
- LLM: Ollama (Llama系)  
- Language: Java, Python  
- Database: MySQL  

---

## ❗ 課題と解決
### OCRの誤認識
→ LLMによる文脈補正で精度向上  
### レシート形式の違い
→ ルールベースではなくLLMで柔軟に対応  

---

## 📈 今後の改善
- Queue処理導入（非同期化）  
- 精度の定量評価  
- AWS等クラウド環境へのデプロイ  

---

## ▶️ 実行方法
### 1. OCR Server (Python)

```
cd receipt-ocr
pip install -r requirements.txt
python main.py
```

---

### 2. LLM (Ollama)

```
ollama run llama3
```

---

### 3. Backend (Spring Boot)

```
cd receipt-backEnd
./gradlew bootRun
```

---

### 4. Frontend (React)

```
cd receipt-frontEnd
npm install
npm start
```

---

## 💡 このプロジェクトで得たこと
- OCR + LLM連携アーキテクチャ設計  
- 非構造データの構造化処理  
- フルスタック開発経験（React / Spring / Python）  

---

## 📌 まとめ
OCRとLLMを組み合わせることで、  
レシート画像から高精度な構造化データを生成するシステムを構築しました。  
また、個人の支出管理という実生活の課題を技術で解決することを目的としています。

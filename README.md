##🧾 レシートOCR & LLMデータ抽出システム（開発中）   

レシート画像をアップロードすると、   
OCRとLLMを活用して構造化データ（JSON形式）へ変換するWebアプリケーションです。

---

## 🚀 概要

本プロジェクトは、画像のような非構造データを自動で構造化データへ変換することを目的としています。  
OCRでテキストを抽出し、LLMで意味を理解・補正することで高精度なデータ変換を実現しました。

---

## 🧠 システムアーキテクチャ

React (Frontend)  
↓ 画像アップロード  
Spring Boot (APIサーバー)  
↓  
Python OCR (テキスト抽出)  
↓  
Spring Boot  
↓  
LLM (Ollama + llava)  
↓ JSON生成  
Spring Boot  
↓  
Database（保存）

---

## 🔄 処理フロー（具体例）

ユーザーがレシート画像をアップロードした場合の流れです。

1. ユーザーが画像を選択してアップロード  
2. Springサーバーが画像を受信  
3. OCRサーバーでテキストを抽出  

例：

セブンイレブン  
2026/04/13  
合計 1200円  

4. OCR結果と画像をLLMに送信  
5. LLMがJSONデータを生成  

{
  "store": "セブンイレブン",
  "date": "2026-04-13",
  "total": 1200
}

6. フロントで結果を表示し、ユーザーが確認・修正  
7. 「保存」ボタン押下でDBに保存  

---

## 🛠 使用技術

Frontend: React（Node.js）   
Backend: Spring Boot  
OCR: Tesseract / PaddleOCR  
LLM: Ollama（llava）  
Language: Java, Python  
Database: MySQL  

---

## 💡 主な機能

・レシート画像アップロード  
・OCRによるテキスト抽出  
・LLMによるデータ補正・構造化  
・ユーザーによる修正機能  
・データベース保存  

---

## ⚡ 設計のポイント

### OCR + LLMの組み合わせ
OCR単体では誤認識が発生するため、LLMを用いて意味ベースで再解釈し精度を向上させています。

### 画像 + テキストの同時利用
LLMにOCR結果だけでなく元画像も渡すことで、より正確な解析を実現しています。

### ユーザー確認フロー
完全自動ではなくユーザー確認ステップを導入することでデータの信頼性を担保しています。

---

## ❗ 課題と解決

OCRの誤認識  
→ LLMによる補正で対応  

レシート形式の違い  
→ ルールベースではなくLLMによる柔軟な解析で対応  

---

## 📈 今後の改善

・処理速度の最適化  
・キュー処理の導入  
・クラウド環境（AWS等）へのデプロイ  

---

## ▶️ 実行方法

### 1. OCR Server (Python)

cd ocr-server  
pip install -r requirements.txt  
python main.py  

---

### 2. LLM (Ollama)

ollama run llava  

---

### 3. Backend (Spring Boot)

./gradlew bootRun  

---

### 4. Frontend (React)

npm install  
npm start  

---

## 📌 まとめ
OCRとLLMを組み合わせることで、レシート画像から高精度な構造化データを生成するシステムを構築しました。

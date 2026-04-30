## 🚀 プロジェクト概要(開発中)　　

普段の生活でお金の管理がうまくできず、  
「どこにお金を使っているのか分からない」という課題がありました。

その問題を解決するために、  
レシートから自動で支出データを生成し、  
可視化するシステムを開発しました。

従来のOCRのみでは誤認識が多く、  
正確なデータ化が難しいため、本プロジェクトでは   
**OCR + LLM を組み合わせることで精度向上を実現**しています。

---

## 🧠 追加導入・開発予定　　
音声入力機能（WhisperによるSTT）の導入　   
GPT / LLaMAを用いた自然言語解析およびAgent機能の追加　　   
「今月の支出はいくら？」などの自然言語クエリ対応　　  
モーダルUIおよび音声出力（TTS）による結果表示機能の追加　　  
   
---

# 🧾 Receipt OCR × LLM Expense System

レシート画像からOCRでテキストを抽出し、  
LLMを活用して支出データを構造化（JSON化）するWebアプリケーションです。    
OCR単体の誤認識問題をLLMの文脈補正で改善し、  
実用レベルの自動家計管理を実現しています。

---

## 🛠 Tech Stack

Frontend: React  
Backend: Spring Boot (Java)  
OCR Service: PaddleOCR  
AI Model: Ollama (Llama3)  
Database: MySQL  

Infrastructure: Docker / Docker Compose  
CI/CD: GitHub Actions  
Monitoring: Prometheus, Grafana  
STT: Whisper (planned)

---

## ⚙️ Architecture

React (Frontend)  
↓  
Spring Boot (API Server)  
↓  
Python OCR (PaddleOCR)  
↓  
Spring Boot  
↓  
LLM (Ollama)  
↓  
React (Frontend)  
↓  
Spring Boot  
↓  
Database (MySQL)  
  
---

## 🧩 Main Features

- レシート画像アップロード
- OCRによるテキスト抽出
- LLMによる支出データ構造化（JSON変換）
- ユーザー修正UI
- データ保存・履歴管理

---

## 🔄 CI/CD

GitHub Push → GitHub Actions → Docker Build → Auto Deploy

---

## 🐳 Docker

All services are containerized:

- frontend
- backend
- ocr service (Python)
- llm (Ollama)
- mysql
- prometheus
- grafana

---
  
## 📌 まとめ

OCRとLLMを組み合わせることで、  
レシート画像から高精度な構造化データを生成するシステムを構築しました。  

さらにCI/CD・Docker・Monitoringを導入し、  
実務レベルの開発・運用プロセスを意識したアーキテクチャとなっています。

本プロジェクトは個人開発でありながら、  
実務を想定したフルスタック＋DevOps構成を実現しています。

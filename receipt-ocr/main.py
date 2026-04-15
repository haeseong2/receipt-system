from fastapi import FastAPI, File, UploadFile
import shutil
import pytesseract
import cv2
import numpy as np
import uuid
import os

app = FastAPI()

# Tesseract 경로 (본인 환경 맞게 수정)
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# 업로드 폴더
UPLOAD_DIR = "temp/"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)


# =========================
# 유니코드 파일 대응 (핵심)
# =========================
def read_image_unicode(path):
    stream = np.fromfile(path, np.uint8)
    img = cv2.imdecode(stream, cv2.IMREAD_COLOR)
    return img


# =========================
# OCR 함수 (안정화)
# =========================
def extract_text(image_path):
    try:
        img = read_image_unicode(image_path)

        if img is None:
            print("❌ 이미지 로드 실패")
            return ""

        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # 안정화 후 나중에 jpn+eng 붙여도 됨
        text = pytesseract.image_to_string(gray)

        return text

    except Exception as e:
        print("OCR 에러:", e)
        return ""


# =========================
# OCR API
# =========================
@app.post("/ocr")
async def ocr(file: UploadFile = File(...)):
    try:
        # 파일명 무조건 UUID (한글/일본어/영어 안전)
        file_path = UPLOAD_DIR + str(uuid.uuid4()) + ".jpg"

        # 파일 저장
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        print("📥 파일 받음:", file_path)

        # OCR 실행
        text = extract_text(file_path)

        print("===== OCR TEXT =====")
        print(text)

        # 응답 (Spring으로 돌아감)
        return {
            "success": True,
            "text": text
        }

    except Exception as e:
        print("🔥 서버 에러:", e)
        return {
            "success": False,
            "error": str(e)
        }
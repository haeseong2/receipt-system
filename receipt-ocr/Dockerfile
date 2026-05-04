FROM python:3.10-slim

WORKDIR /app

# =========================
# 시스템 라이브러리 (OpenCV + PaddleOCR 필수)
# =========================
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender1 \
    libgomp1 \
    fonts-dejavu \
    curl \
    && rm -rf /var/lib/apt/lists/*

# =========================
# Python dependencies
# =========================
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# (중요) PaddleOCR 캐시 안정화
ENV PYTHONUNBUFFERED=1
ENV PADDLE_HOME=/root/.paddleocr

ENV FLAGS_use_mkldnn=0
ENV FLAGS_enable_pir_api=0

# =========================
# source code
# =========================
COPY . .

# =========================
# run server
# =========================
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
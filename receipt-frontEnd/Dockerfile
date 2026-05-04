FROM node:20

WORKDIR /app

# package 먼저 복사 (캐시 최적화)
COPY package.json package-lock.json ./

RUN npm install

# 전체 소스 복사
COPY . .

# Vite 기본 포트
EXPOSE 3000

# Vite dev 서버 실행 (핵심)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]
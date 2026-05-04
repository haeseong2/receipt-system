import re

# =========================
# 가맹점
# =========================
def extract_store(lines, scores):
    candidates = []

    for t in lines[:10]:
        t = t.strip()

        if len(t) < 3:
            continue

        if re.search(r'\d', t):
            continue

        if any(k in t for k in ["領収", "レシート", "TEL", "電話"]):
            continue

        candidates.append(t)

    if candidates:
        return max(candidates, key=len), 0.9

    return "UNKNOWN", 0.5


# =========================
# 날짜
# =========================
def extract_date(lines, scores):
    txt = " ".join(lines)

    patterns = [
        r'(\d{4})年\s*(\d{1,2})月\s*(\d{1,2})日',
        r'(\d{4})/(\d{1,2})/(\d{1,2})',
        r'(\d{4})-(\d{1,2})-(\d{1,2})'
    ]

    for pat in patterns:
        m = re.search(pat, txt)
        if m:
            y, mth, d = m.groups()
            return f"{y}-{int(mth):02d}-{int(d):02d}", 0.95

    return "", 0.5


# =========================
# 금액 파싱
# =========================
def parse_money(text):
    text = text.replace(",", "").replace("¥", "").replace("円", "")
    nums = re.findall(r'\d+', text)

    vals = []
    for n in nums:
        v = int(n)
        if 50 <= v <= 200000:  # 현실 범위
            vals.append(v)

    return vals


# =========================
# 총금액 (핵심 개선)
# =========================
def extract_total(lines, scores):

    PRIORITY_KEYWORDS = [
        "合計",
        "お買上",
        "ご請求",
        "請求額",
        "総合計"
    ]

    IGNORE_KEYWORDS = [
        "お釣",
        "おつり",
        "釣銭",
        "現金",
        "カード"
    ]

    candidates = []

    for i, t in enumerate(lines):

        # 제외 키워드
        if any(k in t for k in IGNORE_KEYWORDS):
            continue

        # 합계 키워드 발견
        if any(k in t for k in PRIORITY_KEYWORDS):

            # 주변 7줄까지 넓힘
            for j in range(max(0, i - 2), min(len(lines), i + 6)):

                vals = parse_money(lines[j])

                for v in vals:
                    candidates.append((v, 1.0))  # 높은 점수

    # fallback (전체에서 찾기)
    if not candidates:
        for t in lines:
            if any(k in t for k in IGNORE_KEYWORDS):
                continue

            vals = parse_money(t)

            for v in vals:
                candidates.append((v, 0.6))

    if candidates:
        # 가장 큰 값이 아니라 "중간~큰 값" 선택 (오류 방지)
        values = sorted([v for v, _ in candidates])

        # 상위 30% 중 최소값
        cut = int(len(values) * 0.7)
        return values[cut], 0.9

    return 0, 0.3


# =========================
# 통화
# =========================
def extract_currency(lines, scores):
    return "JPY", 0.95


# =========================
# 아이템 수량
# =========================
def extract_item_count(lines):

    for t in lines:
        m = re.search(r'(\d+)\s*点', t)
        if m:
            return int(m.group(1))

    # fallback
    for t in lines:
        nums = re.findall(r'\d+', t)
        for n in nums:
            v = int(n)
            if 1 <= v <= 50:
                return v

    return 0
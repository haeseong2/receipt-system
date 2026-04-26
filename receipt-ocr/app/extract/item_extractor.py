import re


STOP_WORDS = [
    "担当","レジ","小計","合計","お買上",
    "税","対象額","釣り","paypay","領収",
    "カード","ポイント"
]


def looks_like_price(s):
    nums=re.findall(r'\d+',s.replace(",",""))
    if not nums:
        return None

    v=int(nums[-1])

    if 10 <= v <= 5000:
        return v

    return None


def valid_name(t):

    t=t.strip()

    if len(t)<2:
        return False

    if any(k in t for k in STOP_WORDS):
        return False

    if re.search(r'^\d+$',t):
        return False

    if re.search(r'^\*?\d+$',t):
        return False

    if "年" in t and "月" in t:
        return False

    if "点" in t:
        return False

    if "×" in t:
        return False

    return True



def extract_items(lines,scores):

    items=[]

    # 상품영역 시작 추정
    start=0
    for i,t in enumerate(lines):
        if looks_like_price(t):
            start=max(0,i-1)
            break

    # 소계/합계 이전까지
    end=len(lines)

    for i,t in enumerate(lines):
        if (
            "小計" in t
            or "合計" in t
            or "お買上計" in t
        ):
            end=i
            break


    i=start

    while i<end-1:

        name=lines[i].strip()

        if not valid_name(name):
            i+=1
            continue

        price=None

        for j in range(
            i+1,
            min(i+4,end)
        ):

            p=looks_like_price(
                lines[j]
            )

            if p:
                price=p
                break

        if price:
            items.append({
               "name":name,
               "quantity":1,
               "price":price
            })
            i=j+1
            continue

        i+=1


    # 중복 제거
    seen=set()
    clean=[]

    for x in items:
        if x["name"] in seen:
            continue
        seen.add(x["name"])
        clean.append(x)

    return clean[:30],0.94
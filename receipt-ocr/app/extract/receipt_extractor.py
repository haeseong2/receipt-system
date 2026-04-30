import re


def extract_store(lines,scores):

    candidates=[]

    for t in lines[:8]:

        if len(t)<3:
            continue

        if re.search(r'\d',t):
            continue

        if "領収" in t:
            continue

        candidates.append(t)

    if candidates:
        return max(candidates,key=len),0.95

    return "UNKNOWN",0.50



def extract_date(lines,scores):

    txt=" ".join(lines)

    patterns=[
        r'(\d{4})年\s*(\d{1,2})月\s*(\d{1,2})日',
        r'(\d{4})/(\d{1,2})/(\d{1,2})',
        r'(\d{4})-(\d{1,2})-(\d{1,2})'
    ]

    for pat in patterns:

        m=re.search(pat,txt)

        if m:
            y,mn,d=m.groups()

            return (
                f"{y}-{int(mn):02d}-{int(d):02d}",
                0.95
            )

    return "",0.50



def extract_total(lines,scores):

    keywords=[
        "合計",
        "お買上計",
        "総計",
        "請求額",
        "小計"
    ]

    # 1순위 키워드 주변 탐색
    for i,t in enumerate(lines):

        if any(k in t for k in keywords):

            vals=[]

            for j in range(
                i,
                min(i+5,len(lines))
            ):

                nums=re.findall(
                    r'\d+',
                    lines[j].replace(",","")
                )

                for n in nums:

                    v=int(n)

                    if 100<=v<=99999:
                        vals.append(v)

            if vals:
                return max(vals),0.97


    # 2순위 전체 후보 fallback
    vals=[]

    for t in lines:

        nums=re.findall(
            r'\d+',
            t.replace(",","")
        )

        for n in nums:

            v=int(n)

            if 100<=v<=99999:
                vals.append(v)


    if vals:
        return max(vals),0.85


    # 반드시 리턴
    return 0,0.30



def extract_currency(lines,scores):
    return "JPY",0.95



def extract_item_count(lines):

    for t in lines:

        m=re.search(
            r'(\d+)点',
            t
        )

        if m:
            return int(
                m.group(1)
            )

    return 0
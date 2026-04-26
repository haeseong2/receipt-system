import re



def extract_store(lines,scores):

    candidates=[]

    for t in lines[:8]:

        if len(t)<4:
            continue

        if re.search(r'\d',t):
            continue

        if any(
          k in t for k in
          ["領収","担当","レジ"]
        ):
            continue

        candidates.append(t)

    if candidates:
        return max(
          candidates,
          key=len
        ),0.95

    return "UNKNOWN",0.5




def extract_date(lines,scores):

    txt=" ".join(lines)

    p=[
     r'(\d{4})年\s*(\d{1,2})月\s*(\d{1,2})日',
     r'(\d{4})/(\d{1,2})/(\d{1,2})',
     r'(\d{4})-(\d{1,2})-(\d{1,2})'
    ]

    for pat in p:

        m=re.search(
           pat,
           txt
        )

        if m:
            y,mn,d=m.groups()

            return (
             f"{y}-{int(mn):02d}-{int(d):02d}",
             0.95
            )

    return "",0.5




def extract_total(lines,scores):

    keywords=[
      "お買上計",
      "合計",
      "総計",
      "請求額",
      "小計"
    ]

    # 키워드 주변 우선
    for i,t in enumerate(lines):

        if any(
          k in t for k in keywords
        ):

            vals=[]

            for j in range(
                i,
                min(i+4,len(lines))
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
                return str(
                   min(vals)
                ),0.95


    return "0",0.5




def extract_currency(
 lines,
 scores
):
    return "JPY",0.95



def extract_payment(
 lines,
 scores
):

    t=" ".join(lines).lower()

    if "paypay" in t:
        return "PAYPAY_QR",0.95

    if "rakuten" in t:
        return "RAKUTEN_QR",0.95

    if "linepay" in t:
        return "LINEPAY_QR",0.95

    if "visa" in t or "master" in t:
        return "CARD",0.95

    return "OTHER",0.6




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
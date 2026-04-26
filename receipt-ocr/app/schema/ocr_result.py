def build_prompt_text(
store,
date,
total,
currency,
payment,
items,
ocr_confidence,
item_count
):

    txt=f"""
storeName:
{store}

transactionDate:
{date}

totalAmount:
{total}

currency:
{currency}

paymentMethod:
{payment}

itemCount:
{item_count}

items:
"""

    for i in items:
        txt+=f"""

- name:{i['name']}
  quantity:{i['quantity']}
  price:{i['price']}
"""

    txt+=f"""

ocrConfidence:
{ocr_confidence}
"""

    return txt
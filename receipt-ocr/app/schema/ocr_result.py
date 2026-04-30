def build_prompt_text(
    store,
    date,
    total,
    currency,
    confidence,
    item_count
):
    return f"""
storeName:
{store}

transactionDate:
{date}

totalAmount:
{total}

currency:
{currency}

itemCount:
{item_count}

ocrConfidence:
{confidence}
""".strip()
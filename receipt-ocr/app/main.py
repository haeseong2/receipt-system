from fastapi import FastAPI, File, UploadFile
import cv2
import numpy as np

from app.ocr.preprocess import preprocess
from app.ocr.paddle_engine import run_ocr

from app.extract.receipt_extractor import (
    extract_store,
    extract_date,
    extract_total,
    extract_currency,
    extract_item_count
)

from app.schema.ocr_result import build_prompt_text

from app.utils.file_utils import (
    save_upload_file,
    save_result_text
)

app = FastAPI()


def read_image(path):
    stream = np.fromfile(path, np.uint8)
    return cv2.imdecode(stream, cv2.IMREAD_COLOR)


@app.post("/ocr")
async def ocr(file: UploadFile = File(...)):
    try:
        file_path, filename = save_upload_file(file)
        image = read_image(file_path)

        if image is None:
            raise Exception("image load fail")

        image = preprocess(image)
        lines, line_scores = run_ocr(image)
        store, store_score = extract_store(lines, line_scores)
        date, date_score = extract_date(lines, line_scores)
        total, total_score = extract_total(lines, line_scores)
        currency, currency_score = extract_currency(lines,line_scores)
        item_count = extract_item_count(lines)

        print(store, date, total, item_count)

        prompt_text = build_prompt_text(
            store,
            date,
            total,
            currency,
            round(
                (store_score+date_score+total_score+currency_score)/4,
                2
            ),
            item_count
        )
        save_result_text(filename,prompt_text)
        return {
            "success":True,
            "ocrText":prompt_text
        }

    except Exception as e:
        print("ERROR:",str(e))
        import traceback
        traceback.print_exc()

        return {
            "success":False,
            "error":str(e)
        }
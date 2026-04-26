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
    extract_payment,
    extract_item_count
)

from app.extract.item_extractor import extract_items

from app.schema.ocr_result import build_prompt_text

from app.utils.file_utils import (
    save_upload_file,
    save_result_text
)

app = FastAPI()


def read_image(path):
    stream = np.fromfile(
        path,
        np.uint8
    )

    return cv2.imdecode(
        stream,
        cv2.IMREAD_COLOR
    )


@app.post("/ocr")
async def ocr(
    file: UploadFile = File(...)
):
    try:

        # 업로드 저장
        file_path, filename = save_upload_file(
            file
        )
        print("1 upload ok")


        # 이미지 로드
        image = read_image(
            file_path
        )

        if image is None:
            raise Exception(
                "image load fail"
            )

        print("2 image ok")


        # 전처리
        image = preprocess(
            image
        )

        print("3 preprocess ok")


        # OCR
        lines, line_scores = run_ocr(
            image
        )

        print("4 ocr ok")
        print(lines)
        print(line_scores)


        # 기본 정보 추출
        store, store_score = extract_store(
            lines,
            line_scores
        )

        date, date_score = extract_date(
            lines,
            line_scores
        )

        total, total_score = extract_total(
            lines,
            line_scores
        )

        currency, currency_score = extract_currency(
            lines,
            line_scores
        )

        payment, payment_score = extract_payment(
            lines,
            line_scores
        )

        print("5 receipt extract ok")


        # 품목 추출
        items, items_score = extract_items(
            lines,
            line_scores
        )

        item_count = extract_item_count(
            lines
        )

        print("6 item extract ok")


        # 평균 OCR confidence
        scores = [
            store_score,
            date_score,
            total_score,
            currency_score,
            payment_score,
            items_score
        ]

        ocr_confidence = round(
            sum(scores) / len(scores),
            2
        )


        # 최종 prompt 결과 생성
        prompt_text = build_prompt_text(
            store,
            date,
            total,
            currency,
            payment,
            items,
            ocr_confidence,
            item_count
        )


        # result 저장
        save_result_text(
            filename,
            prompt_text
        )

        print("7 result save ok")


        return {
            "success": True,
            "ocrText": prompt_text
        }


    except Exception as e:

        print(
            "ERROR:",
            str(e)
        )

        return {
            "success": False,
            "error": str(e)
        }
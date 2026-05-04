from paddleocr import PaddleOCR

ocr = PaddleOCR(
    lang="japan",
    use_angle_cls=True,
    det_db_box_thresh=0.45,
    det_db_thresh=0.25
)

def run_ocr(image):

    result = ocr.ocr(image, cls=True)

    lines = []
    scores = []

    if not result:
        return [], []

    for block in result:
        for item in block:
            txt = item[1][0].strip()
            sc = float(item[1][1])

            lines.append(txt)
            scores.append(sc)

    return lines, scores
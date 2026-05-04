import os
from datetime import datetime

# 개발 
#TEMP_DIR = "storage/temp"   
#RESULT_DIR = "storage/result"

# 운영
TEMP_DIR = "/app/storage/temp"
RESULT_DIR = "/app/storage/OCR_result"

os.makedirs(
    TEMP_DIR,
    exist_ok=True
)

os.makedirs(
    RESULT_DIR,
    exist_ok=True
)

def make_filename():
    return datetime.now().strftime(
        "%Y%m%d_%H%M%S_%f"
    )

def save_upload_file(file):

    filename = make_filename()

    path = f"{TEMP_DIR}/{filename}.jpg"

    with open(path, "wb") as f:
        f.write(file.file.read())

    return path, filename

def save_result_text(
    filename,
    text
):

    path = f"{RESULT_DIR}/{filename}.txt"

    with open(
        path,
        "w",
        encoding="utf-8"
    ) as f:
        f.write(text)

    return path
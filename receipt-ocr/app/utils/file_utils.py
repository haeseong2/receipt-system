import os
import uuid


TEMP_DIR="storage/temp"
RESULT_DIR="storage/result"

os.makedirs(
    TEMP_DIR,
    exist_ok=True
)

os.makedirs(
    RESULT_DIR,
    exist_ok=True
)


def save_upload_file(file):

    filename=str(uuid.uuid4())

    path=f"{TEMP_DIR}/{filename}.jpg"

    with open(path,"wb") as f:
        f.write(file.file.read())

    return path,filename



def save_result_text(
    filename,
    text
):

    path=f"{RESULT_DIR}/{filename}.txt"

    with open(
        path,
        "w",
        encoding="utf-8"
    ) as f:
        f.write(text)
import cv2

def preprocess(image):
    h,w=image.shape[:2]
    
    if max(h,w)>2200:
        r=2200/max(h,w)
        image=cv2.resize(
            image,
            (int(w*r),int(h*r))
        )

    gray=cv2.cvtColor(
        image,
        cv2.COLOR_BGR2GRAY
    )

    # contrast boost
    gray=cv2.convertScaleAbs(
        gray,
        alpha=1.8,
        beta=10
    )

    blur=cv2.GaussianBlur(
        gray,
        (3,3),
        0
    )

    _,th=cv2.threshold(
        blur,
        150,
        255,
        cv2.THRESH_BINARY+cv2.THRESH_OTSU
    )

    return cv2.cvtColor(
        th,
        cv2.COLOR_GRAY2BGR
    )
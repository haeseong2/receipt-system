import React, { useRef } from "react";
import Webcam from "react-webcam";

const Camera = ({ onCapture }) => {
  const webcamRef = useRef(null);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();

    onCapture({
      id: Date.now(),
      image: imageSrc,
    });
  };

  return (
    <div style={styles.container}>
      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        style={styles.camera}
      />

      <button style={styles.button} onClick={capture}>
        📸 촬영
      </button>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    marginBottom: "20px",
  },
  camera: {
    width: "100%",
    borderRadius: "10px",
  },
  button: {
    marginTop: "10px",
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default Camera;
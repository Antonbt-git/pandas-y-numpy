import React, { useRef, useState } from "react";
import * as tmImage from "@teachablemachine/image";


const MODEL_URL = "/my_model/";

const ImageModel = (): React.ReactElement => {
  const webcamRef = useRef<tmImage.Webcam | null>(null);
  const animationRef = useRef<number | null>(null);

  const [started, setStarted] = useState(false);
  const [predictions, setPredictions] = useState<
    { className: string; probability: number }[]
  >([]);

  const init = async () => {
    try {
      const modelURL = MODEL_URL + "model.json";
      const metadataURL = MODEL_URL + "metadata.json";

      const model = await tmImage.load(
        modelURL,
        metadataURL
      );

      const webcam = new tmImage.Webcam(
        300,
        300,
        true
      );

      await webcam.setup();
      await webcam.play();

      webcamRef.current = webcam;

      const container = document.getElementById(
        "webcam-container"
      );

      if (container) {
        container.innerHTML = "";
        container.appendChild(webcam.canvas);
      }

      setStarted(true);

      const loop = async () => {
        if (!webcamRef.current) return;

        webcamRef.current.update();

        const prediction = await model.predict(
          webcamRef.current.canvas
        );

        setPredictions(prediction);

        animationRef.current =
          window.requestAnimationFrame(loop);
      };

      loop();

    } catch (error) {
      console.error(
        "Error al iniciar el modelo:",
        error
      );

      alert(
        "No se pudo cargar el modelo. Verifica la carpeta my_model."
      );
    }
  };

  const stopCamera = () => {
    if (animationRef.current) {
      window.cancelAnimationFrame(
        animationRef.current
      );
    }

    if (webcamRef.current) {
      webcamRef.current.stop();
      webcamRef.current = null;
    }

    setStarted(false);
    setPredictions([]);

    const container = document.getElementById(
      "webcam-container"
    );

    if (container) {
      container.innerHTML = "";
    }
  };

  return (
    <div>
      <h1>Reconocimiento de Imagen</h1>

      <p
        style={{
          color: "#94a3b8",
          marginBottom: "20px",
        }}
      >
        Utiliza la cámara para reconocer las
        imágenes mediante Machine Learning.
      </p>

      {!started ? (
        <button
          type="button"
          onClick={init}
          style={{
            padding: "12px 25px",
            border: "none",
            borderRadius: "8px",
            background:
              "linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)",
            color: "#ffffff",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Iniciar cámara
        </button>
      ) : (
        <button
          type="button"
          onClick={stopCamera}
          style={{
            padding: "12px 25px",
            border: "1px solid rgba(255, 1, 1, 0.3)",
            borderRadius: "8px",
            background: "rgba(255, 1, 1, 0.2)",
            color: "#ff0101",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "14px",
            marginBottom: "20px",
          }}
        >
          Detener cámara
        </button>
      )}

      <div
        id="webcam-container"
        style={{
          marginTop: "25px",
          display: "flex",
          justifyContent: "center",
        }}
      />

      {started && predictions.length > 0 && (
        <div
          style={{
            marginTop: "25px",
            padding: "20px",
            background: "rgba(15, 23, 42, 0.8)",
            borderRadius: "12px",
            border:
              "1px solid rgba(56, 189, 248, 0.2)",
          }}
        >
          <h3 style={{ marginTop: 0 }}>
            Resultados
          </h3>

          {predictions.map((prediction, index) => (
            <div
              key={index}
              style={{
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "5px",
                }}
              >
                <span>
                  {prediction.className}
                </span>

                <strong>
                  {(
                    prediction.probability * 100
                  ).toFixed(1)}
                  %
                </strong>
              </div>

              <div
                style={{
                  width: "100%",
                  height: "8px",
                  background: "#1e293b",
                  borderRadius: "10px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${
                      prediction.probability * 100
                    }%`,
                    height: "100%",
                    background: "#38bdf8",
                    borderRadius: "10px",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageModel;
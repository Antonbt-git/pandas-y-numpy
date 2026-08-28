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
      <h1 className="tm-title">Reconocimiento de Imagen</h1>

      <p className="tm-lead">
        Utiliza la cámara para reconocer las imágenes mediante Machine Learning.
      </p>

      {!started ? (
        <button type="button" onClick={init} className="tm-btn-start">
          Iniciar cámara
        </button>
      ) : (
        <button type="button" onClick={stopCamera} className="tm-btn-stop">
          Detener cámara
        </button>
      )}

      <div id="webcam-container" className="tm-stage" />

      {started && predictions.length > 0 && (
        <div className="tm-results">
          <h3>Resultados</h3>

          {predictions.map((prediction, index) => (
            <div key={index} className="tm-result-row">
              <div className="tm-result-label">
                <span>{prediction.className}</span>
                <strong>{(prediction.probability * 100).toFixed(1)}%</strong>
              </div>

              <div className="tm-bar-track">
                <div
                  className="tm-bar-fill"
                  style={{ width: `${prediction.probability * 100}%` }}
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

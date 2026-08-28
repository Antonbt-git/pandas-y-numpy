import React, { useRef, useState } from "react";
<<<<<<< HEAD
import * as tf from "@tensorflow/tfjs";
=======
>>>>>>> master
import * as speechCommands from "@tensorflow-models/speech-commands";

const MODEL_URL = `${window.location.origin}/audio_model/`;

type Prediction = {
  label: string;
  probability: number;
};

const AudioModel = (): React.ReactElement => {
  const recognizerRef = useRef<speechCommands.SpeechCommandRecognizer | null>(
    null
  );

  const [started, setStarted] = useState(false);
  const [predictions, setPredictions] = useState<Prediction[]>([]);

  const createModel = async () => {
<<<<<<< HEAD
  const checkpointURL = MODEL_URL + "model.json";
  const metadataURL = MODEL_URL + "metadata.json";

  const recognizer = speechCommands.create(
    "BROWSER_FFT",
    undefined,
    checkpointURL,
    metadataURL
  );

  await recognizer.ensureModelLoaded();

  return recognizer;
};
=======
    const checkpointURL = MODEL_URL + "model.json";
    const metadataURL = MODEL_URL + "metadata.json";

    const recognizer = speechCommands.create(
      "BROWSER_FFT",
      undefined,
      checkpointURL,
      metadataURL
    );

    await recognizer.ensureModelLoaded();

    return recognizer;
  };
>>>>>>> master

  const init = async () => {
    try {
      const recognizer = await createModel();

      recognizerRef.current = recognizer;

      const classLabels = recognizer.wordLabels();

      setPredictions(
        classLabels.map((label) => ({
          label,
          probability: 0,
        }))
      );

      await recognizer.listen(
        (result) => {
<<<<<<< HEAD
          const scores = result.scores;
=======
          // `scores` puede venir como Float32Array (un solo resultado)
          // o como Float32Array[] (resultados en lote). Normalizamos
          // siempre al primer arreglo para poder indexarlo como number[].
          const rawScores = result.scores;
          const scores: Float32Array = Array.isArray(rawScores)
            ? rawScores[0]
            : rawScores;
>>>>>>> master

          setPredictions(
            classLabels.map((label, index) => ({
              label,
<<<<<<< HEAD
              probability: scores[index],
=======
              probability: scores[index] ?? 0,
>>>>>>> master
            }))
          );
        },
        {
          includeSpectrogram: true,
          probabilityThreshold: 0.75,
          invokeCallbackOnNoiseAndUnknown: true,
          overlapFactor: 0.5,
        }
      );

      setStarted(true);
    } catch (error) {
      console.error(
        "Error al iniciar el reconocimiento de audio:",
        error
      );

      alert(
<<<<<<< HEAD
        "No se pudo cargar el modelo de audio. Verifica la carpeta my_model."
=======
        "No se pudo cargar el modelo de audio. Verifica la carpeta audio_model."
>>>>>>> master
      );
    }
  };

  const stopAudio = async () => {
    if (recognizerRef.current) {
      recognizerRef.current.stopListening();
      recognizerRef.current = null;
    }

    setStarted(false);
    setPredictions([]);
  };

  return (
    <div>
<<<<<<< HEAD
      <h1>Reconocimiento de Audio</h1>

      <p
        style={{
          color: "#94a3b8",
          marginBottom: "20px",
        }}
      >
        Habla o reproduce un sonido para que el modelo
        identifique la clase correspondiente.
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
          🎤 Iniciar micrófono
        </button>
      ) : (
        <button
          type="button"
          onClick={stopAudio}
          style={{
            padding: "12px 25px",
            border: "1px solid rgba(255, 1, 1, 0.3)",
            borderRadius: "8px",
            background: "rgba(255, 1, 1, 0.2)",
            color: "#ff0101",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
=======
      <h1 className="tm-title">Reconocimiento de Audio</h1>

      <p className="tm-lead">
        Habla o reproduce un sonido para que el modelo identifique la clase correspondiente.
      </p>

      {!started ? (
        <button type="button" onClick={init} className="tm-btn-start">
          🎤 Iniciar micrófono
        </button>
      ) : (
        <button type="button" onClick={stopAudio} className="tm-btn-stop">
>>>>>>> master
          ⏹ Detener micrófono
        </button>
      )}

      {started && (
<<<<<<< HEAD
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
                marginBottom: "15px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "6px",
                }}
              >
                <span>{prediction.label}</span>

                <strong>
                  {(prediction.probability * 100).toFixed(1)}%
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
                    width: `${prediction.probability * 100}%`,
                    height: "100%",
                    background: "#38bdf8",
                    borderRadius: "10px",
                    transition: "width 0.2s ease",
                  }}
=======
        <div className="tm-results">
          <h3>Resultados</h3>

          {predictions.map((prediction, index) => (
            <div key={index} className="tm-result-row">
              <div className="tm-result-label">
                <span>{prediction.label}</span>
                <strong>{(prediction.probability * 100).toFixed(1)}%</strong>
              </div>

              <div className="tm-bar-track">
                <div
                  className="tm-bar-fill"
                  style={{ width: `${prediction.probability * 100}%` }}
>>>>>>> master
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

<<<<<<< HEAD
export default AudioModel;
=======
export default AudioModel;
>>>>>>> master

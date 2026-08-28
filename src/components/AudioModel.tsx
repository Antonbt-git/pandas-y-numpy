import React, { useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
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
          const scores = result.scores;

          setPredictions(
            classLabels.map((label, index) => ({
              label,
              probability: scores[index],
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
        "No se pudo cargar el modelo de audio. Verifica la carpeta my_model."
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
          ⏹ Detener micrófono
        </button>
      )}

      {started && (
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
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AudioModel;
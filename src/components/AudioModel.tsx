import React, { useRef, useState } from "react";
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
          // `scores` puede venir como Float32Array (un solo resultado)
          // o como Float32Array[] (resultados en lote). Normalizamos
          // siempre al primer arreglo para poder indexarlo como number[].
          const rawScores = result.scores;
          const scores: Float32Array = Array.isArray(rawScores)
            ? rawScores[0]
            : rawScores;

          setPredictions(
            classLabels.map((label, index) => ({
              label,
              probability: scores[index] ?? 0,
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
        "No se pudo cargar el modelo de audio. Verifica la carpeta audio_model."
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
          ⏹ Detener micrófono
        </button>
      )}

      {started && (
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

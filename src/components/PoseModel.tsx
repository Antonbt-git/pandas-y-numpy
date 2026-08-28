import React, { useRef, useState } from "react";
import * as tmPose from "@teachablemachine/pose";

const MODEL_URL = `${window.location.origin}/pose_model/`;

type Prediction = {
  className: string;
  probability: number;
};

const PoseModel = (): React.ReactElement => {
  const webcamRef = useRef<tmPose.Webcam | null>(null);
  const animationRef = useRef<number | null>(null);

  const [started, setStarted] = useState(false);
  const [predictions, setPredictions] = useState<Prediction[]>([]);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const init = async () => {
    try {
      const modelURL = MODEL_URL + "model.json";
      const metadataURL = MODEL_URL + "metadata.json";

      // Cargar modelo
      const model = await tmPose.load(
        modelURL,
        metadataURL
      );

      const maxPredictions = model.getTotalClasses();

      // Configurar cámara
      const size = 300;
      const flip = true;

      const webcam = new tmPose.Webcam(
        size,
        size,
        flip
      );

      await webcam.setup();
      await webcam.play();

      webcamRef.current = webcam;

      if (canvasRef.current) {
        canvasRef.current.width = size;
        canvasRef.current.height = size;
      }

      setPredictions(
        Array.from(
          { length: maxPredictions },
          (_, index) => ({
            className: `Clase ${index + 1}`,
            probability: 0,
          })
        )
      );

      setStarted(true);

      const loop = async () => {
        if (!webcamRef.current) return;

        webcamRef.current.update();

        await predict(model);

        animationRef.current =
          window.requestAnimationFrame(loop);
      };

      loop();

    } catch (error) {
      console.error(
        "Error al iniciar el modelo de postura:",
        error
      );

      alert(
        "No se pudo cargar el modelo de postura. Verifica la carpeta pose_model."
      );
    }
  };

  const predict = async (
    model: tmPose.CustomPoseNet
  ) => {
    if (
      !webcamRef.current ||
      !canvasRef.current
    ) {
      return;
    }

    const {
      pose,
      posenetOutput,
    } = await model.estimatePose(
      webcamRef.current.canvas
    );

    const prediction =
      await model.predict(posenetOutput);

    setPredictions(prediction);

    drawPose(pose);
  };

  const drawPose = (
    pose: tmPose.Pose | undefined
  ) => {
    const canvas = canvasRef.current;

    if (!canvas || !webcamRef.current) {
      return;
    }

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // Dibujar cámara
    ctx.drawImage(
      webcamRef.current.canvas,
      0,
      0
    );

    // Dibujar puntos del cuerpo
    if (pose) {
      const minPartConfidence = 0.5;

      tmPose.drawKeypoints(
        pose.keypoints,
        minPartConfidence,
        ctx
      );

      tmPose.drawSkeleton(
        pose.keypoints,
        minPartConfidence,
        ctx
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
  };

  return (
    <div>
      <h1>Detección de Postura</h1>

      <p
        style={{
          color: "#94a3b8",
          marginBottom: "20px",
        }}
      >
        Utiliza la cámara para detectar tu postura
        corporal mediante Machine Learning.
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
            border:
              "1px solid rgba(255, 1, 1, 0.3)",
            borderRadius: "8px",
            background:
              "rgba(255, 1, 1, 0.2)",
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

      {/* CANVAS */}
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            width: "300px",
            height: "300px",
            borderRadius: "12px",
            background: "#0f172a",
            border:
              "1px solid rgba(56, 189, 248, 0.2)",
          }}
        />
      </div>

      {/* RESULTADOS */}
      {started && predictions.length > 0 && (
        <div
          style={{
            marginTop: "25px",
            padding: "20px",
            background:
              "rgba(15, 23, 42, 0.8)",
            borderRadius: "12px",
            border:
              "1px solid rgba(56, 189, 248, 0.2)",
          }}
        >
          <h3 style={{ marginTop: 0 }}>
            Resultados
          </h3>

          {predictions.map(
            (prediction, index) => (
              <div
                key={index}
                style={{
                  marginBottom: "15px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    marginBottom: "6px",
                  }}
                >
                  <span>
                    {prediction.className}
                  </span>

                  <strong>
                    {(
                      prediction.probability *
                      100
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
                        prediction.probability *
                        100
                      }%`,
                      height: "100%",
                      background: "#38bdf8",
                      borderRadius: "10px",
                    }}
                  />
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default PoseModel;
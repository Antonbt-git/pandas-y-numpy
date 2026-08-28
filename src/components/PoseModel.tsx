import { useEffect, useRef, useState } from "react";
import * as tmPose from "@teachablemachine/pose";
import * as posenet from "@tensorflow-models/posenet";

const MODEL_URL = "/pose_model/";

type Prediction = {
    className: string;
    probability: number;
};

const PoseModel = () => {
    const webcamRef = useRef<tmPose.Webcam | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const animationRef = useRef<number | null>(null);

    const [started, setStarted] = useState(false);
    const [predictions, setPredictions] = useState<Prediction[]>([]);

    const init = async () => {
        try {
            const modelURL = `${MODEL_URL}model.json`;
            const metadataURL = `${MODEL_URL}metadata.json`;

            const model = await tmPose.load(
                modelURL,
                metadataURL
            );

            const maxPredictions =
                model.getTotalClasses();

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
                if (!webcamRef.current) {
                    return;
                }

                webcamRef.current.update();

                try {
                    const { pose, posenetOutput } =
                        await model.estimatePose(
                            webcamRef.current.canvas
                        );

                    const result =
                        await model.predict(
                            posenetOutput
                        );

                    setPredictions(
                        result.map((item) => ({
                            className: item.className,
                            probability:
                                typeof item.probability ===
                                    "number"
                                    ? item.probability
                                    : 0,
                        }))
                    );

                    drawPose(pose);
                } catch (error) {
                    console.error(
                        "Error durante la predicción:",
                        error
                    );
                }

                if (webcamRef.current) {
                    animationRef.current =
                        window.requestAnimationFrame(loop);
                }
            };

            loop();
        } catch (error) {
            console.error(
                "Error al iniciar el modelo de postura:",
                error
            );

            stopCamera();

            alert(
                "No se pudo cargar el modelo de postura. Verifica la carpeta pose_model."
            );
        }
    };

    const drawPose = (
        pose: posenet.Pose | undefined
    ) => {
        const canvas = canvasRef.current;

        if (!canvas || !webcamRef.current) {
            return;
        }

        const ctx = canvas.getContext("2d");

        if (!ctx) {
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(
            webcamRef.current.canvas,
            0,
            0,
            canvas.width,
            canvas.height
        );

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
        if (animationRef.current !== null) {
            window.cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
        }

        if (webcamRef.current) {
            webcamRef.current.stop();
            webcamRef.current = null;
        }

        setStarted(false);
        setPredictions([]);
    };

    useEffect(() => {
        return () => {
            if (animationRef.current !== null) {
                window.cancelAnimationFrame(animationRef.current);
            }

            if (webcamRef.current) {
                webcamRef.current.stop();
            }
        };
    }, []);

    return (
        <div>
            <h1 className="tm-title">Detección de Postura</h1>

            <p className="tm-lead">
                Utiliza la cámara para detectar tu postura corporal mediante Machine Learning.
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

            <div className="tm-stage">
                <canvas ref={canvasRef} className="tm-canvas" />
            </div>

            {started && predictions.length > 0 && (
                <div className="tm-results">
                    <h3>Resultados</h3>

                    {predictions.map((prediction, index) => (
                        <div
                            key={`${prediction.className}-${index}`}
                            className="tm-result-row"
                        >
                            <div className="tm-result-label">
                                <span>{prediction.className}</span>
                                <strong>
                                    {(prediction.probability * 100).toFixed(1)}%
                                </strong>
                            </div>

                            <div className="tm-bar-track">
                                <div
                                    className="tm-bar-fill"
                                    style={{
                                        width: `${Math.min(
                                            Math.max(prediction.probability * 100, 0),
                                            100
                                        )}%`,
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

export default PoseModel;

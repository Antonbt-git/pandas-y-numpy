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

<<<<<<< HEAD
        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );
=======
        ctx.clearRect(0, 0, canvas.width, canvas.height);
>>>>>>> master

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
<<<<<<< HEAD
            window.cancelAnimationFrame(
                animationRef.current
            );

=======
            window.cancelAnimationFrame(animationRef.current);
>>>>>>> master
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
<<<<<<< HEAD
                window.cancelAnimationFrame(
                    animationRef.current
                );
=======
                window.cancelAnimationFrame(animationRef.current);
>>>>>>> master
            }

            if (webcamRef.current) {
                webcamRef.current.stop();
            }
        };
    }, []);

    return (
        <div>
<<<<<<< HEAD
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
=======
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
>>>>>>> master
                    Detener cámara
                </button>
            )}

<<<<<<< HEAD
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
                                key={`${prediction.className}-${index}`}
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
                                            width: `${Math.min(
                                                Math.max(
                                                    prediction.probability *
                                                    100,
                                                    0
                                                ),
                                                100
                                            )}%`,
                                            height: "100%",
                                            background: "#38bdf8",
                                            borderRadius: "10px",
                                        }}
                                    />
                                </div>
                            </div>
                        )
                    )}
=======
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
>>>>>>> master
                </div>
            )}
        </div>
    );
};

<<<<<<< HEAD
export default PoseModel;
=======
export default PoseModel;
>>>>>>> master

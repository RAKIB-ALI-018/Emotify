import { useEffect, useRef, useState } from "react";
import { init } from "../utils/utils";

export default function FaceExpression() {
    const videoRef = useRef(null);
    const landmarkerRef = useRef(null);
    const animationRef = useRef(null);
    const streamRef = useRef(null);
    const cancelledRef = useRef(false);

    const [expression, setExpression] = useState("Detecting...");
    const [scores, setScores] = useState(null);

    useEffect(() => {
        cancelledRef.current = false;

        init({
            landmarkerRef,
            videoRef,
            animationRef,
            streamRef,
            cancelledRef,
            setExpression,
            setScores,
        });

        return () => {
            cancelledRef.current = true;

            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }

            if (landmarkerRef.current) {
                landmarkerRef.current.close();
            }

            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
            } else if (videoRef.current?.srcObject) {
                videoRef.current.srcObject
                    .getTracks()
                    .forEach((track) => track.stop());
            }
        };
    }, []);

    return (
        <div style={{ textAlign: "center" }}>
            <video
                ref={videoRef}
                style={{ width: "400px", borderRadius: "12px" }}
                playsInline
            />
            <h2>{expression}</h2>

            {scores && (
                <div
                    style={{
                        display: "inline-block",
                        textAlign: "left",
                        fontFamily: "monospace",
                        fontSize: "14px",
                        background: "#111",
                        color: "#0f0",
                        padding: "10px 16px",
                        borderRadius: "8px",
                        marginTop: "8px",
                    }}
                >
                    <div>Happy: {scores.happyScore.toFixed(2)}</div>
                    <div>Surprised: {scores.surprisedScore.toFixed(2)}</div>
                    <div>Sad: {scores.sadScore.toFixed(2)}</div>
                </div>
            )}
        </div>
    );
}
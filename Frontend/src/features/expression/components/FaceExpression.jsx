// 

import { useEffect, useRef, useState } from "react";
import { init } from "../utils/utils";
import { useSong } from "../../home/hooks/useSong";
import "../styles/faceExpression.scss";

// backend only accepts these three moods — map detected scores to one of them
function getTopMood(scores) {
    if (!scores) return null;

    const entries = [
        { mood: "Happy", value: scores.happyScore },
        { mood: "Sad", value: scores.sadScore },
        { mood: "Surprised", value: scores.surprisedScore },
    ];

    entries.sort((a, b) => b.value - a.value);
    return entries[0].mood;
}

export default function FaceExpression() {
    const videoRef = useRef(null);
    const landmarkerRef = useRef(null);
    const animationRef = useRef(null);
    const streamRef = useRef(null);
    const cancelledRef = useRef(false);

    const [expression, setExpression] = useState("Detecting...");
    const [scores, setScores] = useState(null);

    const { loading, handleGetSong } = useSong();

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

    const topMood = getTopMood(scores);

    const handleDetectClick = () => {
        if (!topMood) return;
        handleGetSong({ mood: topMood });
    };

    return (
        <div className="face-card">
            <div className="face-card__video-wrap">
                <video
                    ref={videoRef}
                    className="face-card__video"
                    playsInline
                />
                <span className="face-card__badge">{expression}</span>
            </div>

            {scores && (
                <div className="face-card__scores">
                    <div className="face-card__score-row">
                        <span className="face-card__score-label">Happy</span>
                        <div className="face-card__score-track">
                            <div
                                className="face-card__score-fill face-card__score-fill--happy"
                                style={{ width: `${scores.happyScore * 100}%` }}
                            />
                        </div>
                        <span className="face-card__score-value">{scores.happyScore.toFixed(2)}</span>
                    </div>

                    <div className="face-card__score-row">
                        <span className="face-card__score-label">Surprised</span>
                        <div className="face-card__score-track">
                            <div
                                className="face-card__score-fill face-card__score-fill--surprised"
                                style={{ width: `${scores.surprisedScore * 100}%` }}
                            />
                        </div>
                        <span className="face-card__score-value">{scores.surprisedScore.toFixed(2)}</span>
                    </div>

                    <div className="face-card__score-row">
                        <span className="face-card__score-label">Sad</span>
                        <div className="face-card__score-track">
                            <div
                                className="face-card__score-fill face-card__score-fill--sad"
                                style={{ width: `${scores.sadScore * 100}%` }}
                            />
                        </div>
                        <span className="face-card__score-value">{scores.sadScore.toFixed(2)}</span>
                    </div>
                </div>
            )}

            <button
                className="face-card__detect-btn"
                onClick={handleDetectClick}
                disabled={!topMood || loading}
            >
                {loading ? "Finding a song..." : `Play a song for "${topMood ?? "..."}" mood`}
            </button>
        </div>
    );
}
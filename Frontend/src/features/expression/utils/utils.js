import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

// Minimum score an expression needs before we trust it over Neutral.
const MIN_CONFIDENCE = 0.25;

/**
 * Loads the MediaPipe FaceLandmarker model, starts the webcam stream,
 * and kicks off the detect() loop. All mutable state lives in refs
 * passed via `ctx` so it survives across renders and across the
 * init -> detect recursive calls.
 *
 * ctx = {
 *   landmarkerRef, videoRef, animationRef, streamRef, cancelledRef,
 *   setExpression, setScores
 * }
 */
export const init = async (ctx) => {
    const { landmarkerRef, videoRef, streamRef, cancelledRef } = ctx;

    const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );

    if (cancelledRef.current) return;

    landmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
            modelAssetPath:
                "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
        },
        outputFaceBlendshapes: true,
        runningMode: "VIDEO",
        numFaces: 1,
    });

    if (cancelledRef.current) return;

    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    streamRef.current = stream;

    if (cancelledRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
    }

    videoRef.current.srcObject = stream;

    try {
        await videoRef.current.play();
    } catch (err) {
        // StrictMode double-invokes effects in dev, which can interrupt
        // an in-flight play() with a harmless AbortError. Ignore it.
        if (err.name !== "AbortError") {
            console.error("Video play failed:", err);
        }
    }

    if (!cancelledRef.current) detect(ctx);
};

/**
 * Runs one detection pass, updates expression + debug scores, then
 * schedules itself again via requestAnimationFrame.
 */
export const detect = (ctx) => {
    const {
        landmarkerRef,
        videoRef,
        animationRef,
        cancelledRef,
        setExpression,
        setScores,
    } = ctx;

    if (cancelledRef.current) return;
    if (!landmarkerRef.current || !videoRef.current) return;

    const video = videoRef.current;

    // Video not ready yet (no frame data) - skip this frame, try again
    // next animation frame instead of calling detectForVideo prematurely.
    if (video.readyState < 2) {
        animationRef.current = requestAnimationFrame(() => detect(ctx));
        return;
    }

    // MediaPipe requires strictly increasing timestamps. Re-running the
    // same video frame (or StrictMode double-invoking effects) can send
    // a timestamp that isn't greater than the last one, which throws.
    ctx.lastVideoTimeRef = ctx.lastVideoTimeRef || { current: -1 };
    if (video.currentTime === ctx.lastVideoTimeRef.current) {
        animationRef.current = requestAnimationFrame(() => detect(ctx));
        return;
    }
    ctx.lastVideoTimeRef.current = video.currentTime;

    let results;
    try {
        results = landmarkerRef.current.detectForVideo(video, performance.now());
    } catch (err) {
        console.error("detectForVideo failed:", err);
        animationRef.current = requestAnimationFrame(() => detect(ctx));
        return;
    }

    if (results.faceBlendshapes?.length > 0) {
        const blendshapes = results.faceBlendshapes[0].categories;

        const getScore = (name) =>
            blendshapes.find((b) => b.categoryName === name)?.score || 0;

        const smileLeft = getScore("mouthSmileLeft");
        const smileRight = getScore("mouthSmileRight");
        const jawOpen = getScore("jawOpen");
        const browUp = getScore("browInnerUp");
        const eyeWideLeft = getScore("eyeWideLeft");
        const eyeWideRight = getScore("eyeWideRight");
        const browDownLeft = getScore("browDownLeft");
        const browDownRight = getScore("browDownRight");
        const frownLeft = getScore("mouthFrownLeft");
        const frownRight = getScore("mouthFrownRight");
        const mouthLowerDownLeft = getScore("mouthLowerDownLeft");
        const mouthLowerDownRight = getScore("mouthLowerDownRight");

        // A confidence score per expression, using the average of the
        // strongest supporting signals rather than requiring every single
        // blendshape to individually clear a high bar. This is far more
        // forgiving of asymmetric faces / camera angles.
        const happyScore = (smileLeft + smileRight) / 2;

        const surprisedScore =
            (jawOpen + browUp + (eyeWideLeft + eyeWideRight) / 2) / 3;

        const sadScore =
            (Math.max(frownLeft, frownRight) +
                Math.max(browDownLeft, browDownRight) +
                Math.max(mouthLowerDownLeft, mouthLowerDownRight)) /
            3;

        setScores({ happyScore, surprisedScore, sadScore });

        // Pick whichever expression scores highest, as long as it clears
        // the minimum confidence bar. Otherwise stay Neutral.
        const candidates = [
            { label: "Happy 😄", score: happyScore },
            { label: "Surprised 😮", score: surprisedScore },
            { label: "Sad 😢", score: sadScore },
        ];

        const best = candidates.reduce((a, b) => (b.score > a.score ? b : a));

        setExpression(best.score > MIN_CONFIDENCE ? best.label : "Neutral");
    }

    animationRef.current = requestAnimationFrame(() => detect(ctx));
};
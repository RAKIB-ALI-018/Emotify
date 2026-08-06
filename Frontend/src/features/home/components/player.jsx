import { useEffect, useRef, useState } from "react";
import {useSong} from "../hooks/useSong";
import "../styles/player.scss";

const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const Player = () => {
    const { song, loading, handleGetSong } = useSong();
    const audioRef = useRef(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(1);

    // whenever the song changes, reset playback state
    useEffect(() => {
        setIsPlaying(false);
        setProgress(0);
        setCurrentTime(0);

        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    }, [song?.url]);

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        const audio = audioRef.current;
        if (!audio) return;

        setCurrentTime(audio.currentTime);
        setProgress((audio.currentTime / audio.duration) * 100 || 0);
    };

    const handleLoadedMetadata = () => {
        setDuration(audioRef.current?.duration || 0);
    };

    const handleSeek = (e) => {
        const audio = audioRef.current;
        if (!audio) return;

        const newTime = (e.target.value / 100) * duration;
        audio.currentTime = newTime;
        setProgress(e.target.value);
    };

    const handleVolumeChange = (e) => {
        const newVolume = e.target.value / 100;
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };

    const handleEnded = () => {
        setIsPlaying(false);
        setProgress(0);
        setCurrentTime(0);
    };

    // fetch another song matching the same mood (acts like "shuffle next")
    const playNextInMood = () => {
        if (song?.mood) {
            handleGetSong({ mood: song.mood });
        }
    };

    if (loading) {
        return (
            <div className="player player--empty">
                <p>Loading song...</p>
            </div>
        );
    }

    if (!song) {
        return (
            <div className="player player--empty">
                <p>No song selected</p>
            </div>
        );
    }

    return (
        <div className="player">
            <audio
                ref={audioRef}
                src={song.url}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleEnded}
            />

            <div className="player__track">
                <img
                    className="player__poster"
                    src={song.postUrl}
                    alt={song.title}
                />
                <div className="player__meta">
                    <h3 className="player__title">{song.title}</h3>
                    {song.mood && <span className="player__mood">{song.mood}</span>}
                </div>
            </div>

            <div className="player__progress">
                <span className="player__time">{formatTime(currentTime)}</span>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress || 0}
                    onChange={handleSeek}
                    className="player__seekbar"
                    style={{ "--progress": `${progress || 0}%` }}
                />
                <span className="player__time">{formatTime(duration)}</span>
            </div>

            <div className="player__controls">
                <button
                    className="player__control-btn"
                    onClick={playNextInMood}
                    aria-label="Next"
                    title="Play another song in this mood"
                >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M16 6h2v12h-2zM6 18l8.5-6L6 6z" />
                    </svg>
                </button>

                <button
                    className="player__play-btn"
                    onClick={togglePlay}
                    aria-label={isPlaying ? "Pause" : "Play"}
                >
                    {isPlaying ? (
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6 5h4v14H6zm8 0h4v14h-4z" />
                        </svg>
                    ) : (
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    )}
                </button>
            </div>

            <div className="player__volume">
                <svg viewBox="0 0 24 24" fill="currentColor" className="player__volume-icon">
                    <path d="M3 10v4h4l5 5V5L7 10H3zm13.5 2A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                </svg>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume * 100}
                    onChange={handleVolumeChange}
                    className="player__volume-bar"
                />
            </div>
        </div>
    );
};

export default Player;
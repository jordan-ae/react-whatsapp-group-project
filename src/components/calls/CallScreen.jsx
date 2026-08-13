import { useEffect, useRef, useState } from "react";
import Avatar from "../common/Avatar";
import { formatDuration } from "../../utils/formatDate";
import "./CallScreen.css";

export default function CallScreen({ contact, type, onEnd }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);

  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [duration, setDuration] = useState(0);
  const [status, setStatus] = useState("Ringing...");
  const [mainVideo, setMainVideo] = useState("remote");

  useEffect(() => {
    let mounted = true;
    let connectTimer;

    const startCall = async () => {
      try {
        const constraints =
          type === "video" ? { video: true, audio: true } : { audio: true };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);

        if (!mounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;

        // Your camera
        if (type === "video" && videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        setStatus("Connecting...");

        connectTimer = setTimeout(() => {
          if (!mounted) return;

          setStatus("Connected");

          timerRef.current = setInterval(() => {
            setDuration((prev) => prev + 1);
          }, 1000);
        }, 1000);
      } catch (error) {
        console.error("Call media access failed:", error);

        setStatus(
          type === "video"
            ? "Camera or microphone access denied"
            : "Microphone access denied",
        );
      }
    };

    startCall();

    return () => {
      mounted = false;

      clearTimeout(connectTimer);
      clearInterval(timerRef.current);

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, [type]);

  const handleMute = () => {
    const audioTrack = streamRef.current?.getAudioTracks()[0];

    if (audioTrack) {
      audioTrack.enabled = isMuted;
    }

    setIsMuted((prev) => !prev);
  };

  const handleCameraToggle = () => {
    const videoTrack = streamRef.current?.getVideoTracks()[0];

    if (!videoTrack) return;

    videoTrack.enabled = !isCameraOn;

    setIsCameraOn((prev) => !prev);
  };

  const handleEndCall = () => {
    clearInterval(timerRef.current);

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });

      streamRef.current = null;
    }

    onEnd({
      type,
      durationSeconds: duration,
      answered: status === "Connected",
    });
  };

  return (
    <div className={`call-screen call-screen--${type}`}>
      {type === "video" ? (
        <div className="call-screen__video-stage">
          {/* Sarah's video / main area */}
          <div
            className={`call-screen__remote-video ${
              mainVideo === "remote"
                ? "call-screen__main-video"
                : "call-screen__small-video"
            }`}
            onClick={() => setMainVideo("remote")}
          >
            <Avatar name={contact.name} size="xl" />

            <h2>{contact.name}</h2>
            <p>{contact.online ? "Connected" : "Offline"}</p>
          </div>

          {/* Your camera */}
          <div
            className={`call-screen__self-view ${
              mainVideo === "self"
                ? "call-screen__main-video"
                : "call-screen__small-video"
            }`}
            onClick={() => setMainVideo("self")}
          >
            {isCameraOn ? (
              <video ref={videoRef} autoPlay playsInline muted />
            ) : (
              <div className="call-screen__self-camera-off">Camera off</div>
            )}
          </div>
        </div>
      ) : (
        <div className="call-screen__voice">
          <Avatar name={contact.name} size="xl" />
        </div>
      )}

      {/* CALL INFORMATION */}
      <div className="call-screen__info">
        <h2>{contact.name}</h2>

        <p>{type === "video" ? "Video call" : "Voice call"}</p>

        <p>{status}</p>

        {status === "Connected" && <span>{formatDuration(duration)}</span>}
      </div>

      {/* CONTROLS */}
      <div className="call-screen__controls">
        <button onClick={handleMute}>{isMuted ? "Unmute" : "Mute"}</button>

        {type === "video" && (
          <button onClick={handleCameraToggle}>
            {isCameraOn ? "Camera off" : "Camera on"}
          </button>
        )}

        <button className="call-screen__end" onClick={handleEndCall}>
          End call
        </button>
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Avatar from "../common/Avatar";
import { formatDuration } from "../../utils/formatDate";
import "./CallScreen.css";

export default function CallScreen({ contact, type, onEnd }) {
  const mainVideoRef = useRef(null);
  const smallVideoRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);

  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [duration, setDuration] = useState(0);
  const [status, setStatus] = useState("Ringing...");
  const [isSelfMain, setIsSelfMain] = useState(true);

  useEffect(() => {
    let mounted = true;

    const startCall = async () => {
      try {
        const constraints =
          type === "video"
            ? {
                video: true,
                audio: true,
              }
            : {
                audio: true,
              };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);

        if (!mounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;

        // Attach the same stream to both video elements
        if (mainVideoRef.current) {
          mainVideoRef.current.srcObject = stream;
        }

        if (smallVideoRef.current) {
          smallVideoRef.current.srcObject = stream;
        }

        setStatus("Connecting...");

        setTimeout(() => {
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

      clearInterval(timerRef.current);

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
        });

        streamRef.current = null;
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

    videoTrack.enabled = !videoTrack.enabled;

    setIsCameraOn(videoTrack.enabled);
  };

  const handleSwitch = () => {
    setIsSelfMain((prev) => !prev);
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

  const callUI = (
    <div className={`call-screen call-screen--${type}`}>
      {type === "video" ? (
        <div className="call-screen__video-stage">
          {/* =========================
              YOUR CAMERA
          ========================= */}

          <div
            className={`call-screen__self-video ${
              isSelfMain ? "is-main" : "is-small"
            }`}
            onClick={handleSwitch}
          >
            <video
              ref={mainVideoRef}
              className="call-screen__camera-video"
              autoPlay
              playsInline
              muted
            />

            {!isCameraOn && (
              <div className="call-screen__camera-off">
                <Avatar name="You" size={isSelfMain ? "xl" : "lg"} />
                <span>Camera off</span>
              </div>
            )}
          </div>

          {/* =========================
              SARAH
          ========================= */}

          <div
            className={`call-screen__remote-video ${
              isSelfMain ? "is-small" : "is-main"
            }`}
            onClick={handleSwitch}
          >
            <Avatar name={contact.name} size={isSelfMain ? "lg" : "xl"} />

            <h2>{contact.name}</h2>

            <p>Video call</p>
          </div>
        </div>
      ) : (
        <div className="call-screen__voice">
          <Avatar name={contact.name} size="xl" />
        </div>
      )}

      {/* =========================
          CALL INFO
      ========================= */}

      <div className="call-screen__info">
        <h2>{contact.name}</h2>

        <p>{type === "video" ? "Video call" : "Voice call"}</p>

        <p>{status}</p>

        {status === "Connected" && <span>{formatDuration(duration)}</span>}
      </div>

      {/* =========================
          CONTROLS
      ========================= */}

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

  return createPortal(callUI, document.body);
}

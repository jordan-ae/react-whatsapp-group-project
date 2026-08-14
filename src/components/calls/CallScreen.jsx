import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Avatar from "../common/Avatar";
import Modal from "../common/Modal";
import { formatDuration } from "../../utils/formatDate";
import "./CallScreen.css";

export default function CallScreen({
  contact,
  type = "voice",
  contacts = [],
  onEnd,
  connected = false,
}) {
  const initialParticipants = useMemo(() => {
    if (!contact) return [];

    if (Array.isArray(contact)) {
      return contact;
    }

    return [contact];
  }, [contact]);

  const [participants, setParticipants] = useState(
    initialParticipants
  );

  const mainVideoRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);

  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [duration, setDuration] = useState(0);
  const [isSelfMain, setIsSelfMain] = useState(true);
  const [isParticipantModalOpen, setIsParticipantModalOpen] =
    useState(false);

  const mainContact = participants[0] || contact;

  const [status, setStatus] = useState(
    mainContact?.online ? "Ringing..." : "Calling..."
  );

  /*
   * Attach the current stream whenever a video
   * element is mounted.
   */
  const attachVideo = (node) => {
    mainVideoRef.current = node;

    if (node && streamRef.current) {
      node.srcObject = streamRef.current;
    }
  };

  /*
   * Start local microphone/camera.
   */
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

        const stream =
          await navigator.mediaDevices.getUserMedia(
            constraints
          );

        if (!mounted) {
          stream.getTracks().forEach((track) => {
            track.stop();
          });

          return;
        }

        streamRef.current = stream;

        /*
         * Attach the stream to the video if it already exists.
         */
        if (mainVideoRef.current) {
          mainVideoRef.current.srcObject = stream;
        }

        /*
         * Getting camera/microphone permission does NOT
         * mean that the other person answered.
         */
        setStatus(
          mainContact?.online
            ? "Ringing..."
            : "Calling..."
        );
      } catch (error) {
        console.error(
          "Call media access failed:",
          error
        );

        setStatus(
          type === "video"
            ? "Camera or microphone access denied"
            : "Microphone access denied"
        );
      }
    };

    startCall();

    return () => {
      mounted = false;

      clearInterval(timerRef.current);

      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach((track) => track.stop());

        streamRef.current = null;
      }
    };
  }, [type]);

  /*
   * Handle real call connection state.
   */
  useEffect(() => {
    clearInterval(timerRef.current);

    if (connected) {
      setStatus("Connected");

      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);

      return () => {
        clearInterval(timerRef.current);
      };
    }

    setDuration(0);

    setStatus(
      mainContact?.online
        ? "Ringing..."
        : "Calling..."
    );

    return () => {
      clearInterval(timerRef.current);
    };
  }, [connected, mainContact]);

  /*
   * Mute / unmute microphone.
   */
  const handleMute = () => {
    const audioTrack =
      streamRef.current?.getAudioTracks()[0];

    if (!audioTrack) return;

    const nextMuted = !isMuted;

    audioTrack.enabled = !nextMuted;

    setIsMuted(nextMuted);
  };

  /*
   * Turn camera off/on.
   *
   * IMPORTANT:
   * We do NOT stop the track.
   * We only disable/enable it.
   */
  const handleCameraToggle = () => {
  const videoTrack = streamRef.current?.getVideoTracks()[0];

  if (!videoTrack) return;

  videoTrack.enabled = !videoTrack.enabled;

  setIsCameraOn(videoTrack.enabled);
};

  /*
   * Switch between your camera and the contact.
   */
  const handleSwitch = () => {
    setIsSelfMain((prev) => !prev);
  };

  /*
   * Only show contacts that aren't already
   * participating in the call.
   */
  const availableParticipants = useMemo(() => {
    return contacts.filter((candidate) => {
      if (!candidate?.id) return false;

      return !participants.some(
        (participant) =>
          participant?.id === candidate.id
      );
    });
  }, [contacts, participants]);

  /*
   * Add participant.
   */
  const handleAddParticipant = (candidate) => {
    if (!candidate?.id) return;

    setParticipants((prev) => {
      const alreadyExists = prev.some(
        (participant) =>
          participant?.id === candidate.id
      );

      if (alreadyExists) {
        return prev;
      }

      return [...prev, candidate];
    });

    setIsParticipantModalOpen(false);
  };

  /*
   * End call.
   */
  const handleEndCall = () => {
    clearInterval(timerRef.current);

    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => track.stop());

      streamRef.current = null;
    }

    onEnd?.({
      type,
      durationSeconds: duration,
      answered: connected,
      participants,
    });
  };

  const callUI = (
    <div className={`call-screen call-screen--${type}`}>
      {type === "video" ? (
        <div className="call-screen__video-stage">

          {/* =========================
              CONTACT MAIN
          ========================= */}

          {!isSelfMain && (
            <button
              type="button"
              className="call-screen__remote-button call-screen__remote-button--main"
              onClick={handleSwitch}
              aria-label={`Make ${mainContact?.name || "contact"} the small view`}
            >
              <div className="call-screen__remote call-screen__remote--main">
                <Avatar
                  name={mainContact?.name || "Contact"}
                  size="xl"
                />

                <h2>
                  {mainContact?.name || "Contact"}
                </h2>

                <p>
                  {connected
                    ? "Connected"
                    : type === "video"
                    }
                </p>
              </div>
            </button>
          )}

          {/* =========================
              SELF VIDEO
          ========================= */}

          <button
            type="button"
            className={`call-screen__self ${
              isSelfMain
                ? "call-screen__self--main"
                : "call-screen__self--small"
            }`}
            onClick={handleSwitch}
            aria-label={
              isSelfMain
                ? "Make your video the small view"
                : "Make your video the main view"
            }
          >
            {/* Keep video mounted at all times */}
            <video
              ref={attachVideo}
              className="call-screen__camera"
              autoPlay
              playsInline
              muted
            />

            {!isCameraOn && (
  <div className="call-screen__camera-off">
    <Avatar name="You" size="xl" />
  </div>
)}
          </button>

          {/* =========================
              CONTACT SMALL
          ========================= */}

          {isSelfMain && (
            <button
              type="button"
              className="call-screen__remote-button call-screen__remote-button--small"
              onClick={handleSwitch}
              aria-label={`Make ${mainContact?.name || "contact"} the main view`}
            >
              <div className="call-screen__remote call-screen__remote--small">
                <Avatar
                  name={mainContact?.name || "Contact"}
                  size="lg"
                />
              </div>
            </button>
          )}
        </div>
      ) : (
        <div className="call-screen__voice">
          <Avatar
            name={mainContact?.name || "Contact"}
            size="xl"
          />
        </div>
      )}

      {/* =========================
          CALL INFORMATION
      ========================= */}

      <div className="call-screen__info">
        <h2>
          {mainContact?.name || "Contact"}

          {participants.length > 1 &&
            ` + ${participants.length - 1}`}
        </h2>

        <p>{status}</p>

        {connected && (
          <span>
            {formatDuration(duration)}
          </span>
        )}
      </div>

      {/* =========================
          PARTICIPANTS
      ========================= */}

      {participants.length > 1 && (
        <div className="call-screen__participants">
          {participants.map((participant) => (
            <div
              key={participant.id}
              className="call-screen__participant"
            >
              <Avatar
                name={participant.name}
                size="sm"
              />

              <span>{participant.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* =========================
          CONTROLS
      ========================= */}

      <div className="call-screen__controls">
        <button
          type="button"
          onClick={handleMute}
          aria-label={
            isMuted
              ? "Unmute microphone"
              : "Mute microphone"
          }
        >
          {isMuted ? "Unmute" : "Mute"}
        </button>

        {type === "video" && (
          <button
            type="button"
            onClick={handleCameraToggle}
            aria-label={
              isCameraOn
                ? "Turn camera off"
                : "Turn camera on"
            }
          >
            {isCameraOn
              ? "Camera off"
              : "Camera on"}
          </button>
        )}

        <button
          type="button"
          onClick={() =>
            setIsParticipantModalOpen(true)
          }
          aria-label="Add participant"
        >
          Add
        </button>

        <button
          type="button"
          className="call-screen__end"
          onClick={handleEndCall}
          aria-label="End call"
        >
          End call
        </button>
      </div>

      {/* =========================
          ADD PARTICIPANT MODAL
      ========================= */}

      <Modal
        isOpen={isParticipantModalOpen}
        onClose={() =>
          setIsParticipantModalOpen(false)
        }
        title="Add participant"
      >
        {availableParticipants.length === 0 ? (
          <div className="call-screen__no-contacts">
            <p>
              There are no other contacts available
              to add.
            </p>
          </div>
        ) : (
          <div className="call-screen__contact-list">
            {availableParticipants.map(
              (candidate) => (
                <button
                  type="button"
                  key={candidate.id}
                  className="call-screen__contact"
                  onClick={() =>
                    handleAddParticipant(candidate)
                  }
                >
                  <Avatar
                    name={candidate.name}
                    size="md"
                  />

                  <span>
                    {candidate.name}
                  </span>

                  <span className="call-screen__add-label">
                    Add
                  </span>
                </button>
              )
            )}
          </div>
        )}
      </Modal>
    </div>
  );

  return createPortal(
    callUI,
    document.body
  );
}
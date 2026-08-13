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
  /* PARTICIPANTS*/

  const initialParticipants = useMemo(() => {
    if (!contact) return [];

    if (Array.isArray(contact)) {
      return contact;
    }

    return [contact];
  }, [contact]);

  const [participants, setParticipants] = useState(initialParticipants);

  /* VIDEO / MEDIA REFS*/

  const mainVideoRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const connectTimerRef = useRef(null);

  /*STATE*/

  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [duration, setDuration] = useState(0);

  const [status, setStatus] = useState(
    initialParticipants[0]?.online ? "Ringing..." : "Calling...",
  );

  const [isSelfMain, setIsSelfMain] = useState(true);

  const [isParticipantModalOpen, setIsParticipantModalOpen] = useState(false);

  /* START LOCAL MEDIA*/

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
          stream.getTracks().forEach((track) => {
            track.stop();
          });

          return;
        }

        streamRef.current = stream;

        if (type === "video" && mainVideoRef.current) {
          mainVideoRef.current.srcObject = stream;
        }

        /* Local media permission does NOT mean
          that the remote person answered.
          We therefore keep the call as
          Calling/Ringing until a real connection
          is supplied through the `connected` prop.
         */

        if (initialParticipants[0]?.online) {
          setStatus("Ringing...");
        } else {
          setStatus("Calling...");
        }
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
      clearTimeout(connectTimerRef.current);

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
        });

        streamRef.current = null;
      }
    };
  }, [type, initialParticipants]);

  /* REAL CONNECTION STATE,
    `connected` should eventually come from the
    WebRTC/signaling layer.
   */

  useEffect(() => {
    if (!connected) {
      clearInterval(timerRef.current);
      setDuration(0);

      return;
    }

    setStatus("Connected");

    clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timerRef.current);
    };
  }, [connected]);

  /*MUTE*/

  const handleMute = () => {
    const audioTrack = streamRef.current?.getAudioTracks()[0];

    if (!audioTrack) return;

    const nextMuted = !isMuted;

    audioTrack.enabled = !nextMuted;

    setIsMuted(nextMuted);
  };

  /*CAMERA*/

  const handleCameraToggle = () => {
    const videoTrack = streamRef.current?.getVideoTracks()[0];

    if (!videoTrack) return;

    const nextCameraState = !isCameraOn;

    videoTrack.enabled = nextCameraState;

    setIsCameraOn(nextCameraState);
  };

  /* SWITCH MAIN / SMALL*/

  const handleSwitch = () => {
    setIsSelfMain((prev) => !prev);
  };

  /* AVAILABLE PARTICIPANTS
    Anyone already inside the call is removed.*/

  const availableParticipants = useMemo(() => {
    return contacts.filter((candidate) => {
      if (!candidate?.id) return false;

      return !participants.some(
        (participant) => participant?.id === candidate.id,
      );
    });
  }, [contacts, participants]);

  /* ADD PARTICIPANT */

  const handleAddParticipant = (candidate) => {
    if (!candidate?.id) return;

    setParticipants((prev) => {
      const alreadyExists = prev.some(
        (participant) => participant?.id === candidate.id,
      );

      if (alreadyExists) {
        return prev;
      }

      return [...prev, candidate];
    });

    setIsParticipantModalOpen(false);
  };

  /* END CALL */

  const handleEndCall = () => {
    clearInterval(timerRef.current);
    clearTimeout(connectTimerRef.current);

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });

      streamRef.current = null;
    }

    onEnd?.({
      type,
      durationSeconds: duration,

      /* Only true when the real connection says
        that the call was connected.*/

      answered: connected,

      participants,
    });
  };

  /* DISPLAY CONTACT*/

  const mainContact = participants[0] || contact;

  /* REMOTE PLACEHOLDER*/

  const RemoteVideo = ({ small = false }) => (
    <div
      className={`call-screen__remote ${
        small ? "call-screen__remote--small" : "call-screen__remote--main"
      }`}
    >
      <Avatar
        name={mainContact?.name || "Contact"}
        size={small ? "lg" : "xl"}
      />

      {!small && (
        <>
          <h2>{mainContact?.name || "Contact"}</h2>

          <p>
            {connected
              ? "Connected"
              : type === "video"
                ? "Video call"
                : "Voice call"}
          </p>
        </>
      )}
    </div>
  );

  /* SELF VIDEO*/

  const SelfVideo = ({ small = false }) => (
    <button
      type="button"
      className={`call-screen__self ${
        small ? "call-screen__self--small" : "call-screen__self--main"
      }`}
      onClick={handleSwitch}
      aria-label={
        small
          ? "Make your video the main view"
          : "Make your video the small view"
      }
    >
      {isCameraOn ? (
        <video
          ref={!small ? mainVideoRef : null}
          className="call-screen__camera"
          autoPlay
          playsInline
          muted
        />
      ) : (
        <div className="call-screen__camera-off">
          <Avatar name="You" size={small ? "lg" : "xl"} />

          <span>Camera off</span>
        </div>
      )}
    </button>
  );

  /*VIDEO LAYOUT*/

  const videoContent = isSelfMain ? (
    <>
      <SelfVideo />

      <button
        type="button"
        className="call-screen__remote-button call-screen__remote-button--small"
        onClick={handleSwitch}
        aria-label={`Make ${mainContact?.name || "contact"} the main view`}
      >
        <RemoteVideo small />
      </button>
    </>
  ) : (
    <>
      <button
        type="button"
        className="call-screen__remote-button call-screen__remote-button--main"
        onClick={handleSwitch}
        aria-label={`Make ${mainContact?.name || "contact"} the small view`}
      >
        <RemoteVideo />
      </button>

      <SelfVideo small />
    </>
  );

  /*
   *CALL UI*/

  const callUI = (
    <div className={`call-screen call-screen--${type}`}>
      {type === "video" ? (
        <div className="call-screen__video-stage">{videoContent}</div>
      ) : (
        <div className="call-screen__voice">
          <Avatar name={mainContact?.name || "Contact"} size="xl" />
        </div>
      )}

      {/* CALL INFORMATION */}

      <div className="call-screen__info">
        <h2>
          {mainContact?.name || "Contact"}

          {participants.length > 1 && ` + ${participants.length - 1}`}
        </h2>

        <p>{status}</p>

        {connected && <span>{formatDuration(duration)}</span>}
      </div>

      {/* PARTICIPANT LIST */}

      {participants.length > 1 && (
        <div className="call-screen__participants">
          {participants.map((participant) => (
            <div key={participant.id} className="call-screen__participant">
              <Avatar name={participant.name} size="sm" />

              <span>{participant.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* CONTROLS */}

      <div className="call-screen__controls">
        <button
          type="button"
          onClick={handleMute}
          aria-label={isMuted ? "Unmute microphone" : "Mute microphone"}
        >
          {isMuted ? "Unmute" : "Mute"}
        </button>

        {type === "video" && (
          <button
            type="button"
            onClick={handleCameraToggle}
            aria-label={isCameraOn ? "Turn camera off" : "Turn camera on"}
          >
            {isCameraOn ? "Camera off" : "Camera on"}
          </button>
        )}

        <button
          type="button"
          onClick={() => setIsParticipantModalOpen(true)}
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

      {/* ADD PARTICIPANT MODAL */}

      <Modal
        isOpen={isParticipantModalOpen}
        onClose={() => setIsParticipantModalOpen(false)}
        title="Add participant"
      >
        {availableParticipants.length === 0 ? (
          <div className="call-screen__no-contacts">
            <p>There are no other contacts available to add.</p>
          </div>
        ) : (
          <div className="call-screen__contact-list">
            {availableParticipants.map((candidate) => (
              <button
                type="button"
                key={candidate.id}
                className="call-screen__contact"
                onClick={() => handleAddParticipant(candidate)}
              >
                <Avatar name={candidate.name} size="md" />

                <span>{candidate.name}</span>

                <span className="call-screen__add-label">Add</span>
              </button>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );

  return createPortal(callUI, document.body);
}

"use client";

import {
  ConnectionState,
  Room,
  RoomEvent,
  Track,
  type RemoteParticipant,
  type RemoteTrack,
} from "livekit-client";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";

const HEYGEN_PARTICIPANT_ID = "heygen";

const TutorTokenOkSchema = z.object({
  session_id: z.string(),
  livekit_url: z.string(),
  livekit_client_token: z.string(),
});

export type TutorAgeBand = "tots_3_5" | "kids_6_8" | "crew_9_11";

export type TutorSessionProps = {
  childId: string;
  childName: string;
  ageBand: TutorAgeBand;
  onSessionEnd: () => void;
  onParentExit: () => void;
};

const AGE_BAND_LABEL: Record<TutorAgeBand, string> = {
  tots_3_5: "Tots 3–5",
  kids_6_8: "Kids 6–8",
  crew_9_11: "Crew 9–11",
};

function parseErrorMessage(json: unknown): string | null {
  if (typeof json !== "object" || json === null) {
    return null;
  }
  const rec = json as Record<string, unknown>;
  const err = rec["error"];
  return typeof err === "string" ? err : null;
}

function attachAvatarTrack(track: RemoteTrack, videoEl: HTMLVideoElement | null) {
  if (!videoEl) {
    return;
  }
  if (track.kind === Track.Kind.Video || track.kind === Track.Kind.Audio) {
    track.attach(videoEl);
  }
}

/**
 * Full-screen Human Tutor: on mount fetches LiveAvatar-backed LiveKit credentials,
 * connects with livekit-client, and attaches the HeyGen avatar tracks to a &lt;video&gt; element.
 *
 * @heygen/liveavatar-web-sdk is installed for future session commands; this flow uses server-issued LiveKit tokens only.
 */
export function TutorSession({
  childId,
  childName,
  ageBand,
  onSessionEnd,
  onParentExit,
}: TutorSessionProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const roomRef = useRef<Room | null>(null);

  const [phase, setPhase] = useState<
    "idle" | "connecting" | "live" | "error" | "ended"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    if (!childId) {
      setPhase("error");
      setErrorMessage("Missing child id");
      return;
    }

    const ac = new AbortController();
    const room = new Room();
    roomRef.current = room;

    const onTrackSubscribed = (
      track: RemoteTrack,
      _publication: unknown,
      participant: RemoteParticipant,
    ) => {
      if (participant.identity !== HEYGEN_PARTICIPANT_ID) {
        return;
      }
      attachAvatarTrack(track, videoRef.current);
    };

    room.on(RoomEvent.TrackSubscribed, onTrackSubscribed);

    setPhase("connecting");
    setErrorMessage(null);
    setSessionId(null);

    void (async () => {
      try {
        const res = await fetch("/api/tutor/token", {
          method: "POST",
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            childId,
            childDisplayName: childName.trim() || undefined,
          }),
          signal: ac.signal,
        });

        const json: unknown = await res.json();

        if (ac.signal.aborted) {
          return;
        }

        if (!res.ok) {
          const msg =
            parseErrorMessage(json) ?? `Session failed (${res.status})`;
          throw new Error(msg);
        }

        const parsed = TutorTokenOkSchema.safeParse(json);
        if (!parsed.success) {
          throw new Error("Invalid tutor server response");
        }

        setSessionId(parsed.data.session_id);

        await room.connect(
          parsed.data.livekit_url,
          parsed.data.livekit_client_token,
        );

        if (ac.signal.aborted) {
          return;
        }

        setPhase("live");
      } catch (err) {
        if (ac.signal.aborted) {
          return;
        }
        const message =
          err instanceof Error ? err.message : "Could not start tutor session";
        setErrorMessage(message);
        setPhase("error");
        room.disconnect();
        roomRef.current = null;
      }
    })();

    return () => {
      ac.abort();
      room.off(RoomEvent.TrackSubscribed, onTrackSubscribed);
      room.disconnect();
      roomRef.current = null;
    };
  }, [childId, childName]);

  function disconnectRoom() {
    const r = roomRef.current;
    if (r && r.state !== ConnectionState.Disconnected) {
      r.disconnect();
    }
    roomRef.current = null;
  }

  function handleSessionEnd() {
    disconnectRoom();
    setPhase("ended");
    onSessionEnd();
  }

  function handleParentExit() {
    disconnectRoom();
    onParentExit();
  }

  const showVideo = phase === "live" || phase === "connecting";

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-white">
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 bg-slate-900/90 px-4 py-3 backdrop-blur">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">
            Human Tutor — {childName}
          </p>
          <p className="truncate text-xs text-slate-400">
            {AGE_BAND_LABEL[ageBand]}
            {sessionId ? (
              <span className="ml-2 font-mono text-slate-500">
                · {sessionId.slice(0, 8)}…
              </span>
            ) : null}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={handleSessionEnd}
            disabled={phase !== "live"}
            className="rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
          >
            End session
          </button>
          <button
            type="button"
            onClick={handleParentExit}
            className="rounded-lg bg-orange-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-orange-600"
          >
            Parent exit
          </button>
        </div>
      </header>

      <div className="relative flex min-h-0 flex-1 flex-col items-stretch justify-center px-2 py-2 sm:px-3 sm:py-3 md:px-4 md:py-4">
        {phase === "connecting" ? (
          <div
            className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/50"
            aria-busy="true"
            aria-live="polite"
          >
            <p className="text-sm font-medium text-white">Connecting…</p>
          </div>
        ) : null}

        {phase === "error" && errorMessage ? (
          <div className="max-w-md rounded-xl border border-red-500/40 bg-red-950/80 px-4 py-3 text-center text-sm text-red-100">
            {errorMessage}
          </div>
        ) : null}

        {phase === "ended" ? (
          <p className="text-center text-sm text-slate-400">
            Session ended. You can close this screen or go back.
          </p>
        ) : null}

        {showVideo ? (
          <video
            ref={videoRef}
            className="max-h-[min(100dvh-5rem,100%)] w-full max-w-none rounded-xl bg-black object-contain shadow-2xl ring-1 ring-white/10 sm:rounded-2xl"
            playsInline
            autoPlay
          />
        ) : null}
      </div>
    </div>
  );
}

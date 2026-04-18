"use client";

import { Room, RoomEvent, Track, type RemoteTrack } from "livekit-client";
import { useEffect, useRef } from "react";

const HEYGEN_PARTICIPANT_ID = "heygen";

export type LiveKitConnect = {
  livekitUrl: string;
  livekitClientToken: string;
} | null;

export type AvatarPlayerProps = {
  connect: LiveKitConnect;
};

export function AvatarPlayer({ connect }: AvatarPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!connect) {
      return;
    }

    const el = videoRef.current;
    if (!el) {
      return;
    }

    const room = new Room();

    const onTrackSubscribed = (
      track: RemoteTrack,
      _publication: unknown,
      participant: { identity: string },
    ) => {
      if (participant.identity !== HEYGEN_PARTICIPANT_ID) {
        return;
      }
      if (track.kind === Track.Kind.Video || track.kind === Track.Kind.Audio) {
        track.attach(el);
      }
    };

    room.on(RoomEvent.TrackSubscribed, onTrackSubscribed);

    void room.connect(connect.livekitUrl, connect.livekitClientToken).catch(
      (err: unknown) => {
        console.error("[AvatarPlayer] LiveKit connect failed", err);
      },
    );

    return () => {
      room.off(RoomEvent.TrackSubscribed, onTrackSubscribed);
      room.disconnect();
    };
  }, [connect]);

  return (
    <video
      ref={videoRef}
      className="aspect-video w-full max-w-3xl rounded-xl bg-black object-cover shadow-lg"
      playsInline
      autoPlay
    />
  );
}

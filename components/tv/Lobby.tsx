"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import type { TvView } from "@/lib/views";
import { Crest } from "@/components/Crest";
import { MAX_PLAYERS, MIN_PLAYERS } from "@/lib/rules";

export function TvLobby({
  v,
  act,
}: {
  v: TvView;
  act: (a: string, p?: Record<string, unknown>) => Promise<boolean>;
}) {
  const [qr, setQr] = useState<string | null>(null);
  const [joinHost, setJoinHost] = useState("");

  useEffect(() => {
    const url = `${window.location.origin}/join?code=${v.code}`;
    setJoinHost(window.location.host);
    QRCode.toDataURL(url, {
      margin: 1,
      width: 440,
      color: { dark: "#EDE6D6", light: "#0B0D1800" },
    }).then(setQr);
  }, [v.code]);

  const seats = [...v.players].sort((a, b) => a.seat - b.seat);
  const shown = Math.min(MAX_PLAYERS, Math.max(MIN_PLAYERS, seats.length + 1));
  const ghosts = Math.max(0, shown - seats.length);
  const crowded = seats.length + ghosts > 10;
  const crestSize = crowded ? 60 : 80;
  const nameFont = `500 ${crowded ? 20 : 26}px var(--font-body)`;

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div className="kicker" style={{ position: "absolute", top: 48, left: 0, right: 0, textAlign: "center" }}>
        The Intern Court
      </div>
      <div style={{ position: "absolute", top: 120, left: 0, right: 0, textAlign: "center" }}>
        <div
          className="serif flame"
          style={{
            font: "700 240px/1 var(--font-serif)",
            color: "var(--gold)",
            letterSpacing: "0.08em",
          }}
        >
          {v.code}
        </div>
        <div style={{ font: "400 28px var(--font-body)", color: "rgba(237,230,214,0.6)", marginTop: 8 }}>
          join at {joinHost}/join · code above
        </div>
      </div>
      {qr && (
        <img
          src={qr}
          alt="QR code to join"
          style={{
            position: "absolute",
            top: 156,
            right: 144,
            width: 220,
            height: 220,
            border: "1px solid rgba(201,162,75,0.5)",
            padding: 8,
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          bottom: 170,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          ...(crowded ? { flexWrap: "wrap", gap: "20px 36px", padding: "0 120px" } : { gap: 52 }),
        }}
      >
        {seats.map((p) => (
          <div key={p.id} style={{ textAlign: "center" }} className="rise-in">
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
              <Crest name={p.name} size={crestSize} />
            </div>
            <div style={{ font: nameFont }}>{p.name}</div>
            <button
              onClick={() => act("kick", { playerId: p.id })}
              style={{
                font: "500 16px var(--font-body)",
                color: "rgba(237,230,214,0.35)",
                marginTop: 4,
              }}
              title="Remove player"
            >
              ✕
            </button>
          </div>
        ))}
        {Array.from({ length: ghosts }).map((_, i) => (
          <div key={`g${i}`} style={{ textAlign: "center", opacity: 0.3 }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
              <Crest name="" size={crestSize} empty />
            </div>
            <div style={{ font: nameFont }}>—</div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", bottom: 56, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        {v.playerCount >= MIN_PLAYERS ? (
          <button className="btn-gold" style={{ width: 520, fontSize: 26, padding: 20 }} onClick={() => act("startSetup")}>
            Convene the court — {v.playerCount} seated
          </button>
        ) : (
          <div style={{ font: "400 24px var(--font-body)", color: "var(--parchment-55)" }}>
            {v.playerCount} of {MIN_PLAYERS} needed to convene…
          </div>
        )}
      </div>
    </div>
  );
}

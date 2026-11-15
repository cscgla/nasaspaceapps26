import { useNavigate } from "react-router-dom";
import { Abs, Img, Scene } from "../components/Stage";
import {
  Brand,
  Countdown,
  NavBar,
  PixelButton,
  SideBubble,
  StepButton,
  useToast,
} from "../components/ui";
import { REGIONS, type RegionId } from "../regions";
import { FamilyMessage } from "./Intro";
import type { AssetName } from "../assets";
import { useEffect, useRef, useState } from "react";
import "./Messages.css";

type Note = {
  id: string;
  from: string;
  when: string;
  text: string;
  photo: AssetName;
};

/** Newest first, as stacked in "Notes — vertical scroll". */
const NOTES: Note[] = [
  {
    id: "sis",
    from: "A NOTE FROM SIS",
    when: "SAT 14 NOV // 9:12 AM (EARTH)",
    text: '"Saw an otter meme and thought of you. Tell the stars I said hi."',
    photo: "note-photo-sis",
  },
  {
    id: "mum",
    from: "A NOTE FROM MUM",
    when: "THU 12 NOV // 4:30 PM (EARTH)",
    text: '"Looked up at the night sky and waved. We’re so proud of you. 88 days and we’ll hug you."',
    photo: "note-photo-mum",
  },
  {
    id: "friend",
    from: "FROM YOUR BEST FRIEND",
    when: "TUE 10 NOV // 8:15 AM (EARTH)",
    text: '"Your plant is still alive! Bubble tea is on me when you’re back. Send us a sunrise photo."',
    photo: "note-photo-friend",
  },
];

/** "Message": notes from home + Write a Note. */
export default function Messages({ region }: { region: RegionId }) {
  const navigate = useNavigate();
  const r = REGIONS[region];
  return (
    <Scene bg={r.bg}>
      <Countdown />
      <Img {...r.mascot.messages} />
      <Abs x={60} y={190} w={763} h={620} className="notes-scroll">
        {NOTES.map((n) => (
          <article className="note" key={n.id}>
            <Img
              name={n.photo}
              alt=""
              x={33}
              y={60}
              w={207}
              h={207}
              className="note-photo"
            />
            <h2 className="note-from">{n.from}</h2>
            <p className="note-when">{n.when}</p>
            <p className="note-text">{n.text}</p>
            <PixelButton
              tone="blue"
              className="btn-play"
              onClick={() => navigate(`/${region}/messages/view`)}
            >
              PLAY
            </PixelButton>
          </article>
        ))}
      </Abs>
      <SideBubble says={r.says}>
        Would you like to send
        <br />a message?
      </SideBubble>
      <PixelButton
        tone="green"
        className="btn-write"
        style={{
          position: "absolute",
          left: 1187,
          top: 712,
          width: 221,
          height: 64,
        }}
        onClick={() => navigate(`/${region}/messages/write`)}
      >
        WRITE A NOTE
      </PixelButton>
      <NavBar base={`/${region}`} />
      <Brand section="Message" to={`/${region}/home`} />
    </Scene>
  );
}

/** "Message-view": the video message. */
export function MessageView({ region }: { region: RegionId }) {
  const navigate = useNavigate();
  const r = REGIONS[region];
  return (
    <Scene bg={r.bg}>
      <Img {...r.mascot.messages} />
      <Countdown />
      <NavBar base={`/${region}`} />
      <div className="scene-dim" />
      <FamilyMessage />
      <Brand section="Message" to={`/${region}/home`} />
      <StepButton
        label="Back"
        x={1295}
        onClick={() => navigate(`/${region}/messages`)}
      />
    </Scene>
  );
}

const DEFAULT_NOTE = `DEAR MUM, DAD, AND MEI,

EARTH LOOKS BEAUTIFUL FROM UP HERE, BUT NOTHING COMPARES TO HOME. I MISS YOU ALL MORE THAN WORDS CAN SAY. LOOK UP TONIGHT, AND KNOW I’M THINKING OF YOU.
LOVE ALWAYS,

YOUR ASTRONAUT`;

const NOTE_MAX = 300;

const EPHEMERIS = `REVISED: JUNE 02, 2025            MARS                    499 / 4

PHYSICAL DATA (UPDATED 2025-JUN-02):
 VOL. MEAN RADIUS (KM) = 3389.92+-0.04   DENSITY (G/CM^3)     =  3.933(5+-4)
 MASS X10^23 (KG)      =   6.4171      FLATTENING, F       =  1/169.779
 VOLUME (X10^10 KM^3)  =   16.318       EQUATORIAL RADIUS (KM)=  3396.19
 SIDEREAL ROT. PERIOD  =   24.622962 HR  SID. ROT. RATE, RAD/S =  0.0000708822
 MEAN SOLAR DAY (SOL)  =   88775.24415 S POLAR GRAVITY M/S^2  =  3.758
 CORE RADIUS (KM)      =  ~1700         EQU. GRAVITY  M/S^2   =  3.71
 GEOMETRIC ALBEDO      =    0.150

 GM (KM^3/S^2)         = 42828.375662    MASS RATIO (SUN/MARS) = 3098703.59
 GM 1-SIGMA (KM^3/S^2) = +- 0.00028      MASS OF ATMOSPHERE, KG= ~ 2.5 X 10^16
 MEAN TEMPERATURE (K)  =  210          ATMOS. PRESSURE (BAR) =    0.0056`;

/** "Send a Note": compose form. The inner card scrolls (name, note, attachments, signal, actions). */
export function WriteNote({ region }: { region: RegionId }) {
  const navigate = useNavigate();
  const r = REGIONS[region];
  const [ephemeris, setEphemeris] = useState(false);
  const [note, setNote] = useState(DEFAULT_NOTE);
  const { toast, show, hide } = useToast();

  // As in the prototype: once the "Message Sent!" popup closes, go back to Home
  const prevToast = useRef<string | null>(null);
  useEffect(() => {
    if (prevToast.current === "sent" && toast === null)
      navigate(`/${region}/home`);
    prevToast.current = toast;
  }, [toast, navigate, region]);

  return (
    <Scene bg={r.bg}>
      <Img {...r.mascot.messages} />
      <Countdown />
      <Abs x={60} y={142} w={762} h={640} className="note-form">
        <h1 className="note-form-title">SEND A NOTE</h1>
        <p className="note-form-sub">
          To: Loved Ones Back At Home &nbsp; //Delivered From Space
        </p>
        <div className="note-form-card">
          <label className="note-form-label" htmlFor="note-to">
            1/ WHO IS THIS MESSAGE FOR?
          </label>
          <input
            id="note-to"
            className="note-input"
            placeholder="INPUT NAME HERE."
          />
          <label className="note-form-label" htmlFor="note-body">
            2/ YOUR NOTE
          </label>
          <textarea
            id="note-body"
            className="note-input note-textarea"
            value={note}
            maxLength={NOTE_MAX}
            onChange={(e) => setNote(e.target.value)}
          />
          <p className="note-count">
            {note.length}/{NOTE_MAX}
          </p>

          <p className="note-form-label">
            3/ ADD A PHOTO, VOICE OR VIDEO (OPTIONAL)
          </p>
          <div className="note-attach">
            <div className="attach-tile is-added">
              <Img
                name="note-attachment"
                alt="Attached photo"
                x={57}
                y={20}
                w={85}
                h={85}
                className="attach-thumb"
              />
              <span className="attach-name">PHOTO</span>
              <span className="attach-hint">1 added</span>
            </div>
            <div className="attach-tile">
              <span className="attach-plus">+</span>
              <span className="attach-name">VOICE</span>
              <span className="attach-hint">up to 60 sec</span>
            </div>
            <div className="attach-tile">
              <span className="attach-plus">+</span>
              <span className="attach-name">VIDEO</span>
              <span className="attach-hint">up to 30 sec</span>
            </div>
          </div>

          <div className="note-signal">
            <div>
              <p className="signal-title">SIGNAL</p>
              <p>
                DELAY: <span className="v-white">18 MINS</span>
              </p>
              <p>
                NEXT RELAY: <span className="v-yellow">7:00 AM STATION</span>
              </p>
              <p>
                STATUS: <span className="v-green">READY TO SEND</span>
              </p>
            </div>
            <PixelButton
              tone="green"
              className="btn-getdata"
              onClick={() => setEphemeris(true)}
            >
              GET DATA
            </PixelButton>
          </div>
          <p className="note-arrives">ARRIVES AT 7:18 AM STATION TIME.</p>

          <div className="note-form-actions">
            <PixelButton
              tone="navy"
              className="btn-form"
              onClick={() => show("draft")}
            >
              SAVE DRAFT
            </PixelButton>
            <PixelButton
              tone="green"
              className="btn-form"
              onClick={() => show("sent")}
            >
              SEND NOTE
            </PixelButton>
          </div>
        </div>
      </Abs>
      <SideBubble says={r.says}>
        Send a message back home.
        <br />
        (Current approx 18 Mins)
        <span className="side-bubble-small">
          Connecting to: NASA JPL Horizons System
        </span>
      </SideBubble>
      <Img name="satellite" x={1268} y={92} w={140} h={112} />
      <StepButton
        label="Back"
        x={1295}
        onClick={() => navigate(`/${region}/messages`)}
      />
      <NavBar base={`/${region}`} />
      <Brand section="Message" to={`/${region}/home`} />

      {ephemeris && (
        <div className="overlay" onClick={() => setEphemeris(false)}>
          <div
            className="ephemeris"
            role="dialog"
            aria-label="Ephemeris results"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="ephemeris-close"
              aria-label="Close"
              onClick={() => setEphemeris(false)}
            >
              ✕
            </button>
            <h2>EPHEMERIS RESULTS:</h2>
            <p className="ephemeris-rule">{".".repeat(96)}</p>
            <pre>{EPHEMERIS}</pre>
          </div>
        </div>
      )}
      {toast && (
        <div className="overlay" onClick={hide}>
          <div className="toast" role="status">
            {toast === "draft" ? (
              <>
                <p className="toast-title" style={{ color: "var(--yellow)" }}>
                  DRAFT SAVED!
                </p>
                <p className="toast-sub">
                  PICK UP WHERE YOU
                  <br />
                  LEFT OFF ANYTIME!
                </p>
                <Img name="toast-draft-art" x={467} y={108} w={183} h={167} />
              </>
            ) : (
              <>
                <p className="toast-title" style={{ color: "#3cba5a" }}>
                  MESSAGE SENT!
                </p>
                <p className="toast-sub">ESTIMATED TIME:</p>
                <p className="toast-small">7:18 AM STATION TIME</p>
                <Img name="toast-sent-art" x={497} y={122} w={172} h={138} />
              </>
            )}
          </div>
        </div>
      )}
    </Scene>
  );
}

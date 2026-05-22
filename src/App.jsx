
import React, { useEffect, useRef, useState } from "react";
import "./style.css";

const questions = [
  { question: "Qual é a capital do Brasil?", answers: ["Rio de Janeiro", "Brasília", "São Paulo"], correct: 1 },
  { question: "Quantos dias tem uma semana?", answers: ["5", "7", "10"], correct: 1 },
  { question: "Qual planeta é conhecido como planeta vermelho?", answers: ["Marte", "Vênus", "Júpiter"], correct: 0 },
  { question: "Qual é o maior oceano do mundo?", answers: ["Atlântico", "Índico", "Pacífico"], correct: 2 },
  { question: "Quanto é 8 x 7?", answers: ["54", "56", "64"], correct: 1 },
  { question: "Qual destes é um animal mamífero?", answers: ["Golfinho", "Tubarão", "Jacaré"], correct: 0 },
  { question: "Em qual continente fica o Egito?", answers: ["Ásia", "África", "Europa"], correct: 1 },
  { question: "Qual é o principal idioma falado no Brasil?", answers: ["Português", "Espanhol", "Inglês"], correct: 0 },
  { question: "Qual instrumento mede a temperatura?", answers: ["Barômetro", "Termômetro", "Velocímetro"], correct: 1 },
  { question: "Qual cor resulta da mistura de azul com amarelo?", answers: ["Verde", "Roxo", "Laranja"], correct: 0 },
];


function TopActions({ soundOn, toggleSound, goHome }) {
  return (
    <div className="top-actions">
      <button className="home-button" onClick={goHome} aria-label="Voltar ao início">
        <svg className="home-icon" viewBox="0 0 64 64" aria-hidden="true">
          <path d="M10 30L32 12l22 18v22a2 2 0 0 1-2 2H40V38H24v16H12a2 2 0 0 1-2-2V30z" />
        </svg>
      </button>

      <button className={`sound-button ${soundOn ? "" : "muted"}`} onClick={toggleSound} aria-label={soundOn ? "Desligar som" : "Ligar som"}>
        <svg className="sound-icon" viewBox="0 0 64 64" aria-hidden="true">
          <path d="M8 25v14h12l16 14V11L20 25H8z" />
          <path className="sound-wave wave-one" d="M43 23c3 3 3 15 0 18" />
          <path className="sound-wave wave-two" d="M50 16c8 8 8 32 0 40" />
        </svg>
      </button>
    </div>
  );
}


function QuizTopBar({ soundOn, toggleSound, goHome }) {
  return (
    <div className="quiz-layout-wrap quiz-topbar">
      <img src="/quiz-logo.png" className="quiz-top-logo" alt="Quiz Challenge" />

      <div className="quiz-top-actions">
        <button className="home-button" onClick={goHome} aria-label="Voltar ao início">
          <svg className="home-icon" viewBox="0 0 64 64" aria-hidden="true">
            <path d="M10 30L32 12l22 18v22a2 2 0 0 1-2 2H40V38H24v16H12a2 2 0 0 1-2-2V30z" />
          </svg>
        </button>

        <button className={`sound-button ${soundOn ? "" : "muted"}`} onClick={toggleSound} aria-label={soundOn ? "Desligar som" : "Ligar som"}>
          <svg className="sound-icon" viewBox="0 0 64 64" aria-hidden="true">
            <path d="M8 25v14h12l16 14V11L20 25H8z" />
            <path className="sound-wave wave-one" d="M43 23c3 3 3 15 0 18" />
            <path className="sound-wave wave-two" d="M50 16c8 8 8 32 0 40" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("home");
  const [soundOn, setSoundOn] = useState(true);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [time, setTime] = useState(10);
  const timerProgress = Math.max(0, Math.min(100, (time / 10) * 100));

  const audioCtx = useRef(null);
  const musicLoop = useRef(null);
  const victoryAudioRef = useRef(null);
  const soundOnRef = useRef(true);

  useEffect(() => {
    victoryAudioRef.current = new Audio("/vitoria.mp3");
    victoryAudioRef.current.preload = "auto";
    victoryAudioRef.current.volume = 0.9;
  }, []);



  function getCtx() {
    if (!audioCtx.current) audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx.current;
  }

  function tone(freq, duration = 0.15, type = "sine", volume = 0.03, force = false) {
    if (!force && !soundOnRef.current) return;
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.value = freq;

    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  }

  function playClick() { tone(500, 0.08, "triangle", 0.03); }
  function playCorrect() {
    tone(700, 0.12, "sine", 0.04);
    setTimeout(() => tone(950, 0.16, "sine", 0.03), 120);
  }
  function playWrong() { tone(160, 0.2, "sawtooth", 0.035); }
  function playFinish() {
    [520, 680, 860, 1040].forEach((f, i) => {
      setTimeout(() => tone(f, 0.2, "triangle", 0.04), i * 120);
    });
  }

  function startMusic(force = false) {
    if (musicLoop.current) return;
    if (!soundOn && !force) return;

    const ctx = getCtx();

    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const melody = [
      { note: 523, type: "triangle", vol: 0.018 },
      { note: 659, type: "triangle", vol: 0.018 },
      { note: 784, type: "triangle", vol: 0.018 },
      { note: 659, type: "triangle", vol: 0.018 },
      { note: 698, type: "triangle", vol: 0.018 },
      { note: 880, type: "triangle", vol: 0.018 },
      { note: 784, type: "triangle", vol: 0.018 },
      { note: 659, type: "triangle", vol: 0.018 }
    ];

    let step = 0;

    musicLoop.current = setInterval(() => {
      if (!soundOnRef.current) {
        stopMusic();
        return;
      }

      const current = melody[step % melody.length];

      tone(current.note, 0.22, current.type, current.vol, true);

      if (step % 2 === 0) {
        tone(current.note / 2, 0.28, "square", 0.008, true);
      }

      step++;
    }, 240);
  }

  function stopMusic() {
    if (musicLoop.current) {
      clearInterval(musicLoop.current);
      musicLoop.current = null;
    }

    try {
      if (audioCtx.current) {
        audioCtx.current.suspend();
      }
    } catch (e) {}
  }

  function stopVictoryAudio() {
    if (victoryAudioRef.current) {
      victoryAudioRef.current.pause();
      victoryAudioRef.current.currentTime = 0;
    }
  }

  function playVictoryAudio() {
    if (!soundOnRef.current || !victoryAudioRef.current) return;

    victoryAudioRef.current.currentTime = 0;
    victoryAudioRef.current.play().catch(() => {});
  }

  useEffect(() => {
    soundOnRef.current = soundOn;

    if (!soundOn) {
      stopMusic();
      return;
    }

    if (audioUnlocked) {
      startMusic(true);
    }
  }, [soundOn, screen, audioUnlocked]);

  useEffect(() => {
    if (screen !== "quiz" || selected !== null) return;

    if (time <= 0) {
      setSelected(-1);
      setTimeout(() => nextQuestion(false), 900);
      return;
    }

    const timer = setTimeout(() => setTime((v) => v - 1), 1000);
    return () => clearTimeout(timer);
  }, [time, screen, selected]);

  async function unlockAudio() {
    try {
      const ctx = getCtx();

      if (ctx.state === "suspended") {
        await ctx.resume();
      }

      setAudioUnlocked(true);
      return true;
    } catch (e) {
      return false;
    }
  }

  async function toggleSound() {
    const next = !soundOn;
    setSoundOn(next);

    if (!next) {
      stopMusic();
      stopVictoryAudio();
      return;
    }

    const unlocked = await unlockAudio();

    if (unlocked) {
      startMusic(true);
    }
  }

  async function startGame() {
    stopVictoryAudio();
    const unlocked = await unlockAudio();

    if (unlocked && soundOn) {
      playClick();
      startMusic(true);
    }

    setScreen("quiz");
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setTime(10);
  }

  function choose(index) {
    if (selected !== null) return;

    playClick();
    setSelected(index);

    const correct = index === questions[current].correct;

    if (correct) playCorrect();
    else playWrong();

    setTimeout(() => nextQuestion(correct), 1000);
  }

  function nextQuestion(lastCorrect = false) {
    const newScore = score + (lastCorrect ? 1 : 0);

    if (current + 1 >= questions.length) {
      stopMusic();

      setScore(newScore);
      setScreen("result");

      setTimeout(() => {
        stopMusic();
        playVictoryAudio();
      }, 150);
      return;
    }

    setScore(newScore);
    setCurrent((v) => v + 1);
    setSelected(null);
    setTime(10);
  }

  function goHome() {
    playClick();
    stopMusic();
    stopVictoryAudio();
    setScreen("home");
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setTime(10);
  }

  function restart() {
    playClick();
    stopMusic();
    stopVictoryAudio();
    setScreen("home");
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setTime(10);
  }

  if (screen === "home") {
    return (
      <main className="home-stage">
        <TopActions soundOn={soundOn} toggleSound={toggleSound} goHome={goHome} />
        <img src="/start-screen-layout.png" className="background-image" alt="" />
        <button className="start-button" onClick={startGame}>
          COMEÇAR DESAFIO
        </button>
      </main>
    );
  }

  if (screen === "result") {
    return (
      <main className="result-stage">
        <QuizTopBar soundOn={soundOn} toggleSound={toggleSound} goHome={goHome} />

        <section className="result-card result-layout-wrap">
          <div className="trophy-area">
            <div className="trophy-glow"></div>
            <div className="trophy">🏆</div>
            <div className="stars">★ ★ ★</div>
          </div>

          <div className="result-content">
            <h2>RESULTADO FINAL</h2>
            <h1>Você acertou <strong>{score}!</strong></h1>
            <p>DE 10 PERGUNTAS</p>

            <button className="restart-button" onClick={restart}>
              ↻ JOGAR NOVAMENTE
            </button>
          </div>
        </section>
      </main>
    );
  }

  const q = questions[current];

  return (
    <main className="game-stage">
      <QuizTopBar soundOn={soundOn} toggleSound={toggleSound} goHome={goHome} />

      <section className="card quiz-layout-wrap">
        <div className="topbar">
          <span>Pergunta {current + 1} de 10</span>
          <div
            className="timer-circle"
            style={{
              background: `conic-gradient(from -90deg, #f4c64b 0% ${(100 - timerProgress)}%, rgba(244,198,75,.16) ${(100 - timerProgress)}% 100%)`
            }}
          >
            <div className="timer-inner">
              <strong>{time}</strong>
              <small>SEG</small>
            </div>
          </div>
        </div>

        <div className="progress">
          <span style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
        </div>

        <h1>{q.question}</h1>

        <div className="answers">
          {q.answers.map((answer, index) => {
            let cls = "";

            if (selected !== null) {
              if (index === q.correct) cls = "correct";
              else if (index === selected) cls = "wrong";
            }

            return (
              <button key={answer} className={cls} onClick={() => choose(index)}>
                <span>{String.fromCharCode(65 + index)}</span>
                {answer}
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
}

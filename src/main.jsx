import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  CheckCircle2,
  XCircle,
  RotateCcw,
  BarChart3,
  Clock,
  Target,
  ListChecks,
  Star,
  Volume2,
  VolumeX,
  TimerReset,
} from "lucide-react";
import "./style.css";

const QUESTION_TIME = 20;

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

const letters = ["A", "B", "C"];

function createAudioEngine() {
  let ctx = null;
  let musicGain = null;
  let masterGain = null;
  let musicTimer = null;
  let enabled = false;

  const ensure = () => {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = ctx.createGain();
      masterGain.gain.value = 0.55;
      masterGain.connect(ctx.destination);
      musicGain = ctx.createGain();
      musicGain.gain.value = 0.12;
      musicGain.connect(masterGain);
    }
    if (ctx.state === "suspended") ctx.resume();
  };

  const tone = (freq, duration = 0.15, type = "sine", volume = 0.25, destination = null) => {
    if (!enabled) return;
    ensure();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(destination || masterGain);
    osc.start();
    osc.stop(ctx.currentTime + duration + 0.02);
  };

  const sequence = (notes, gap = 0.08, type = "sine", volume = 0.25) => {
    notes.forEach((n, i) => setTimeout(() => tone(n[0], n[1], type, volume), i * gap * 1000));
  };

  const startMusic = () => {
    if (!enabled || musicTimer) return;
    ensure();
    const pattern = [196, 246.94, 293.66, 392, 329.63, 293.66, 246.94, 196];
    let step = 0;
    musicTimer = setInterval(() => {
      if (!enabled) return;
      const base = pattern[step % pattern.length];
      tone(base, 0.22, "triangle", 0.055, musicGain);
      if (step % 2 === 0) tone(base * 2, 0.14, "sine", 0.035, musicGain);
      if (step % 4 === 0) tone(98, 0.18, "sawtooth", 0.025, musicGain);
      step += 1;
    }, 310);
  };

  const stopMusic = () => {
    if (musicTimer) clearInterval(musicTimer);
    musicTimer = null;
  };

  return {
    enable() { enabled = true; ensure(); startMusic(); },
    disable() { enabled = false; stopMusic(); },
    isEnabled() { return enabled; },
    startMusic,
    stopMusic,
    click() { sequence([[520, .06], [780, .08]], .055, "square", .12); },
    correct() { sequence([[523.25, .12], [659.25, .12], [783.99, .22]], .11, "triangle", .22); },
    wrong() { sequence([[220, .16], [164.81, .22]], .14, "sawtooth", .18); },
    tick() { tone(880, .06, "square", .08); },
    timeout() { sequence([[330, .12], [247, .12], [196, .25]], .11, "sawtooth", .16); },
    finish() { sequence([[392, .13], [493.88, .13], [587.33, .13], [783.99, .4]], .13, "triangle", .24); },
  };
}

function useAudio() {
  const engineRef = useRef(null);
  const [soundOn, setSoundOn] = useState(false);
  if (!engineRef.current && typeof window !== "undefined") engineRef.current = createAudioEngine();

  const toggle = () => {
    const engine = engineRef.current;
    if (!engine) return;
    if (soundOn) {
      engine.disable();
      setSoundOn(false);
    } else {
      engine.enable();
      engine.click();
      setSoundOn(true);
    }
  };

  return { audio: engineRef.current, soundOn, toggleSound: toggle };
}

function Logo({ compact = false }) {
  return (
    <div className="logo-wrap">
      <div className="logo-glow" />
      <div className="logo-title">
        <span className={compact ? "logo-quiz compact" : "logo-quiz"}>QUIZ</span>
        <span className={compact ? "logo-mark compact" : "logo-mark"}>?</span>
      </div>
      <div className={compact ? "logo-challenge compact" : "logo-challenge"}>CHALLENGE</div>
      <div className={compact ? "logo-premium compact" : "logo-premium"}>PREMIUM</div>
    </div>
  );
}

function ParticleField() {
  const particles = useMemo(() => Array.from({ length: 44 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2.5 + Math.random() * 3,
    size: 2 + Math.random() * 5,
  })), []);
  return <div className="particles">{particles.map(p => <motion.span key={p.id} style={{ left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size }} animate={{ y: [0, -18, 0], opacity: [.2, 1, .2], rotate: [0, 180, 360] }} transition={{ repeat: Infinity, delay: p.delay, duration: p.duration, ease: "easeInOut" }} />)}</div>;
}

function SoundButton({ soundOn, toggleSound }) {
  return <button className="sound-btn" onClick={toggleSound}>{soundOn ? <Volume2 size={22} /> : <VolumeX size={22} />} {soundOn ? "SOM ON" : "SOM OFF"}</button>;
}

function Shell({ children, soundOn, toggleSound }) {
  return <main className="app-shell">
    <div className="bg-layers" />
    <div className="stage-light left" />
    <div className="stage-light right" />
    <ParticleField />
    <div className="sound-position"><SoundButton soundOn={soundOn} toggleSound={toggleSound} /></div>
    <div className="content">{children}</div>
  </main>;
}

function StartScreen({ onStart, audio, soundOn, toggleSound }) {
  const start = () => { audio?.click(); onStart(); };
  return <Shell soundOn={soundOn} toggleSound={toggleSound}>
    <motion.section initial={{ opacity: 0, scale: .94 }} animate={{ opacity: 1, scale: 1 }} className="start-grid">
      <div className="hero-copy">
        <Logo />
        <p className="tagline">RESPONDA. SOME PONTOS. <span>VENÇA O DESAFIO.</span></p>
        <div className="feature-grid">
          {[
            ["10", "10 PERGUNTAS", ListChecks],
            ["3", "ALTERNATIVAS", Target],
            ["20s", "CRONÔMETRO REAL", TimerReset],
            ["♫", "SOM PREMIUM", Volume2],
          ].map(([value, label, Icon]) => <div key={label} className="premium-card mini"><Icon size={34} /><strong>{value}</strong><small>{label}</small></div>)}
        </div>
        <motion.button whileTap={{ scale: .97 }} whileHover={{ y: -2 }} onClick={start} className="gold-button">COMEÇAR DESAFIO</motion.button>
      </div>
      <div className="preview-card premium-card">
        <div className="preview-top"><Logo compact /><div className="timer-circle">20<span>SEG</span></div></div>
        <div className="question-box">
          <p>PERGUNTA 1 DE 10</p>
          <h2>Qual é a capital do Brasil?</h2>
          {["Rio de Janeiro", "Brasília", "São Paulo"].map((a, i) => <div key={a} className={i === 1 ? "answer-row active" : "answer-row"}><span>{letters[i]}</span>{a}</div>)}
        </div>
      </div>
    </motion.section>
  </Shell>;
}

function QuizScreen({ onFinish, audio, soundOn, toggleSound }) {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const selectedRef = useRef(selected);
  selectedRef.current = selected;
  const current = questions[index];
  const isLocked = selected !== null;

  const goNext = (newScore) => {
    setTimeout(() => {
      if (index + 1 === questions.length) onFinish(newScore);
      else { setIndex(i => i + 1); setSelected(null); setTimeLeft(QUESTION_TIME); }
    }, 950);
  };

  const answer = (optionIndex) => {
    if (selectedRef.current !== null) return;
    audio?.click();
    setSelected(optionIndex);
    const hit = optionIndex === current.correct;
    const newScore = score + (hit ? 1 : 0);
    if (hit) { setScore(newScore); audio?.correct(); } else audio?.wrong();
    goNext(newScore);
  };

  useEffect(() => {
    setTimeLeft(QUESTION_TIME);
    selectedRef.current = null;
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (selectedRef.current !== null) return t;
        if (t <= 1) {
          clearInterval(timer);
          selectedRef.current = -1;
          setSelected(-1);
          audio?.timeout();
          goNext(score);
          return 0;
        }
        if (t <= 6) audio?.tick();
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [index]);

  const percentage = (timeLeft / QUESTION_TIME) * 100;

  return <Shell soundOn={soundOn} toggleSound={toggleSound}>
    <section className="quiz-wrap premium-card">
      <header className="quiz-header"><Logo compact /><div className="score-pill"><Trophy size={20} /> {score} PTS</div></header>
      <div className="progress-head"><span>PERGUNTA <b>{index + 1}</b> DE <b>10</b></span><span className={timeLeft <= 5 ? "danger-time" : ""}><Clock size={22} /> {timeLeft}s</span></div>
      <div className="progress-bar"><motion.div animate={{ width: `${((index + 1) / questions.length) * 100}%` }} /></div>
      <div className="timer-bar"><motion.div animate={{ width: `${percentage}%` }} transition={{ duration: .25 }} /></div>
      <AnimatePresence mode="wait">
        <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="question-panel">
          <h1>{current.question}</h1>
          <div className="answers">
            {current.answers.map((answerText, i) => {
              const correct = i === current.correct;
              const chosen = selected === i;
              const showCorrect = isLocked && correct;
              const showWrong = isLocked && chosen && !correct;
              return <motion.button key={answerText} whileHover={!isLocked ? { scale: 1.01, x: 4 } : {}} whileTap={!isLocked ? { scale: .99 } : {}} onClick={() => answer(i)} className={`answer-btn ${showCorrect ? "correct" : ""} ${showWrong ? "wrong" : ""}`}>
                <span>{letters[i]}</span><b>{answerText}</b>{showCorrect && <CheckCircle2 size={34} />}{showWrong && <XCircle size={34} />}
              </motion.button>;
            })}
          </div>
        </motion.div>
      </AnimatePresence>
      <AnimatePresence>{isLocked && <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`feedback ${selected === current.correct ? "ok" : "bad"}`}><strong>{selected === -1 ? "TEMPO ESGOTADO!" : selected === current.correct ? "CORRETO!" : "INCORRETO!"}</strong><span>A resposta certa é: <b>{current.answers[current.correct]}</b></span></motion.div>}</AnimatePresence>
    </section>
  </Shell>;
}

function ResultScreen({ score, onRestart, audio, soundOn, toggleSound }) {
  useEffect(() => { audio?.finish(); }, []);
  return <Shell soundOn={soundOn} toggleSound={toggleSound}>
    <motion.section initial={{ opacity: 0, scale: .93 }} animate={{ opacity: 1, scale: 1 }} className="result-card premium-card">
      <Logo compact />
      <div className="result-grid">
        <div className="trophy-wrap"><Trophy size={220} /><div>{[0,1,2].map(i => <Star key={i} fill="currentColor" />)}</div></div>
        <div><p>RESULTADO FINAL</p><h1>Você acertou <span>{score}!</span></h1><h2>DE 10 PERGUNTAS</h2><button onClick={() => { audio?.click(); onRestart(); }} className="gold-button small"><RotateCcw /> JOGAR NOVAMENTE</button><button className="ranking-button"><BarChart3 /> VER RANKING</button></div>
      </div>
    </motion.section>
  </Shell>;
}

function App() {
  const { audio, soundOn, toggleSound } = useAudio();
  const [screen, setScreen] = useState("start");
  const [finalScore, setFinalScore] = useState(0);
  const common = { audio, soundOn, toggleSound };
  if (screen === "start") return <StartScreen {...common} onStart={() => setScreen("quiz")} />;
  if (screen === "quiz") return <QuizScreen {...common} onFinish={(score) => { setFinalScore(score); setScreen("result"); }} />;
  return <ResultScreen {...common} score={finalScore} onRestart={() => { setFinalScore(0); setScreen("start"); }} />;
}

createRoot(document.getElementById("root")).render(<App />);

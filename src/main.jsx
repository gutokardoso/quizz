import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, CheckCircle2, XCircle, RotateCcw, BarChart3, Clock, Target, ListChecks, Star, Volume2, VolumeX } from "lucide-react";
import "./styles.css";

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
  { question: "Qual cor resulta da mistura de azul com amarelo?", answers: ["Verde", "Roxo", "Laranja"], correct: 0 }
];

const letters = ["A", "B", "C"];

function createAudioEngine() {
  let ctx = null;
  let master = null;
  let musicGain = null;
  let musicNodes = [];
  let muted = false;
  const ensure = () => {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain();
      master.gain.value = 0.75;
      master.connect(ctx.destination);
      musicGain = ctx.createGain();
      musicGain.gain.value = 0.12;
      musicGain.connect(master);
    }
    if (ctx.state === "suspended") ctx.resume();
  };
  const tone = (freq, duration = 0.18, type = "sine", gain = 0.15, start = 0) => {
    if (muted) return;
    ensure();
    const now = ctx.currentTime + start;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(gain, now + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(g);
    g.connect(master);
    osc.start(now);
    osc.stop(now + duration + 0.04);
  };
  const startMusic = () => {
    ensure();
    if (musicNodes.length) return;
    const bass = ctx.createOscillator();
    const pad = ctx.createOscillator();
    const shimmer = ctx.createOscillator();
    bass.type = "triangle";
    pad.type = "sine";
    shimmer.type = "sine";
    bass.frequency.value = 55;
    pad.frequency.value = 110;
    shimmer.frequency.value = 440;
    const bassGain = ctx.createGain();
    const padGain = ctx.createGain();
    const shimmerGain = ctx.createGain();
    bassGain.gain.value = 0.38;
    padGain.gain.value = 0.22;
    shimmerGain.gain.value = 0.07;
    bass.connect(bassGain); pad.connect(padGain); shimmer.connect(shimmerGain);
    bassGain.connect(musicGain); padGain.connect(musicGain); shimmerGain.connect(musicGain);
    bass.start(); pad.start(); shimmer.start();
    musicNodes = [bass, pad, shimmer];
    let step = 0;
    const notes = [55, 65.41, 73.42, 82.41, 73.42, 65.41, 55, 49];
    const loop = setInterval(() => {
      if (!ctx || !musicNodes.length) return;
      const n = notes[step % notes.length];
      bass.frequency.setTargetAtTime(n, ctx.currentTime, 0.06);
      pad.frequency.setTargetAtTime(n * 2, ctx.currentTime, 0.08);
      shimmer.frequency.setTargetAtTime(n * 8, ctx.currentTime, 0.08);
      step += 1;
    }, 620);
    musicNodes.push({ stop: () => clearInterval(loop) });
  };
  const stopMusic = () => {
    musicNodes.forEach((n) => { try { n.stop(); } catch {} });
    musicNodes = [];
  };
  return {
    start() { ensure(); startMusic(); },
    setMuted(value) { muted = value; if (master) master.gain.value = value ? 0 : 0.75; },
    click() { tone(220, 0.08, "square", 0.08); },
    correct() { tone(523, 0.12, "sine", 0.12); tone(659, 0.14, "sine", 0.12, 0.08); tone(784, 0.2, "sine", 0.12, 0.16); },
    wrong() { tone(180, 0.16, "sawtooth", 0.11); tone(92, 0.24, "sawtooth", 0.1, 0.12); },
    tick() { tone(840, 0.045, "square", 0.035); },
    timeout() { tone(160, 0.18, "triangle", 0.12); tone(110, 0.28, "triangle", 0.1, 0.14); },
    finish() { tone(392, 0.16, "sine", 0.12); tone(523, 0.18, "sine", 0.13, 0.12); tone(659, 0.2, "sine", 0.14, 0.24); tone(1046, 0.34, "sine", 0.12, 0.4); },
    stopMusic
  };
}

function Logo({ compact = false }) {
  return <div className="logo-wrap"><div className="logo-glow"/><div className="logo-main"><span className={compact ? "logo-quiz compact" : "logo-quiz"}>QUIZ</span><span className={compact ? "logo-question compact" : "logo-question"}>?</span></div><div className={compact ? "logo-challenge compact" : "logo-challenge"}>CHALLENGE</div><div className={compact ? "logo-premium compact" : "logo-premium"}>PREMIUM</div></div>;
}

function ParticleField() {
  const particles = useMemo(() => Array.from({ length: 44 }, (_, i) => ({ id: i, left: Math.random() * 100, top: Math.random() * 100, delay: Math.random() * 2, duration: 2.5 + Math.random() * 3, size: 2 + Math.random() * 5 })), []);
  return <div className="particles">{particles.map((p) => <motion.span key={p.id} className="particle" style={{ left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size }} animate={{ y: [0, -18, 0], opacity: [.2, 1, .2], rotate: [0, 180, 360] }} transition={{ repeat: Infinity, delay: p.delay, duration: p.duration, ease: "easeInOut" }} />)}</div>;
}

function SoundButton({ muted, onToggle }) {
  return <button className="sound-button" onClick={onToggle} aria-label="Alternar som">{muted ? <VolumeX size={22}/> : <Volume2 size={22}/>}<span>{muted ? "SOM OFF" : "SOM ON"}</span></button>;
}

function Shell({ children, muted, onToggleSound }) {
  return <main className="app-shell"><div className="bg-radials"/><div className="stage-light left"/><div className="stage-light right"/><div className="floor-glow"/><ParticleField/><SoundButton muted={muted} onToggle={onToggleSound}/><div className="content">{children}</div></main>;
}

function StartScreen({ onStart, muted, onToggleSound }) {
  return <Shell muted={muted} onToggleSound={onToggleSound}><motion.section initial={{ opacity: 0, scale: .94 }} animate={{ opacity: 1, scale: 1 }} className="start-grid"><div className="start-left"><Logo/><p className="tagline">RESPONDA. SOME PONTOS. <span>VENÇA O DESAFIO.</span></p><div className="feature-grid">{[["10", "10 PERGUNTAS", ListChecks], ["3", "ALTERNATIVAS", Target], [`${QUESTION_TIME}s`, "CRONÔMETRO REAL", Clock], ["♪", "TRILHA PREMIUM", Trophy]].map(([value, label, Icon]) => <div key={label} className="premium-card feature-card"><Icon className="feature-icon" size={34}/><div className="feature-number">{value}</div><div className="feature-label">{label}</div></div>)}</div><motion.button whileTap={{ scale: .97 }} whileHover={{ y: -2 }} onClick={onStart} className="primary-button">COMEÇAR DESAFIO</motion.button></div><div className="premium-card preview-card"><div className="preview-header"><Logo compact/><div className="timer"><b>{QUESTION_TIME}</b><span>SEG</span></div></div><div className="question-box"><p className="question-count">PERGUNTA 1 DE 10</p><h2>Qual é a capital do Brasil?</h2>{["Rio de Janeiro", "Brasília", "São Paulo"].map((a, i) => <div key={a} className={`preview-answer ${i === 1 ? "active" : ""}`}><span>{letters[i]}</span>{a}</div>)}</div></div></motion.section></Shell>;
}

function QuizScreen({ onFinish, audio, muted, onToggleSound }) {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [timedOut, setTimedOut] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const selectedRef = useRef(null);
  const timeoutRef = useRef(false);
  const current = questions[index];
  const isLocked = selected !== null || timedOut;

  function goNext(nextScore) {
    setTimeout(() => {
      if (index + 1 === questions.length) onFinish(nextScore);
      else { setIndex((i) => i + 1); setSelected(null); selectedRef.current = null; setTimedOut(false); timeoutRef.current = false; setTimeLeft(QUESTION_TIME); }
    }, 1050);
  }

  function answer(optionIndex) {
    if (isLocked) return;
    audio.click();
    setSelected(optionIndex); selectedRef.current = optionIndex;
    const hit = optionIndex === current.correct;
    if (hit) { audio.correct(); setScore((s) => s + 1); } else audio.wrong();
    goNext(score + (hit ? 1 : 0));
  }

  useEffect(() => {
    setTimeLeft(QUESTION_TIME);
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (selectedRef.current !== null || timeoutRef.current) return t;
        if (t <= 1) {
          timeoutRef.current = true; setTimedOut(true); audio.timeout(); goNext(score); return 0;
        }
        if (t <= 6) audio.tick();
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [index]);

  const timerPct = (timeLeft / QUESTION_TIME) * 100;

  return <Shell muted={muted} onToggleSound={onToggleSound}><section className="quiz-wrap"><div className="premium-card quiz-card"><header className="quiz-header"><Logo compact/><div className="quiz-status"><div className="event-game"><Clock size={22}/> EVENT GAME</div><div className={`score-ball ${timeLeft <= 5 ? "danger" : ""}`}><b>{timeLeft}</b><span>SEG</span></div><div className="score-ball points">{score}</div></div></header><div className="progress-area"><div className="question-title"><span>PERGUNTA</span><b>{index + 1}</b><span>DE</span><b>10</b></div><div className="progress-track"><motion.div className="progress-bar" animate={{ width: `${((index + 1) / questions.length) * 100}%` }}/></div><div className="timer-track"><motion.div className={timeLeft <= 5 ? "timer-bar danger" : "timer-bar"} animate={{ width: `${timerPct}%` }}/></div></div><AnimatePresence mode="wait"><motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="game-question-box"><h1>{current.question}</h1><div className="answers-list">{current.answers.map((answerText, i) => { const correct = i === current.correct; const chosen = selected === i; const showCorrect = isLocked && correct; const showWrong = selected !== null && chosen && !correct; return <motion.button key={answerText} whileHover={!isLocked ? { scale: 1.01, x: 4 } : {}} whileTap={!isLocked ? { scale: .99 } : {}} onClick={() => answer(i)} className={`answer-button ${showCorrect ? "correct" : ""} ${showWrong ? "wrong" : ""}`}><span className="answer-letter">{letters[i]}</span><span>{answerText}</span>{showCorrect && <CheckCircle2 size={34}/>} {showWrong && <XCircle size={34}/>}</motion.button>; })}</div></motion.div></AnimatePresence><AnimatePresence>{isLocked && <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`feedback ${selected === current.correct ? "ok" : "bad"}`}><p>{timedOut ? "TEMPO ESGOTADO!" : selected === current.correct ? "CORRETO!" : "INCORRETO!"}</p><span>A resposta certa é: <b>{current.answers[current.correct]}</b></span></motion.div>}</AnimatePresence></div></section></Shell>;
}

function ResultScreen({ score, onRestart, muted, onToggleSound }) {
  return <Shell muted={muted} onToggleSound={onToggleSound}><motion.section initial={{ opacity: 0, scale: .93 }} animate={{ opacity: 1, scale: 1 }} className="premium-card result-card"><Logo compact/><div className="result-grid"><div className="trophy-area"><div className="trophy-glow"/><Trophy className="trophy-icon" size={220} strokeWidth={1.4}/><div className="stars">{[0, 1, 2].map(i => <Star key={i} fill="currentColor"/>)}</div></div><div className="result-info"><p>RESULTADO FINAL</p><h1>Você acertou <span>{score}!</span></h1><h2>DE 10 PERGUNTAS</h2><div className="result-actions"><button onClick={onRestart} className="primary-button small"><RotateCcw/> JOGAR NOVAMENTE</button><button className="ranking-button"><BarChart3/> VER RANKING</button></div></div></div></motion.section></Shell>;
}

function App() {
  const audio = useMemo(() => createAudioEngine(), []);
  const [screen, setScreen] = useState("start");
  const [finalScore, setFinalScore] = useState(0);
  const [muted, setMuted] = useState(false);
  const toggleSound = () => { const next = !muted; setMuted(next); audio.setMuted(next); if (!next) audio.start(); };
  const start = () => { audio.start(); audio.click(); setScreen("quiz"); };
  const finish = (score) => { setFinalScore(score); audio.finish(); setScreen("result"); };
  const restart = () => { audio.click(); setFinalScore(0); setScreen("start"); };
  if (screen === "start") return <StartScreen onStart={start} muted={muted} onToggleSound={toggleSound}/>;
  if (screen === "quiz") return <QuizScreen onFinish={finish} audio={audio} muted={muted} onToggleSound={toggleSound}/>;
  return <ResultScreen score={finalScore} onRestart={restart} muted={muted} onToggleSound={toggleSound}/>;
}

createRoot(document.getElementById("root")).render(<App />);

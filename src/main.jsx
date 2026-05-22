import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, CheckCircle2, XCircle, RotateCcw, BarChart3, Clock, Target, ListChecks, Star } from "lucide-react";
import "./styles.css";

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

function Logo({ compact = false }) {
  return (
    <div className="logo-wrap">
      <div className="logo-glow" />
      <div className="logo-main">
        <span className={compact ? "logo-quiz compact" : "logo-quiz"}>QUIZ</span>
        <span className={compact ? "logo-question compact" : "logo-question"}>?</span>
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
    size: 2 + Math.random() * 5
  })), []);

  return (
    <div className="particles">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="particle"
          style={{ left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size }}
          animate={{ y: [0, -18, 0], opacity: [.2, 1, .2], rotate: [0, 180, 360] }}
          transition={{ repeat: Infinity, delay: p.delay, duration: p.duration, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function Shell({ children }) {
  return (
    <main className="app-shell">
      <div className="bg-radials" />
      <div className="stage-light left" />
      <div className="stage-light right" />
      <div className="floor-glow" />
      <ParticleField />
      <div className="content">{children}</div>
    </main>
  );
}

function StartScreen({ onStart }) {
  return (
    <Shell>
      <motion.section initial={{ opacity: 0, scale: .94 }} animate={{ opacity: 1, scale: 1 }} className="start-grid">
        <div className="start-left">
          <Logo />
          <p className="tagline">RESPONDA. SOME PONTOS. <span>VENÇA O DESAFIO.</span></p>
          <div className="feature-grid">
            {[
              ["10", "10 PERGUNTAS", ListChecks],
              ["3", "ALTERNATIVAS", Target],
              ["1", "APENAS 1 CERTA", CheckCircle2],
              ["★", "CONTE SUA PONTUAÇÃO", Trophy]
            ].map(([value, label, Icon]) => (
              <div key={label} className="premium-card feature-card">
                <Icon className="feature-icon" size={34} />
                <div className="feature-number">{value}</div>
                <div className="feature-label">{label}</div>
              </div>
            ))}
          </div>
          <motion.button whileTap={{ scale: .97 }} whileHover={{ y: -2 }} onClick={onStart} className="primary-button">
            COMEÇAR DESAFIO
          </motion.button>
        </div>

        <div className="premium-card preview-card">
          <div className="preview-header">
            <Logo compact />
            <div className="timer"><b>20</b><span>SEG</span></div>
          </div>
          <div className="question-box">
            <p className="question-count">PERGUNTA 1 DE 10</p>
            <h2>Qual é a capital do Brasil?</h2>
            {["Rio de Janeiro", "Brasília", "São Paulo"].map((a, i) => (
              <div key={a} className={`preview-answer ${i === 1 ? "active" : ""}`}>
                <span>{letters[i]}</span>{a}
              </div>
            ))}
          </div>
        </div>
      </motion.section>
    </Shell>
  );
}

function QuizScreen({ onFinish }) {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const current = questions[index];
  const isLocked = selected !== null;

  function answer(optionIndex) {
    if (isLocked) return;
    setSelected(optionIndex);
    const hit = optionIndex === current.correct;
    if (hit) setScore((s) => s + 1);
    setTimeout(() => {
      if (index + 1 === questions.length) onFinish(score + (hit ? 1 : 0));
      else {
        setIndex((i) => i + 1);
        setSelected(null);
      }
    }, 1050);
  }

  return (
    <Shell>
      <section className="quiz-wrap">
        <div className="premium-card quiz-card">
          <header className="quiz-header">
            <Logo compact />
            <div className="quiz-status">
              <div className="event-game"><Clock size={22}/> EVENT GAME</div>
              <div className="score-ball">{score}</div>
            </div>
          </header>

          <div className="progress-area">
            <div className="question-title"><span>PERGUNTA</span><b>{index + 1}</b><span>DE</span><b>10</b></div>
            <div className="progress-track"><motion.div className="progress-bar" animate={{ width: `${((index + 1) / questions.length) * 100}%` }} /></div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="game-question-box">
              <h1>{current.question}</h1>
              <div className="answers-list">
                {current.answers.map((answerText, i) => {
                  const correct = i === current.correct;
                  const chosen = selected === i;
                  const showCorrect = isLocked && correct;
                  const showWrong = isLocked && chosen && !correct;
                  return (
                    <motion.button
                      key={answerText}
                      whileHover={!isLocked ? { scale: 1.01, x: 4 } : {}}
                      whileTap={!isLocked ? { scale: .99 } : {}}
                      onClick={() => answer(i)}
                      className={`answer-button ${showCorrect ? "correct" : ""} ${showWrong ? "wrong" : ""}`}
                    >
                      <span className="answer-letter">{letters[i]}</span>
                      <span>{answerText}</span>
                      {showCorrect && <CheckCircle2 size={34} />}
                      {showWrong && <XCircle size={34} />}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence>
            {isLocked && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`feedback ${selected === current.correct ? "ok" : "bad"}`}>
                <p>{selected === current.correct ? "CORRETO!" : "INCORRETO!"}</p>
                <span>A resposta certa é: <b>{current.answers[current.correct]}</b></span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </Shell>
  );
}

function ResultScreen({ score, onRestart }) {
  return (
    <Shell>
      <motion.section initial={{ opacity: 0, scale: .93 }} animate={{ opacity: 1, scale: 1 }} className="premium-card result-card">
        <Logo compact />
        <div className="result-grid">
          <div className="trophy-area">
            <div className="trophy-glow" />
            <Trophy className="trophy-icon" size={220} strokeWidth={1.4} />
            <div className="stars">{[0, 1, 2].map(i => <Star key={i} fill="currentColor" />)}</div>
          </div>
          <div className="result-info">
            <p>RESULTADO FINAL</p>
            <h1>Você acertou <span>{score}!</span></h1>
            <h2>DE 10 PERGUNTAS</h2>
            <div className="result-actions">
              <button onClick={onRestart} className="primary-button small"><RotateCcw /> JOGAR NOVAMENTE</button>
              <button className="ranking-button"><BarChart3 /> VER RANKING</button>
            </div>
          </div>
        </div>
      </motion.section>
    </Shell>
  );
}

function App() {
  const [screen, setScreen] = useState("start");
  const [finalScore, setFinalScore] = useState(0);

  if (screen === "start") return <StartScreen onStart={() => setScreen("quiz")} />;
  if (screen === "quiz") return <QuizScreen onFinish={(score) => { setFinalScore(score); setScreen("result"); }} />;
  return <ResultScreen score={finalScore} onRestart={() => { setFinalScore(0); setScreen("start"); }} />;
}

createRoot(document.getElementById("root")).render(<App />);

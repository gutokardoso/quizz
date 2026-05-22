
import React, { useEffect, useRef, useState } from "react";
import "./style.css";

const questions = [
  {
    question: "Qual é a capital do Brasil?",
    answers: ["Rio de Janeiro", "Brasília", "São Paulo"],
    correct: 1,
  },
  {
    question: "Quanto é 8 x 7?",
    answers: ["54", "56", "64"],
    correct: 1,
  },
  {
    question: "Qual planeta é conhecido como planeta vermelho?",
    answers: ["Marte", "Vênus", "Júpiter"],
    correct: 0,
  },
];

export default function App() {
  const [screen, setScreen] = useState("home");
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [time, setTime] = useState(20);

  const audioCtx = useRef(null);
  const musicLoop = useRef(null);

  function getCtx() {
    if (!audioCtx.current) {
      audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx.current;
  }

  function tone(freq, duration = 0.15, type = "sine", volume = 0.03) {
    const ctx = getCtx();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.value = freq;

    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      ctx.currentTime + duration
    );

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  }

  function playClick() {
    tone(500, 0.08, "triangle", 0.03);
  }

  function playCorrect() {
    tone(700, 0.12, "sine", 0.04);
    setTimeout(() => tone(950, 0.16, "sine", 0.03), 120);
  }

  function playWrong() {
    tone(160, 0.2, "sawtooth", 0.035);
  }

  function playFinish() {
    [520, 680, 860].forEach((f, i) => {
      setTimeout(() => tone(f, 0.2, "triangle", 0.04), i * 120);
    });
  }

  function startMusic() {
    if (musicLoop.current) return;

    const notes = [110, 165, 220, 185];
    let step = 0;

    musicLoop.current = setInterval(() => {
      tone(notes[step % notes.length], 0.4, "triangle", 0.02);
      step++;
    }, 420);
  }

  function stopMusic() {
    if (musicLoop.current) {
      clearInterval(musicLoop.current);
      musicLoop.current = null;
    }
  }

  useEffect(() => {
    if (screen !== "quiz" || selected !== null) return;

    if (time <= 0) {
      nextQuestion();
      return;
    }

    const timer = setTimeout(() => {
      setTime((v) => v - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [time, screen, selected]);

  function startGame() {
    playClick();
    startMusic();

    setScreen("quiz");
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setTime(20);
  }

  function choose(index) {
    if (selected !== null) return;

    playClick();

    setSelected(index);

    const correct = index === questions[current].correct;

    if (correct) {
      setScore((v) => v + 1);
      playCorrect();
    } else {
      playWrong();
    }

    setTimeout(() => {
      nextQuestion(correct);
    }, 1000);
  }

  function nextQuestion(lastCorrect = false) {
    if (current + 1 >= questions.length) {
      stopMusic();
      playFinish();
      setScore((s) => s + (lastCorrect ? 1 : 0));
      setScreen("result");
      return;
    }

    setCurrent((v) => v + 1);
    setSelected(null);
    setTime(20);
  }

  function restart() {
    playClick();
    setScreen("home");
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setTime(20);
  }

  if (screen === "home") {
    return (
      <main className="home-stage">
        <img
          src="/start-screen-layout.png"
          className="background-image"
          alt=""
        />

        <button className="start-button" onClick={startGame}>
          COMEÇAR DESAFIO
        </button>
      </main>
    );
  }

  if (screen === "result") {
    return (
      <main className="game-stage">
        <section className="card">
          <h2>RESULTADO FINAL</h2>
          <h1>Você acertou {score}!</h1>
          <button onClick={restart}>
            JOGAR NOVAMENTE
          </button>
        </section>
      </main>
    );
  }

  const q = questions[current];

  return (
    <main className="game-stage">
      <section className="card">
        <div className="topbar">
          <span>Pergunta {current + 1}</span>
          <div className="timer">{time}s</div>
        </div>

        <div className="progress">
          <span style={{
            width: `${((current + 1) / questions.length) * 100}%`
          }} />
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
              <button
                key={answer}
                className={cls}
                onClick={() => choose(index)}
              >
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

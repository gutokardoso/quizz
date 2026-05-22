
import React, { useState, useEffect } from "react";

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
    answers: ["Marte", "Júpiter", "Vênus"],
    correct: 0,
  },
];

export default function App() {
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [time, setTime] = useState(20);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (!started || finished) return;

    if (time <= 0) {
      nextQuestion();
      return;
    }

    const timer = setTimeout(() => {
      setTime((t) => t - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [time, started, finished]);

  function choose(i) {
    if (selected !== null) return;

    setSelected(i);

    if (i === questions[index].correct) {
      setScore((s) => s + 1);
    }

    setTimeout(() => {
      nextQuestion();
    }, 1000);
  }

  function nextQuestion() {
    if (index + 1 >= questions.length) {
      setFinished(true);
      return;
    }

    setIndex((i) => i + 1);
    setSelected(null);
    setTime(20);
  }

  function restart() {
    setStarted(false);
    setFinished(false);
    setIndex(0);
    setScore(0);
    setSelected(null);
    setTime(20);
  }

  if (!started) {
    return (
      <main className="screen">
        <div className="hero">
          <h1>QUIZ CHALLENGE</h1>
          <p>RESPONDA. SOME PONTOS. VENÇA O DESAFIO.</p>

          <div className="stats">
            <div className="card">
              <strong>10</strong>
              <span>Perguntas</span>
            </div>

            <div className="card">
              <strong>3</strong>
              <span>Alternativas</span>
            </div>

            <div className="card">
              <strong>1</strong>
              <span>Resposta certa</span>
            </div>
          </div>

          <button onClick={() => setStarted(true)}>
            COMEÇAR DESAFIO
          </button>
        </div>
      </main>
    );
  }

  if (finished) {
    return (
      <main className="screen">
        <div className="result">
          <h2>RESULTADO FINAL</h2>
          <h1>Você acertou {score}!</h1>
          <button onClick={restart}>JOGAR NOVAMENTE</button>
        </div>
      </main>
    );
  }

  const q = questions[index];

  return (
    <main className="screen">
      <div className="quiz">
        <div className="topbar">
          <span>Pergunta {index + 1}</span>
          <span className="timer">{time}s</span>
        </div>

        <h2>{q.question}</h2>

        <div className="answers">
          {q.answers.map((a, i) => {
            let cls = "";

            if (selected !== null) {
              if (i === q.correct) cls = "correct";
              else if (i === selected) cls = "wrong";
            }

            return (
              <button
                key={a}
                className={cls}
                onClick={() => choose(i)}
              >
                {a}
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}

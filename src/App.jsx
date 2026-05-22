
import React, { useEffect, useState } from "react";
import "./style.css";

const questions = [
  {
    question: "Qual é a capital do Brasil?",
    answers: ["Rio de Janeiro", "Brasília", "São Paulo"],
    correct: 1,
  },
  {
    question: "Quantos dias tem uma semana?",
    answers: ["5", "7", "10"],
    correct: 1,
  },
  {
    question: "Qual planeta é conhecido como planeta vermelho?",
    answers: ["Marte", "Vênus", "Júpiter"],
    correct: 0,
  },
  {
    question: "Qual é o maior oceano do mundo?",
    answers: ["Atlântico", "Índico", "Pacífico"],
    correct: 2,
  },
  {
    question: "Quanto é 8 x 7?",
    answers: ["54", "56", "64"],
    correct: 1,
  },
  {
    question: "Qual destes é um animal mamífero?",
    answers: ["Golfinho", "Tubarão", "Jacaré"],
    correct: 0,
  },
  {
    question: "Em qual continente fica o Egito?",
    answers: ["Ásia", "África", "Europa"],
    correct: 1,
  },
  {
    question: "Qual é o principal idioma falado no Brasil?",
    answers: ["Português", "Espanhol", "Inglês"],
    correct: 0,
  },
  {
    question: "Qual instrumento mede a temperatura?",
    answers: ["Barômetro", "Termômetro", "Velocímetro"],
    correct: 1,
  },
  {
    question: "Qual cor resulta da mistura de azul com amarelo?",
    answers: ["Verde", "Roxo", "Laranja"],
    correct: 0,
  },
];

export default function App() {
  const [screen, setScreen] = useState("home");
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(20);

  useEffect(() => {
    if (screen !== "quiz" || selected !== null) return;

    if (time <= 0) {
      setSelected(-1);
      setTimeout(nextQuestion, 900);
      return;
    }

    const timer = setTimeout(() => {
      setTime((value) => value - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [screen, time, selected]);

  function startGame() {
    setScreen("quiz");
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setTime(20);
  }

  function chooseAnswer(index) {
    if (selected !== null) return;

    setSelected(index);

    const isCorrect = index === questions[current].correct;

    if (isCorrect) {
      setScore((value) => value + 1);
    }

    setTimeout(() => {
      nextQuestion(isCorrect);
    }, 950);
  }

  function nextQuestion(lastWasCorrect = false) {
    const finalScore = score + (lastWasCorrect ? 1 : 0);

    if (current + 1 >= questions.length) {
      setScore(finalScore);
      setScreen("result");
      return;
    }

    setCurrent((value) => value + 1);
    setSelected(null);
    setTime(20);
  }

  function restart() {
    setScreen("home");
    setCurrent(0);
    setSelected(null);
    setScore(0);
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
        <section className="result-card">
          <h2>RESULTADO FINAL</h2>
          <h1>Você acertou <strong>{score}!</strong></h1>
          <p>de 10 perguntas</p>
          <button onClick={restart}>JOGAR NOVAMENTE</button>
        </section>
      </main>
    );
  }

  const question = questions[current];

  return (
    <main className="game-stage">
      <section className="quiz-card">
        <header className="quiz-header">
          <div>
            <span>PERGUNTA</span>
            <strong>{current + 1} DE 10</strong>
          </div>

          <div className="timer">
            {time}
            <small>SEG</small>
          </div>
        </header>

        <div className="progress">
          <span style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
        </div>

        <h1>{question.question}</h1>

        <div className="answers">
          {question.answers.map((answer, index) => {
            let className = "";

            if (selected !== null) {
              if (index === question.correct) className = "correct";
              if (index === selected && index !== question.correct) className = "wrong";
            }

            return (
              <button
                key={answer}
                className={className}
                onClick={() => chooseAnswer(index)}
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

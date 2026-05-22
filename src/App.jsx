
import React, { useState } from "react";
import "./style.css";

export default function App() {
  const [sound, setSound] = useState(true);

  return (
    <main className="home-stage">
      <div className="particles"></div>

      <div className="small-logo">
        <div className="mini-logo">QUIZ<br/>CHALLENGE</div>
      </div>

      <button className="sound-toggle" onClick={() => setSound(!sound)}>
        🔊 SOM {sound ? "LIGADO" : "DESLIGADO"}
      </button>

      <section className="home-content">
        <div className="logo-wrap">
          <div className="logo-orbit"></div>

          <h1 className="logo-main">QUIZ</h1>

          <div className="logo-challenge">
            CHALLENGE
          </div>

          <div className="logo-premium">
            ★ PREMIUM ★
          </div>
        </div>

        <p className="tagline">
          RESPONDA. SOME PONTOS. <strong>VENÇA O DESAFIO.</strong>
        </p>

        <div className="stats">
          <div className="stat">
            <div className="icon">10</div>
            <span>10 PERGUNTAS</span>
          </div>

          <div className="stat">
            <div className="icon">≡</div>
            <span>3 ALTERNATIVAS</span>
          </div>

          <div className="stat">
            <div className="icon">◎</div>
            <span>APENAS 1 CERTA</span>
          </div>

          <div className="stat">
            <div className="icon">🏆</div>
            <span>CONTE SUA PONTUAÇÃO</span>
          </div>
        </div>

        <button className="start-button">
          COMEÇAR DESAFIO
        </button>
      </section>

      <footer>
        © 2024 Quiz Challenge Premium. Todos os direitos reservados.
      </footer>
    </main>
  );
}

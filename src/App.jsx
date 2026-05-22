
import React from "react";
import "./style.css";

export default function App() {
  return (
    <main className="home-stage">
      <img
        className="bg-cover"
        src="/start-screen-layout(11).png"
        alt=""
      />

      <div className="overlay"></div>

      <section className="content">
        <h1>QUIZ CHALLENGE</h1>
        <p>RESPONDA. SOME PONTOS. <strong>VENÇA O DESAFIO.</strong></p>

        <button>COMEÇAR DESAFIO</button>
      </section>
    </main>
  );
}

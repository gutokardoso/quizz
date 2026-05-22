
import React from "react";
import "./style.css";

export default function App() {
  return (
    <main className="home-stage">
      <img
        src="/start-screen-layout(12).png"
        className="background-image"
        alt=""
      />

      <div className="overlay"></div>

      <section className="home-content">
        <button className="start-button">
          COMEÇAR DESAFIO
        </button>
      </section>
    </main>
  );
}

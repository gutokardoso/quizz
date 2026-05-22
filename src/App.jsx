import React from "react";

export default function App() {
  return (
    <main style={{
      minHeight: "100vh",
      background: "#000926",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Arial"
    }}>
      <section style={{
        width: "100%",
        maxWidth: "900px",
        textAlign: "center",
        padding: "40px"
      }}>
        <h1 style={{
          fontSize: "72px",
          color: "#f4c64b",
          marginBottom: "10px"
        }}>
          QUIZ CHALLENGE
        </h1>

        <p style={{
          fontSize: "24px",
          marginBottom: "40px"
        }}>
          RESPONDA. SOME PONTOS. VENÇA O DESAFIO.
        </p>

        <button style={{
          background: "#f4c64b",
          color: "#000926",
          border: "none",
          borderRadius: "16px",
          padding: "20px 40px",
          fontWeight: "bold",
          fontSize: "22px",
          cursor: "pointer"
        }}>
          COMEÇAR DESAFIO
        </button>
      </section>
    </main>
  );
}

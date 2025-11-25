import React from "react";

export function AlarmModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div 
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.65)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        color: "black"
      }}
    >
      <div 
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "15px",
          textAlign: "center",
          boxShadow: "0 0 15px rgba(0,0,0,0.3)",
          maxWidth: "400px"
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>⏰ ¡Alarma!</h2>
        <button
          style={{
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#007bff",
            color: "white",
            fontSize: "16px",
            cursor: "pointer"
          }}
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

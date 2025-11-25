// DragComponents.js
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { useState, useEffect, useRef } from "react";


export function Draggable({ id, children, onEdit, onDelete,onEditReminder }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);

  const handleMenuClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setOpenMenu((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const containerStyle = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    padding: "8px",
    margin: "4px 0",
    background: "black",
    borderRadius: "4px",
    color: "white",
    position: "relative",
    userSelect: "none",
    display: "flex", // 👈 organizamos en fila
    justifyContent: "space-between", // texto a la izquierda, botón a la derecha
    alignItems: "center",
  };

  return (
    <div ref={setNodeRef} style={containerStyle}>
      {/* 🟢 zona draggable */}
      <div
        {...listeners}
        {...attributes}
        style={{
          flex: 1, // ocupa todo el espacio libre
          cursor: "grab",
        }}
      >
        {children}
      </div>

      {/* menú de tres puntos */}
      <div style={{ position: "relative" }}>
        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={handleMenuClick}
          style={{
            background: "gray",
            border: "none",
            color: "white",
            cursor: "pointer",
            fontSize: "18px",
            padding: "2px 6px",
            borderRadius: "4px",
          }}
        >
          ⋮
        </button>

        {/* menú contextual */}
        {openMenu && (
          <div
            ref={menuRef}
            style={{
              position: "absolute",
              top: "120%",
              right: 0,
              background: "#444",
              borderRadius: "6px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
              zIndex: 10,
              padding: "4px 0",
              minWidth: "110px",
            }}
          >
            <button
              onClick={() => {
                setOpenMenu(false);
                onEdit(id);
              }}
              style={{
                display: "block",
                width: "100%",
                border: "none",
                background: "transparent",
                color: "white",
                padding: "6px 10px",
                textAlign: "left",
                cursor: "pointer",
              }}
            >
              ✏️ Editar
            </button>

            <button onClick={() => { setOpenMenu(false); onEditReminder(id)} }>⏰ Editar alarma</button>


            <button
              onClick={() => {
                setOpenMenu(false);
                onDelete(id);
              }}
              style={{
                display: "block",
                width: "100%",
                border: "none",
                background: "transparent",
                color: "white",
                padding: "6px 10px",
                textAlign: "left",
                cursor: "pointer",
              }}
            >
              🗑️ Eliminar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


export function Droppable({ id, children, onAddTask }) {
  const { isOver, setNodeRef } = useDroppable({ id });
  const style = {
    flex: 1,
    padding: "1rem",
    border: "2px solid #ccc",
    borderRadius: "8px",
    background: isOver ? "#666" : "#abababff",
    minHeight: "200px",
  };
  return (
    <div ref={setNodeRef} style={style}>
      <h3>{id.toUpperCase()}</h3>
      {children}
      <button
        onClick={() => onAddTask(id)}
        style={{
          marginTop: "1rem",
          width: "100%",
          border: "none",
          background: "#007bff",
          color: "white",
          borderRadius: "6px",
          padding: "6px",
          cursor: "pointer",
        }}
      >
        + Añadir tarea
      </button>
    </div>
  );
}

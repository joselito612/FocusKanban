//TaskManager.jsx
import { useState, useEffect } from "react";
import { updateTaskColumn,updateTask,deleteTask } from "../services/tasksService";


export function useTaskManager(initialColumns) {
  const [columns, setColumns] = useState(initialColumns);


  
  useEffect(() => {
    fetch("http://localhost:4000/api/tasks")
      .then(res => res.json())
      .then(data => {
        const grouped = { todo: [], doing: [], done: [] };
        data.forEach(task => {
          if (grouped[task.column]) grouped[task.column].push(task);
        });
        setColumns(grouped);
      })
      .catch(err => console.error("Error al cargar tareas:", err));
  }, []);

  const refreshTasks = async () => {
    try {
      const data = await fetch("http://localhost:4000/api/tasks").then(res => res.json());
      const grouped = { todo: [], doing: [], done: [] };
      data.forEach(task => {
        if (grouped[task.column]) grouped[task.column].push(task);
      });
      setColumns(grouped);
    } catch (err) {
      console.error("Error al refrescar tareas:", err);
    }
  };


  const addTask = (columnId, task) => {
      setColumns(prev => ({
        ...prev,
        [columnId]: [...prev[columnId], task],
      }));
    };

    const moveTask = async (fromCol, toCol, taskId) => {
      setColumns(prev => {
        const task = prev[fromCol].find(t => t._id === taskId);
        if (!task) return prev;

        const updatedTask = { ...task, column: toCol };

        const fromTasks = prev[fromCol].filter(t => t._id !== taskId);
        const toTasks = [...prev[toCol], updatedTask];

        return {
          ...prev,
          [fromCol]: fromTasks,
          [toCol]: toTasks,
        };
      });

      // 🔄 Actualiza también en la BD
      try {
        await updateTaskColumn(taskId, toCol);
      } catch (err) {
        console.error("Error actualizando tarea:", err);
      }
    };


  const handleDeleteTask = async (taskId) => {
      try {
        await deleteTask(taskId);
        setColumns(prev => {
          const newCols = {};
          for (const col in prev) {
            newCols[col] = prev[col].filter(t => t._id !== taskId);
          }
          return newCols;
        });
      } catch (err) {
        console.error("Error eliminando tarea:", err);
      }
    };

    const handleEditTask = async (taskId, newTitle) => {
      try {
        const updated = await updateTask(taskId, { title: newTitle });
        setColumns(prev => {
          const newCols = {};
          for (const col in prev) {
            newCols[col] = prev[col].map(t => (t._id === taskId ? updated : t));
          }
          return newCols;
        });
      } catch (err) {
        console.error("Error editando tarea:", err);
      }
    };


    return { columns, setColumns, addTask, moveTask, handleDeleteTask, handleEditTask,refreshTasks,};
  }



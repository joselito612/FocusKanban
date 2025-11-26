import express from "express";
import { task } from "../models/task.js";

const router = express.Router();

// Obtener todas las tareas
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear tarea
router.post("/", async (req, res) => {
  try {
    const task = new Task(req.body);
    const saved = await task.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("Error al crear tarea:", error.message);
    res.status(400).json({ error: error.message });
  }
});

// 🔥 ACTUALIZAR tarea o alarma – ESTA RUTA DEBE IR ANTES DEL EXPORT
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const updateData = {};
    if (req.body.alarmDate !== undefined) updateData.alarmDate = req.body.alarmDate;
    if (req.body.alarmDateTime !== undefined) updateData.alarmDateTime = req.body.alarmDateTime;
    if (req.body.title !== undefined) updateData.title = req.body.title;
    if (req.body.column !== undefined) updateData.column = req.body.column;

    const updated = await Task.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(updated);
  } catch (error) {
    console.error("Error updating:", error);
    res.status(500).json({ message: "Error updating task" });
  }
});

// Eliminar tarea
router.delete("/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Tarea eliminada" });
});

// 👇 ESTA LÍNEA SIEMPRE DEBE IR AL FINAL
export default router;

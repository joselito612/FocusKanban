//tasksService.js
const API_URL = `${import.meta.env.VITE_API_URL}/tasks`;

// Obtener todas las tareas
export async function getTasks() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Error al obtener tareas");
  return res.json();
}

// Crear una nueva tarea
export async function createTask(task) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error("Error al crear tarea");
  return res.json();
}


// Actualizar columna (al mover tarea)
export async function updateTaskColumn(id, column) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ column }),
  });
  if (!res.ok) throw new Error("Error al actualizar tarea");
  return res.json();
}

// Actualizar otros campos de la tarea
export async function updateTask(id, updates) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Error al actualizar tarea");
  return res.json();
}

// Eliminar una tarea
export async function deleteTask(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar tarea");
  return res.json();
}

//actualizar la alarma de una tarea
export async function updateTaskReminder(id, alarmDate, alarmDateTime) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      alarmDate,
      alarmDateTime
    }),
  });

  if (!res.ok) throw new Error("Error actualizando alarma");
  return await res.json();
}

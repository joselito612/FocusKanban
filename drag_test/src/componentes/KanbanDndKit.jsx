// KanbanDndKit.js
import { useMemo } from "react";
import { DndContext } from "@dnd-kit/core";
import { useState,useEffect } from "react";
import { Draggable, Droppable } from "./DragComponent";
import TaskForm from "./TaskForm";
import { useTaskManager } from "./TaskManager";
import { useAlarmWatcher } from "../hooks/useAlarmWatcher";
import { AlarmModal } from "./AlarmModal";


import { getTasks, createTask, updateTaskReminder } from "../services/tasksService";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button,Snackbar,Alert } from "@mui/material";
import { es } from "date-fns/locale";
import { esES } from "@mui/x-date-pickers/locales";
import { MobileDateTimePicker,LocalizationProvider} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { AlarmList } from "./AlarmList";
import { useAlarms } from "../hooks/useAlarms";



export default function KanbanDndKit() {
  const initialColumns = { todo: [], doing: [], done: [] };
  const { columns, setColumns, addTask, moveTask,handleDeleteTask,handleEditTask,refreshTasks} = useTaskManager(initialColumns);
  const [formOpen, setFormOpen] = useState(false);
  const [activeColumn, setActiveColumn] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { alarms, addAlarm } = useAlarms();
  const [editingTask, setEditingTask] = useState(null);


  const [open, setOpen] = useState(false);

  const allTasks = useMemo(() => [
    ...(columns?.todo ?? []),
    ...(columns?.doing ?? []),
    ...(columns?.done ?? [])
  ], [columns]);

  const hasLoadedTasks = allTasks.length > 0;

  const { nextAlarm, triggerAlarm, closeAlarm } = useAlarmWatcher(
    hasLoadedTasks ? allTasks : []
  );




// ✅ Al montar, cargar tareas desde MongoDB
  useEffect(() => {
    async function loadTasks() {
      try {
        const tasks = await getTasks(); // ← obtiene las tareas de la API
        const loadedColumns = { todo: [], doing: [], done: [] };

        // Organizar las tareas por columna
        tasks.forEach(task => {
          if (loadedColumns[task.column]) {
            loadedColumns[task.column].push(task);
          }
        });

        setColumns(loadedColumns);
      } catch (error) {
        console.error("Error cargando tareas:", error);
      }
    }

    loadTasks();
  }, [setColumns]);

  const handleAddTaskClick = (column_id) => {
    setActiveColumn(column_id);
    setFormOpen(true);
  };

  const handleSaveTask = async (task) => {
    try {
      // Guardar en MongoDB
      const newTask = await createTask({ ...task, column: activeColumn });

      // Actualizar localmente
      addTask(activeColumn, newTask);
    } catch (error) {
      console.error("Error creando tarea:", error);
    } finally {
      setFormOpen(false);
    }
  };



  // Cuando el usuario elige "editar"
  const handleEditClick = (task) => {
    setSelectedTask(task);
    setOpenEdit(true);
  };

  // Cuando confirma el cambio
  const handleSaveDate = async (newDate) => {
    try {
      await updateTaskReminder(selectedTask._id, null, newDate);
      refreshTasks();
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error al actualizar alarma:", error);
    } finally {
      setOpenEdit(false);
    }
  };


   // cuando la alarma se dispara
  const handleAlarmTrigger = (alarm) => {
    setMessage(`⏰ La alarma "${alarm.title}" está sonando`);
    setOpen(true);

    // reproducir sonido
    try {
      const audio = new Audio(alarmSound);
      audio.play();
    } catch (e) {
      console.warn("Error reproduciendo sonido:", e);
    }
  };

  // iniciamos el watcher
  useAlarmWatcher(alarms, handleAlarmTrigger);

  const handleDragEnd = ({ active, over }) => {
    if (!over) return;
    const fromCol = Object.keys(columns).find(col =>
      columns[col].some(t => t._id === active.id)
    );
    const toCol = over.id;
    if (!fromCol || !toCol || fromCol === toCol) return;
    moveTask(fromCol, toCol, active.id);
  };

  const handleUpdateAlarm = async (taskId, updates) => {
    try {
      const updated = await updateTask(taskId, updates);

      // ACTUALIZAR columnas localmente
      setColumns(prev => {
        const newCols = {};
        for (const col in prev) {
          newCols[col] = prev[col].map(t => (t._id === taskId ? updated : t));
        }
        return newCols;
      });

      // RECARGAR tareas (crítico para el watcher)
      loadTasks();
    } catch (err) {
      console.error("Error actualizando alarma:", err);
    }
  };


  function EditAlarmModal({ open, onClose, onSave}) {
    const [newDate, setNewDate] = useState(null);

    useEffect(() => {
     
    },[]);

    return (
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="xs"
        sx={{
          "& .MuiDialog-container": {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
          "& .MuiPaper-root": {
            borderRadius: "16px",
            padding: "8px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            backdropFilter: "blur(4px)",
          },
        }}
        BackdropProps={{
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(2px)",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Editar alarma</DialogTitle>

        <DialogContent sx={{ mt: 1 }}>
          <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={es}
            localeText={esES.components.MuiLocalizationProvider.defaultProps.localeText}
          >
            <MobileDateTimePicker
              label="Nueva fecha y hora"
              value={newDate}
              onChange={(v) => setNewDate(v)}
              disablePast
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: "medium",
                  sx: { "& input": { fontSize: "1rem" } },
                },
              }}
            />
          </LocalizationProvider>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "space-between", px: 2 }}>
          <Button onClick={onClose} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={() => onSave(newDate)}
            variant="contained"
            disableElevation
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <>
      <DndContext onDragEnd={handleDragEnd}>
        <div style={{ display: "flex", gap: "1rem" }}>
          {Object.keys(columns).map(col => (
            <Droppable key={col} id={col} onAddTask={handleAddTaskClick}>
              {columns[col].map(task => (
                
                <Draggable key={task._id} id={task._id}
                 onEdit={() => {
                  const newTitle = prompt("Nuevo título:", task.title);
                  if (newTitle) handleEditTask(task._id, newTitle);
                }}
                onDelete={() => handleDeleteTask(task._id)} 
                onEditReminder={() => handleEditClick(task) } // 👈 pasar toda la tarea


                >
                
                {task.title}
                </Draggable>
                
              ))}
            </Droppable>
          ))}
          
          <EditAlarmModal
            open={openEdit}
            onClose={() => setOpenEdit(false)}
            onSave={handleSaveDate}
            initialDate={selectedTask?.reminder}
            disablePortal={false} 
          />
        </div>
      </DndContext>

      <TaskForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSaveTask}
      />


      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: "100%" }}>
          ✅ Alarma actualizada con éxito
        </Alert>
      </Snackbar>
 
        <div>
            {nextAlarm ? (
                <p>Próxima alarma: {nextAlarm.toLocaleString()}</p>
                ) : (
                  <p>No hay alarmas programadas</p>
                )}
              </div>

      <AlarmModal open={triggerAlarm} onClose={closeAlarm} />





    </>
  );
}

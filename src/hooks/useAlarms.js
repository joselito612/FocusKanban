// hooks/useAlarms.js
import { useEffect, useState, useRef } from "react";
import * as tasksService from "../services/tasksService";

export function useAlarms() {
  const [alarms, setAlarms] = useState([]);
  const [alarmToFire, setAlarmToFire] = useState(null);
  const intervalRef = useRef(null);

  // -------------------------
  // Cargar tareas desde backend
  // -------------------------
  const load = async () => {
    try {
      const tasks = await tasksService.getTasks();

      const upcoming = tasks
        .filter(t => t.alarmDateTime)
        .map(t => ({ ...t, alarmDateTime: new Date(t.alarmDateTime) }))
        .filter(t => t.alarmDateTime > new Date())
        .sort((a, b) => a.alarmDateTime - b.alarmDateTime);

      setAlarms(prev => {
        const changed =
          prev.length !== upcoming.length ||
          (prev[0] && upcoming[0] && prev[0]._id !== upcoming[0]._id);

        return changed ? upcoming : prev;
      });

    } catch (e) {
      console.error("load error", e);
    }
  };

  // --------------------------
  // Intervalo seguro (1 solo)
  // --------------------------
  useEffect(() => {
    load(); // primera carga

    intervalRef.current = setInterval(() => {
      load();
    }, 5000);

    return () => clearInterval(intervalRef.current);
  }, []); // se monta UNA sola vez

  // --------------------------
  // Detectar alarma que suena
  // --------------------------
  useEffect(() => {
    if (alarms.length === 0) return;

    const nextAlarm = alarms[0];
    const now = new Date();

    if (nextAlarm.alarmDateTime <= now) {
      setAlarmToFire(nextAlarm);
    }
  }, [alarms]);

  // --------------------------
  // Borrar alarma
  // --------------------------
  const removeAlarm = async (taskId) => {
    await tasksService.updateTask(taskId, { alarmDateTime: null });
    load();
  };

  return { alarms, alarmToFire, removeAlarm, refresh: load };
}

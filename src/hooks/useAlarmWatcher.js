import { useEffect, useState, useRef } from "react";

export function useAlarmWatcher(tasks) {
  const [nextAlarm, setNextAlarm] = useState(null);
  const [triggerAlarm, setTriggerAlarm] = useState(false);
  const audioRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio("/Timbre.mp3");
  }, []);

  useEffect(() => {
    // limpiar timer previo siempre
    if (timerRef.current) clearTimeout(timerRef.current);

    // evitar correr durante carga
    if (!Array.isArray(tasks) || tasks.length === 0) {
      setNextAlarm(null);
      return;
    }

    const now = new Date();

    const futureAlarms = tasks
      .map(t => t.alarmDateTime ? new Date(t.alarmDateTime) : null)
      .filter(date => date && date > now);

    if (futureAlarms.length === 0) {
      setNextAlarm(null);
      return;
    }

    // encontrar la más cercana
    const closest = futureAlarms.reduce((a, b) => (a < b ? a : b));

    // evitar re-render innecesario
    if (!nextAlarm || closest.getTime() !== nextAlarm.getTime()) {
      setNextAlarm(closest);
    }

    const diff = closest - now;
    if (diff <= 0) return;

    timerRef.current = setTimeout(() => {
      setTriggerAlarm(true);
      audioRef.current?.play().catch(err => console.warn("Sonido bloqueado:", err));
    }, diff);

    return () => clearTimeout(timerRef.current);
  }, [tasks]); // ← con esto funciona perfecto

  const closeAlarm = () => setTriggerAlarm(false);

  return { nextAlarm, triggerAlarm, closeAlarm };
}

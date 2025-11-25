// TaskForm.js
import { useState,useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, TextField, Button } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { es } from "date-fns/locale";
import { DatePicker, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

export default function TaskForm({ open, onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [alarmDate, setAlarmDate] = useState(null);
  const [alarmDateTime, setAlarmDateTime] = useState(null);

  useEffect(() => {
    const now = new Date();
    now.setSeconds(0);
    now.setMilliseconds(0);
    setAlarmDate(now);
    setAlarmDateTime(now);
  }, []);


  const handleSave = () => {
    if (!title) return;
    onSave({ title, alarmDate, alarmDateTime });
    setTitle("");
    setAlarmDate(null);
    setAlarmDateTime(null);
    onClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Nueva Tarea</DialogTitle>
        <DialogContent style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
          <TextField
            label="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            margin="normal"
          />
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
          <DatePicker
            label="Fecha de alarma"
            value={alarmDate}
            onChange={(newValue) => setAlarmDate(newValue)}
            minDate={new Date()} // 👈 evita fechas pasadas
          />
          <DateTimePicker
            label="Fecha y hora exacta"
            onChange={(newValue) => setAlarmDateTime(newValue)}
            minDateTime={new Date()} // 👈 evita fechas y horas pasadas
          />
          </LocalizationProvider>
          <Button onClick={handleSave} variant="contained" color="primary">Guardar</Button>
        </DialogContent>
      </Dialog>
    </LocalizationProvider>
  );
}

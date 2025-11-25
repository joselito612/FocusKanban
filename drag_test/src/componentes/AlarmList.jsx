// components/AlarmList.jsx
import { Card, CardContent, Typography } from "@mui/material";
import { getTimeRemaining } from "../utils/timeRemaining";
import { useAlarms } from "../hooks/useAlarms";

export function AlarmList() {
  const { alarms } = useAlarms();
  if (alarms.length === 0) return null;

  const next = alarms[0];
  const timeLeft = getTimeRemaining(next.alarmDateTime);

  return (
    <Card
      sx={{
        mb: 3,
        p: 2,
        borderRadius: "16px",
        boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
      }}
    >
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Próxima alarma ⏰
        </Typography>

        <Typography variant="body1" sx={{ mt: 1 }}>
          <strong>{next.title}</strong>
        </Typography>

        <Typography variant="body2" sx={{ color: "gray" }}>
          {new Date(next.alarmDateTime).toLocaleString()}
        </Typography>

        <Typography variant="body1" sx={{ mt: 1, fontWeight: 600 }}>
          {timeLeft}
        </Typography>
      </CardContent>
    </Card>
  );
}

// utils/timeRemaining.js
export function getTimeRemaining(targetDate) {
  const now = new Date();
  const diff = new Date(targetDate) - now;

  if (diff <= 0) return "Ya pasó";

  const minutes = Math.floor(diff / 1000 / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 60) return `Faltan ${minutes} min`;
  if (hours < 24) return `Faltan ${hours} h ${minutes % 60} min`;

  return `Faltan ${days} días`;
}

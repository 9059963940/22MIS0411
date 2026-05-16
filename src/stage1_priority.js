import { Log } from './logger.js';

const TYPE_WEIGHTS = { "Placement": 3, "Result": 2, "Event": 1 };

export function getTopNotifications(notifications, n = 10) {
  Log("frontend", "info", "utils", `Processing top ${n} priority updates`);
  if (!notifications || !Array.isArray(notifications)) return [];

  return [...notifications].sort((a, b) => {
    // Normalizing case checking for safe sorting weights
    const typeA = a.type || a.Type || "";
    const typeB = b.type || b.Type || "";
    const timeA = a.timestamp || a.Timestamp || 0;
    const timeB = b.timestamp || b.Timestamp || 0;

    const wA = TYPE_WEIGHTS[typeA] || 0;
    const wB = TYPE_WEIGHTS[typeB] || 0;
    
    if (wA !== wB) return wB - wA;
    return new Date(timeB) - new Date(timeA);
  }).slice(0, n);
}
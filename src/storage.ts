import type { TraceEvent } from "./types.js";
import { getConfig } from "./config.js";
import { refreshOverlay } from "./overlay.js";

const events: TraceEvent[] = [];

export const getEvents = (): TraceEvent[] => {
  return [...events];
};

export const addEvent = async (event: TraceEvent): Promise<void> => {
  const config = getConfig();

  if (config.bufferEvents !== false) {
    events.push(event);
  }

  if (config.transport) {
    await config.transport(event);
  }
  refreshOverlay();
};

export const clearEvents = (): void => {
  events.length = 0;
};
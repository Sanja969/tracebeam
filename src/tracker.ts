import { createId, getSessionId } from "./session.js";
import { addEvent } from "./storage.js";
import { getConfig } from "./config.js";
import type { TraceEventType } from "./types.js";

export const emitEvent = async (event: {
  name: string;
  type: TraceEventType;
  duration?: number;
  metadata?: Record<string, any>;
}) => {
  const config = getConfig();

  await addEvent({
    id: createId(),
    sessionId: getSessionId(config.sessionId),
    name: event.name,
    timestamp: Date.now(),
    type: event.type,
    ...(typeof event.duration === "number" && {
      duration: event.duration,
    }),
    ...(event.metadata && {
      metadata: event.metadata,
    }),
  });
};

export const track = async (name: string, metadata?: Record<string, any>) => {
  await emitEvent({
    name,
    type: "track",
    ...(metadata && { metadata }),
  });
};

export const captureError = async (
  error: Error,

  metadata?: Record<string, any>,
) => {
  await emitEvent({
    name: error.message,
    type: "error",
    ...(metadata && { metadata }),
  });
};

export const measure = async <T>(
  name: string,
  fn: () => Promise<T>,
  metadata?: Record<string, any>,
): Promise<T> => {
  const start = performance.now();

  try {
    return await fn();
  } catch (error) {
    if (error instanceof Error) {
      await captureError(error, {
        measuredTask: name,
        ...metadata,
      });
    }

    throw error;
  } finally {
    await emitEvent({
      name,
      type: "measure",
      duration: performance.now() - start,
      ...(metadata && { metadata }),
    });
  }
};

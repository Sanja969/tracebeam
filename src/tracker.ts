import { createId, getSessionId } from "./session.js"
import { addEvent } from "./storage.js"
import { getConfig } from "./config.js";

export const track = async (name: string, metadata?: Record<string, any>) => {
  const config = getConfig()

  await addEvent({
    id: createId(),
    sessionId: getSessionId(config.sessionId),
    name,
    timestamp: Date.now(),
    type: "track",
    ...(metadata && { metadata })
  })
}

export const captureError = async (error: Error, metadata?: Record<string, any>) => {
  const config = getConfig()

  await addEvent({
    id: createId(),
    sessionId: getSessionId(config.sessionId),
    name: error.message,
    timestamp: Date.now(),
    type: "error",
    ...(metadata && { metadata })
  })
}

export const measure = async <T>(name: string, fn: () => Promise<T>, metadata?: Record<string, any>): Promise<T> => {
  const config = getConfig()
  const start = performance.now();

    try {
      return await fn()
    } catch(error) {
      if (error instanceof Error) {
        await captureError(error, {measuredTask: name, ...metadata})
      }
      throw error
    } finally {
      await addEvent({
      id: createId(),
      sessionId: getSessionId(config.sessionId),
      name: name,
      timestamp: Date.now(),
      duration: performance.now() - start,
      type: "measure",
      ...(metadata && { metadata })
    })}
}
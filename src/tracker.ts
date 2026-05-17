import { addEvent } from "./storage.js"

const createId = (): string => {
  if(typeof crypto !== undefined) {
    return crypto.randomUUID()
  }

  return `${Date.now}-${Math.random().toString(36).slice(2)}`
}

export const track = async (name: string, metadata?: Record<string, any>) => {
  await addEvent({
    id: createId(),
    name,
    timestamp: Date.now(),
    type: "track",
    ...(metadata && { metadata })
  })
}

export const captureError = async (error: Error, metadata?: Record<string, any>) => {
  await addEvent({
    id: createId(),
    name: error.message,
    timestamp: Date.now(),
    type: "error",
    ...(metadata && { metadata })
  })
}

export const measure = async <T>(name: string, fn: () => Promise<T>, metadata?: Record<string, any>): Promise<T> => {
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
      name: name,
      timestamp: Date.now(),
      duration: performance.now() - start,
      type: "measure",
      ...(metadata && { metadata })
    })}
}
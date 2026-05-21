let sessionId: string | null = null;

export const createId = (): string => {
  if (crypto !== undefined && "randomUUID" in crypto) {
    return `session_${crypto.randomUUID()}`;
  }
  return sessionId = `session_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
}

export const getSessionId = (configureSessionId?: string): string => {
  if (configureSessionId) {
    return configureSessionId
  }

  if (!sessionId) {
    sessionId = createId()
  }

  return sessionId
}

export const resetSession = () => {
  sessionId = null
}
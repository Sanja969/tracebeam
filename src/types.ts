export type TraceEventType = "track" | "measure" | "error";

export interface TraceEvent {
  id: string;
  sessionId?: string;
  traceId?: string;
  name: string;
  timestamp: number;
  duration?: number;
  metadata?: Record<string, unknown>;
  type: TraceEventType;
}
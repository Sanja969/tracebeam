import type { TraceEvent } from "./types.js";

export type TracebeamTransport = (event: TraceEvent) => void | Promise<void>;

export type TracebeamConfig = {
  transport?: TracebeamTransport;
  bufferEvents?: boolean;
};

let config: TracebeamConfig = {
  bufferEvents: true,
};

export const configure = (options: TracebeamConfig): void => {
  config = {
    ...config,
    ...options,
  };
};

export const getConfig = (): TracebeamConfig => {
  return config;
};
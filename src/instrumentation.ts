import { captureError } from "./tracker.js";

let globalErrorCaptureEnabled = false;

export const enableGlobalErrorCapture = (): void => {
  if (globalErrorCaptureEnabled) {
    return;
  }

  globalErrorCaptureEnabled = true;

  window.addEventListener("error", (event) => {
    const error =
      event.error instanceof Error
        ? event.error
        : new Error(event.message);

    void captureError(error, {
      source: "window.onerror",
    });
  });

  window.addEventListener("unhandledrejection", (event) => {
    const error =
      event.reason instanceof Error
        ? event.reason
        : new Error(String(event.reason));

    void captureError(error, {
      source: "unhandledrejection",
    });
  });
};
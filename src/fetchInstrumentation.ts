import { captureError, emitEvent } from "./tracker.js";
import { measure } from "./tracker.js";

let fetchInstrumentationEnabled = false;
let originalFetch: typeof fetch | null = null;

export const recordMeasure = async (
  name: string,
  duration: number,
  metadata?: Record<string, any>,
) => {
  await emitEvent({
    name,
    type: "measure",
    duration,
    ...(metadata && { metadata }),
  });
};

export const enableFetchInstrumentation = (): void => {
  if (fetchInstrumentationEnabled) {
    return;
  }

  if (typeof window === "undefined" || typeof window.fetch !== "function") {
    return;
  }

  fetchInstrumentationEnabled = true;
  originalFetch = window.fetch.bind(window);

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = getFetchUrl(input);
    const method = init?.method || "GET";
    const start = performance.now();

    try {
      const response = await originalFetch!(input, init);
      const duration = performance.now() - start;

      await recordMeasure(`fetch ${method} ${url}`, duration, {
        source: "fetch",
        url,
        method,
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });

      if (!response.ok) {
        await captureError(
          new Error(`Fetch failed with status ${response.status}`),
          {
            source: "fetch",
            url,
            method,
            status: response.status,
            statusText: response.statusText,
            ok: response.ok,
          },
        );
      }

      return response;
    } catch (error) {
      const duration = performance.now() - start;

      if (error instanceof Error) {
        await captureError(error, {
          source: "fetch",
          url,
          method,
          duration,
        });
      }

      throw error;
    }
  };
};

export const disableFetchInstrumentation = (): void => {
  if (!fetchInstrumentationEnabled || !originalFetch) {
    return;
  }

  window.fetch = originalFetch;
  originalFetch = null;
  fetchInstrumentationEnabled = false;
};

const getFetchUrl = (input: RequestInfo | URL): string => {
  if (typeof input === "string") {
    return input;
  }

  if (input instanceof URL) {
    return input.toString();
  }

  return input.url;
};

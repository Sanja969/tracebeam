import { captureError } from "./tracker.js";
import { measure } from "./tracker.js";

let fetchInstrumentationEnabled = false;
let originalFetch: typeof fetch | null = null;

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

    try {
      const response = await measure(
        `fetch ${method} ${url}`,
        async () => {
          return originalFetch!(input, init);
        },
        {
          source: "fetch",
          url,
          method,
        },
      );

      if (!response.ok) {
        await captureError(new Error(`Fetch failed with status ${response.status}`), {
          source: "fetch",
          url,
          method,
          status: response.status,
          statusText: response.statusText,
        });
      }

      return response;
    } catch (error) {
      await captureError(error as Error, {
        source: "fetch",
        url,
        method,
      });

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
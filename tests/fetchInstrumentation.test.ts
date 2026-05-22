import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  clearEvents,
  enableFetchInstrumentation,
  getEvents,
} from "../src/index.js";
import { disableFetchInstrumentation } from "../src/fetchInstrumentation.js";

describe("fetch instrumentation", () => {
  beforeEach(() => {
    clearEvents();
    disableFetchInstrumentation();
    vi.restoreAllMocks();
  });

  it("tracks successful fetch requests", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      json: async () => ({ success: true }),
    });

    vi.stubGlobal("fetch", mockFetch);

    enableFetchInstrumentation();

    await fetch("/api/users");

    const events = getEvents();

    expect(events.length).toBeGreaterThan(0);

    expect(events[0]?.type).toBe("measure");

    expect(events[0]?.name).toContain("fetch GET /api/users");
  });

  it("captures failed fetch responses", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });

    vi.stubGlobal("fetch", mockFetch);

    enableFetchInstrumentation();

    await fetch("/api/fail");

    const events = getEvents();

    const errorEvent = events.find((event) => event.type === "error");

    expect(errorEvent).toBeDefined();

    expect(errorEvent?.metadata?.status).toBe(500);
  });

  it("captures thrown fetch errors", async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error("Network failed"));

    vi.stubGlobal("fetch", mockFetch);

    enableFetchInstrumentation();

    await expect(fetch("/api/crash")).rejects.toThrow("Network failed");

    const events = getEvents();

    const errorEvent = events.find((event) => event.type === "error");

    expect(errorEvent).toBeDefined();

    expect(errorEvent?.metadata?.url).toBe("/api/crash");
  });
});

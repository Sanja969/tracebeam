import { describe, it, expect, beforeEach } from "vitest";
import {
  track,
  measure,
  captureError,
  getEvents,
  clearEvents,
  configure,
  resetConfig
} from "../src/index.js";

beforeEach(() => {
  clearEvents();
  resetConfig();
});

describe("tracebeam", () => {
  it("tracks custom events", async () => {
    await track("user-login", {
      provider: "google",
    });

    const events = getEvents();

    expect(events).toHaveLength(1);
    expect(events[0]?.name).toBe("user-login");
    expect(events[0]?.type).toBe("track");
    expect(events[0]?.metadata).toEqual({
      provider: "google",
    });
  });

  it("measures async operations", async () => {
    await measure("fetch-users", async () => {
      await Promise.resolve();
      return ["Sanja"];
    });

    const events = getEvents();

    expect(events).toHaveLength(1);
    expect(events[0]?.name).toBe("fetch-users");
    expect(events[0]?.type).toBe("measure");
    expect(events[0]?.duration).toBeTypeOf("number");
  });

  it("captures runtime errors", async () => {
    await captureError(new Error("Something failed"), {
      source: "auth-flow",
    });

    const events = getEvents();

    expect(events).toHaveLength(1);
    expect(events[0]?.name).toBe("Something failed");
    expect(events[0]?.type).toBe("error");
  });

  it("clears buffered events", async () => {
    await track("test-event");

    clearEvents();

    expect(getEvents()).toHaveLength(0);
  });

  it("uses custom transport", async () => {
    const transportedEvents: unknown[] = [];

    configure({
      bufferEvents: false,
      transport: async (event) => {
        transportedEvents.push(event);
      },
    });

    await track("transport-test");

    expect(getEvents()).toHaveLength(0);
    expect(transportedEvents).toHaveLength(1);
  });
});
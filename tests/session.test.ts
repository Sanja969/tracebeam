import { describe, it, expect, beforeEach } from "vitest";
import { track, getEvents, clearEvents, resetConfig, resetSession, configure } from "../src/index.js";

beforeEach(() => {
  clearEvents();
  resetConfig();
  resetSession();
});

describe("session", () => {
  it("adds generated sessionId to events", async () => {
    await track("test-event");

    const events = getEvents();

    expect(events[0]?.sessionId).toBeDefined();
    expect(events[0]?.sessionId).toMatch(/^session_/);
  });

  it("uses configured sessionId", async () => {
    configure({
      sessionId: "custom-session-1",
    });

    await track("test-event");

    const events = getEvents();

    expect(events[0]?.sessionId).toBe("custom-session-1");
  });

  it("keeps same generated sessionId across events", async () => {
    await track("event-one");
    await track("event-two");

    const events = getEvents();

    expect(events[0]?.sessionId).toBe(events[1]?.sessionId);
  });
});
import { describe, it, expect, beforeEach } from "vitest";

import {
  clearEvents,
  getEvents,
  enableGlobalErrorCapture,
} from "../src/index.js";

beforeEach(() => {
  clearEvents();
});

describe("global error capture", () => {
  it("captures unhandled promise rejections", async () => {
    enableGlobalErrorCapture();

    window.dispatchEvent(
      new PromiseRejectionEvent("unhandledrejection", {
        promise: Promise.resolve(),
        reason: new Error("Promise failed"),
      }),
    );

    await new Promise((resolve) => setTimeout(resolve, 0));

    const events = getEvents();

    expect(events.length).toBeGreaterThan(0);
    expect(events[0]?.type).toBe("error");
  });
});

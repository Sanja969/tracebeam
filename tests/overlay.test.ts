import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  enableOverlay,
  disableOverlay,
  track,
  clearEvents,
  resetConfig,
} from "../src/index.js";

beforeEach(() => {
  document.body.innerHTML = "";
  clearEvents();
  resetConfig();
});

afterEach(() => {
  disableOverlay();
});

describe("overlay", () => {
  it("renders the overlay when enabled", () => {
    enableOverlay();

    const overlay = document.querySelector("#tracebeam-overlay");

    expect(overlay).not.toBeNull();
    expect(overlay?.textContent).toContain("Tracebeam");
  });

  it("updates the overlay when an event is tracked", async () => {
    enableOverlay();

    await track("user-login", {
      provider: "google",
    });

    const overlay = document.querySelector("#tracebeam-overlay");

    expect(overlay?.textContent).toContain("user-login".toLowerCase());
    expect(overlay?.textContent).toContain("TRACK");
  });

  it("removes the overlay when disabled", () => {
    enableOverlay();
    disableOverlay();

    const overlay = document.querySelector("#tracebeam-overlay");

    expect(overlay).toBeNull();
  });
});
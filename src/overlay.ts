import type { TraceEvent } from "./types.js";
import { getEvents } from "./storage.js";

let overlayEnabled = false;
let overlayElement: HTMLDivElement | null = null;

const formatEvent = (event: TraceEvent): string => {
  const duration =
    event.duration !== undefined ? ` — ${event.duration.toFixed(2)}ms` : "";

  return `${event.type.toUpperCase()} · ${event.name}${duration}`;
};

const renderOverlay = (): void => {
  if (!overlayEnabled || typeof document === "undefined") return;

  if (!overlayElement) {
    overlayElement = document.createElement("div");
    overlayElement.id = "tracebeam-overlay";

    overlayElement.style.position = "fixed";
    overlayElement.style.bottom = "20px";
    overlayElement.style.right = "20px";
    overlayElement.style.width = "320px";
    overlayElement.style.maxHeight = "360px";
    overlayElement.style.overflowY = "auto";
    overlayElement.style.background = "rgba(10, 10, 10, 0.92)";
    overlayElement.style.color = "#30fffe";
    overlayElement.style.border = "1px solid #30fffe";
    overlayElement.style.borderRadius = "12px";
    overlayElement.style.padding = "14px";
    overlayElement.style.fontFamily = "monospace";
    overlayElement.style.fontSize = "12px";
    overlayElement.style.zIndex = "999999";
    overlayElement.style.boxShadow = "0 0 18px rgba(48, 255, 254, 0.45)";

    document.body.appendChild(overlayElement);
  }

  const events = getEvents().slice(-10).reverse();

  overlayElement.innerHTML = `
    <div style="font-weight: bold; margin-bottom: 10px; font-size: 14px;">
      ⚡ Tracebeam
    </div>
    ${
      events.length
        ? events
            .map(
              (event) => `
                <div style="border-top: 1px solid rgba(48,255,254,0.25); padding: 8px 0;">
                  ${formatEvent(event)}
                </div>
              `
            )
            .join("")
        : `<div style="opacity: 0.7;">No events yet</div>`
    }
  `;
};

export const enableOverlay = (): void => {
  overlayEnabled = true;
  renderOverlay();
};

export const disableOverlay = (): void => {
  overlayEnabled = false;

  if (overlayElement) {
    overlayElement.remove();
    overlayElement = null;
  }
};

export const refreshOverlay = (): void => {
  renderOverlay();
};
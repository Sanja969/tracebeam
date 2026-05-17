# Tracebeam ⚡

Minimal TypeScript tracing SDK for measuring async operations, tracking events, and capturing runtime errors.

Tracebeam helps developers debug async flows, monitor performance, and inspect custom events with a lightweight and TypeScript-first API.

---

## Features

- ⚡ Lightweight
-	🧠 TypeScript-first
-	📦 ESM + CommonJS support
-	⏱ Async performance measurements
-	🚨 Error tracking
-	🗂 Optional in-memory event buffering
-	🚀 Custom transport support
-	🔍 Developer-friendly tracing utilities

---

## Installation

```bash
npm install tracebeam
```

---

## Usage

### Configure Tracebeam

```ts
import { configure } from "tracebeam";

configure({
  bufferEvents: true,

  transport: async (event) => {
    await fetch("/api/trace-events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    });
  },
});
```

### Track custom events

```ts
import { track } from "tracebeam";

await track("user-login", {
  provider: "google",
});
```

### Measure async operations

```ts
import { measure } from "tracebeam";

const users = await measure("fetch-users", async () => {
  const response = await fetch("/api/users");
  return response.json();
});
```

### Capture runtime errors

```ts
import { captureError } from "tracebeam";

try {
  throw new Error("Something failed");
} catch (error) {
  await captureError(error as Error, {
    source: "auth-flow",
  });
}
```

### Read buffered events

```ts
import { getEvents } from "tracebeam";

console.log(getEvents());
```

### Clear buffered events

```ts
import { clearEvents } from "tracebeam";

clearEvents();
```

---

## Example Event

```json
{
  "id": "d9f6c3...",
  "name": "fetch-users",
  "timestamp": 1715950000000,
  "duration": 42.37,
  "type": "measure",
  "metadata": {
    "endpoint": "/api/users"
  }
}
```

---

## Full Example

```ts
import {
  configure,
  track,
  measure,
  captureError,
  getEvents,
} from "tracebeam";

configure({
  transport: async (event) => {
    await fetch("/api/trace-events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    });
  },
});

await track("app-start");

await measure("fetch-data", async () => {
  await fetch("https://api.example.com/data");
});

try {
  throw new Error("Something exploded");
} catch (error) {
  await captureError(error as Error);
}

console.log(getEvents());
```

---

## API

### configure(options)

Configures Tracebeam behavior.

#### Parameters

| Parameter | Type |
|---|---|
| bufferEvents | boolean |
| transport | (event: TraceEvent) => void \| Promise<void> |

### track(name, metadata?)

Tracks a custom event.

#### Parameters

| Parameter | Type |
|---|---|
| name | string |
| metadata | Record<string, unknown> |


### measure(name, fn, metadata?)

Measures async function duration.

#### Parameters


| Parameter | Type |
|---|---|
| name | string |
| fn | () => Promise<T> |
| metadata | Record<string, unknown> |

### captureError(error, metadata?)

Captures runtime errors.

#### Parameters

| Parameter | Type |
|---|---|
| error | Error |
| metadata | Record<string, unknown> |

### getEvents()

Returns buffered events from local runtime memory.

### clearEvents()

Clears buffered events.

---

## Motivation

Tracebeam was built as a lightweight developer tracing utility focused on simplicity, extensibility, performance visibility, and modern TypeScript workflows.

---

## License

MIT



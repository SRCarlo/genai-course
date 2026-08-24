import { NodeSDK } from "@opentelemetry/sdk-node";

import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";

import { resourceFromAttributes } from "@opentelemetry/resources";

import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from "@opentelemetry/semantic-conventions";

import {
  PeriodicExportingMetricReader,
  ConsoleMetricExporter,
} from "@opentelemetry/sdk-metrics";

import { ConsoleSpanExporter } from "@opentelemetry/sdk-trace-node";

import { env } from "./config/env.js";

const resource = resourceFromAttributes({
  [ATTR_SERVICE_NAME]: env.otelServiceName,

  [ATTR_SERVICE_VERSION]: env.otelServiceVersion,
});

const sdk = new NodeSDK({
  resource,

  traceExporter: new ConsoleSpanExporter(),

  metricReader: new PeriodicExportingMetricReader({
    exporter: new ConsoleMetricExporter(),

    exportIntervalMillis: 10000,
  }),

  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();

console.log(
  JSON.stringify({
    level: "info",
    message: "OpenTelemetry initialized",
    service: env.otelServiceName,
  }),
);

process.on("SIGTERM", async () => {
  await sdk.shutdown();

  process.exit(0);
});
